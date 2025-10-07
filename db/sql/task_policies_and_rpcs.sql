-- Enable RLS on Task table
ALTER TABLE public."Task"
  ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Select own tasks" ON public."Task";
DROP POLICY IF EXISTS "Insert own tasks" ON public."Task";
DROP POLICY IF EXISTS "Update own tasks" ON public."Task";
DROP POLICY IF EXISTS "Delete own tasks" ON public."Task";

-- SELECT: only allow reading your own tasks
CREATE POLICY "Select own tasks"
  ON public."Task"
  FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.uid())::text = "userId"
  );

-- INSERT: allow insert only when the row's userId equals auth.uid()
CREATE POLICY "Insert own tasks"
  ON public."Task"
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT auth.uid())::text = "userId"
  );

-- UPDATE: allow update only on your own tasks; check the new row's userId too
CREATE POLICY "Update own tasks"
  ON public."Task"
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT auth.uid())::text = "userId"
  )
  WITH CHECK (
    (SELECT auth.uid())::text = "userId"
  );

-- DELETE: only allow deletion of your own tasks
CREATE POLICY "Delete own tasks"
  ON public."Task"
  FOR DELETE
  TO authenticated
  USING (
    (SELECT auth.uid())::text = "userId"
  );


--   Create Task RPC 
-- Make sure pgcrypto extension exists (for gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION public.create_task_rpc(
  p_user_id text,
  p_title text,
  p_description text,
  p_status public."TaskStatus"
)
RETURNS public."Task"
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_max_pos double precision;
  v_new_task public."Task"%ROWTYPE;
BEGIN
  -- Compute new position for this user and status
  SELECT COALESCE(MAX(position), 0)
    INTO v_max_pos
    FROM public."Task"
    WHERE "userId" = p_user_id AND status = p_status;

  -- Insert new task; createdAt, updatedAt use column defaults
  INSERT INTO public."Task" (
    id,
    "userId",
    title,
    description,
    status,
    position
  ) VALUES (
    gen_random_uuid()::text,   -- id, as text
    p_user_id,
    p_title,
    p_description,
    p_status,
    v_max_pos + 1
  )
  RETURNING * INTO v_new_task;

  RETURN v_new_task;
END;
$$;


-- Task updatedAt triger
-- 1. Create a trigger function that updates updatedAt
CREATE OR REPLACE FUNCTION public.set_task_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW."updatedAt" = now();
  RETURN NEW;
END;
$$;

-- 2. Attach that trigger to the Task table
CREATE TRIGGER task_updated_at_trigger
BEFORE UPDATE
ON public."Task"
FOR EACH ROW
EXECUTE FUNCTION public.set_task_updated_at();


-- Delete Task RPC
-- Delete an owned task by id and return the deleted row
-- Uses SECURITY INVOKER so RLS still applies (recommended).
CREATE OR REPLACE FUNCTION public.delete_task_rpc(
  p_task_id text
)
RETURNS public."Task"
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  v_deleted public."Task"%ROWTYPE;
BEGIN
  -- Enforce ownership via RLS + explicit user filter for clarity
  DELETE FROM public."Task"
  WHERE id = p_task_id
    AND "userId" = (SELECT auth.uid())::text
  RETURNING * INTO v_deleted;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Task not found or you do not have permission to delete it'
      USING ERRCODE = '22023'; -- invalid_parameter_value (generic, readable)
  END IF;

  RETURN v_deleted;
END;
$$;


-- Edit Task RPC
-- Remove any conflicting overloads (uuid version)
drop function if exists public.edit_task_rpc(uuid, jsonb);

-- Recreate with proper enum casting for "status"
create or replace function public.edit_task_rpc(
  p_task_id text,
  p_body    jsonb
)
returns public."Task"
language plpgsql
security invoker
as $$
declare
  v_updated public."Task"%rowtype;
begin
  update public."Task" t
  set
    "title"       = coalesce(p_body->>'title', t."title"),
    "description" = coalesce(p_body->>'description', t."description"),
    -- Cast JSON text -> "TaskStatus" enum before COALESCE
    "status"      = coalesce( nullif(p_body->>'status','')::"TaskStatus", t."status"),
    "position"    = coalesce( nullif(p_body->>'position','')::int, t."position"),
    "updatedAt"   = now()
  where t.id = p_task_id
    and t."userId" = (select auth.uid())::text
  returning * into v_updated;

  if not found then
    raise exception 'Task not found or you do not have permission to edit it'
      using errcode = '22023';
  end if;

  return v_updated;
end;
$$;

grant execute on function public.edit_task_rpc(text, jsonb) to authenticated;

-- Optional: nudge PostgREST to refresh
notify pgrst, 'reload schema';

