'use client';
import { useCallback, useState } from 'react';
import { CREATE_TASK } from '@/utils/supabase/rpc';
import { createClient } from '@/utils/supabase/client';
import type { TaskType } from '@/schemas/task.schema';
import { Task, taskAdded } from '@/redux/slices/tasksSlice';
import { selectAuth } from '@/redux/slices/authSlice';
import { useAppSelector, useAppDisPatch } from '@/redux/store';
import { toast } from 'react-toastify';

type UseCreateTaskResult = {
  createTask: (
    input: Omit<TaskType, 'id' | 'position' | 'userId'>
  ) => Promise<void>;
  loading: boolean;
  error: string | null;
};

export function useCreateTask(): UseCreateTaskResult {
  const dispatch = useAppDisPatch();
  const auth = useAppSelector(selectAuth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = auth.id;

  const createTask = useCallback(
    async (input: Omit<TaskType, 'id' | 'position' | 'userId'>) => {
      if (!userId) {
        setError('User not authenticated');
        return;
      }
      setLoading(true);
      setError(null);

      const supabase = createClient();

      try {
        const { data, error: rpcError } = await supabase
          .rpc(CREATE_TASK, {
            p_user_id: userId,
            p_title: input.title,
            p_description: input.description,
            p_status: input.status,
          })
          .single();

        if (rpcError) {
          throw rpcError;
        }
        if (!data) {
          throw new Error('No data returned');
        }

        toast.success('Task created', {
          autoClose: 3000,
        });
        dispatch(taskAdded(data as Task));
      } catch (e: any) {
        setError(e.message ?? 'Failed to create task');
      } finally {
        setLoading(false);
      }
    },
    [dispatch, userId]
  );

  return { createTask, loading, error };
}
