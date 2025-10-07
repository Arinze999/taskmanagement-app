'use client';

import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase/client';
import { useAppDisPatch, useAppSelector } from '@/redux/store';
import { Task, taskUpdated, selectAllTasks } from '@/redux/slices/tasksSlice';
import { EDIT_TASK } from '@/utils/supabase/rpc';

type TaskEditInput = Partial<
  Pick<Task, 'title' | 'description' | 'status' | 'position'>
>;

export type UseEditTaskResult = {
  editTask: (id: string, input: TaskEditInput) => Promise<void>;
  loading: boolean;
  error: string | null;
};

export function useEditTask(): UseEditTaskResult {
  const supabase = createClient();
  const dispatch = useAppDisPatch();
  const tasks = useAppSelector(selectAllTasks);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editTask = useCallback(
    async (id: string, input: TaskEditInput) => {
      setLoading(true);
      setError(null);

      const { error: rpcError } = await supabase.rpc(EDIT_TASK, {
        p_task_id: id,
        p_body: input,
      });

      if (rpcError) {
        setError(rpcError.message);
        toast.error('Could not update task.');
        setLoading(false);
        return;
      }

      const existing = tasks.find((t) => t.id === id);
      if (!existing) {
        // If not found locally, skip optimistic merge (a fresh fetch hook will reload).
        toast.success('Task updated.');
        setLoading(false);
        return;
      }

      const merged: Task = {
        ...existing,
        ...input,
        updatedAt: new Date().toISOString(),
      };

      dispatch(taskUpdated(merged));
      toast.success('Task updated.');
      setLoading(false);
    },
    [dispatch, supabase, tasks]
  );

  return { editTask, loading, error };
}
