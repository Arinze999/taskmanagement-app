'use client';

import { useCallback, useState } from 'react';
import { useAppDisPatch, useAppSelector } from '@/redux/store';
import { selectAuth } from '@/redux/slices/authSlice';
import { setTasks, type Task } from '@/redux/slices/tasksSlice';
import { createClient } from '@/utils/supabase/client';

type UseFetchTasksResult = {
  fetchTasks: () => Promise<void>;
  loading: boolean;
  error: string | null;
};

export function useFetchTasks(): UseFetchTasksResult {
  const dispatch = useAppDisPatch();
  const auth = useAppSelector(selectAuth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!auth.id) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from('Task')
        .select('*')
        .eq('userId', auth.id)
        .order('position', { ascending: true })
        .returns<Task[]>(); 

      if (error) throw error;
      if (!data) throw new Error('No data returned from tasks fetch.');

      // Dispatch ordered list (position ASC: lowest at top)
      dispatch(setTasks(data as Task[]));
    } catch (e: any) {
      setError(e.message ?? 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [auth.id, dispatch]);

  return { fetchTasks, loading, error };
}
