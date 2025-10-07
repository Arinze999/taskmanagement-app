import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export type Task = {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: 'TODO' | 'DOING' | 'DONE';
  position: number;
  createdAt?: string;
  updatedAt?: string;
};

interface TasksState {
  items: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  items: [],
  loading: false,
  error: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.items = action.payload;
      state.error = null;
    },
    taskAdded: (state, action: PayloadAction<Task>) => {
      state.items.push(action.payload);
      state.error = null;
    },
    taskUpdated: (state, action: PayloadAction<Task>) => {
      const updated = action.payload;
      const idx = state.items.findIndex((t) => t.id === updated.id);
      if (idx !== -1) {
        state.items[idx] = updated;
      }
      state.error = null;
    },
    taskDeleted: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearTasks: (state) => {
      state.items = [];
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  setTasks,
  taskAdded,
  taskUpdated,
  taskDeleted,
  setLoading,
  setError,
  clearTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;

export const selectTasksState = (s: RootState) => s.tasks;

export const selectAllTasks = (s: RootState) => s.tasks.items;

export const selectTaskById = (id: string) => (s: RootState) =>
  s.tasks.items.find((t) => t.id === id);

export const selectTasksByStatus = (status: string) => (s: RootState) =>
  s.tasks.items.filter((t) => t.status === status);
