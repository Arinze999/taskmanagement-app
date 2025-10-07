'use client';

import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase/client';
import { useAppDisPatch } from '@/redux/store';
import { taskDeleted } from '@/redux/slices/tasksSlice';
import { DELETE_TASK } from '@/utils/supabase/rpc';

export type UseDeleteTaskResult = {
  deleteTask: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
};

export function useDeleteTask(): UseDeleteTaskResult {
  const supabase = createClient();
  const dispatch = useAppDisPatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTask = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);

      const { error: rpcError } = await supabase.rpc(DELETE_TASK, {
        p_task_id: id,
      });

      if (rpcError) {
        setError(rpcError.message);
        toast.error('Could not delete task.');
        setLoading(false);
        return;
      }

      dispatch(taskDeleted(id));
      toast.success('Task deleted.');
      setLoading(false);
    },
    [dispatch, supabase]
  );

  return { deleteTask, loading, error };
}
