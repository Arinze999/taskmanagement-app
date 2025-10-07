'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useEffect,
} from 'react';
import { useAppSelector } from '@/redux/store';
import { Task, selectTaskById } from '@/redux/slices/tasksSlice';

type EditTaskContextValue = {
  editingId: string | null;
  task: Task | undefined;
  isEditing: boolean;
  beginEdit: (taskId: string) => void;
  clearEdit: () => void;
  registerFormAnchor: (el: HTMLElement | null) => void;
};

const EditTaskContext = createContext<EditTaskContextValue | undefined>(undefined);

export function EditTaskProvider({ children }: { children: React.ReactNode }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  // Keep a handle to the form container so we can scroll/focus it from anywhere
  const formAnchorRef = useRef<HTMLElement | null>(null);

  // Pull the live task from Redux (stays in sync if the list updates)
  const task = useAppSelector(editingId ? selectTaskById(editingId) : () => undefined);

  const registerFormAnchor = useCallback((el: HTMLElement | null) => {
    formAnchorRef.current = el;
  }, []);

  const scrollToForm = useCallback((offset = 100) => {
    const el = formAnchorRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });

    // Nudge focus to the title input for fast editing
    setTimeout(() => {
      document.querySelector<HTMLInputElement>('input[name="title"]')?.focus();
    }, 150);
  }, []);

  const beginEdit = useCallback(
    (taskId: string) => {
      setEditingId(taskId);
      // Wait a frame so the UI can re-render with editing state, then scroll
      if (typeof window !== 'undefined') {
        requestAnimationFrame(() => scrollToForm());
      }
    },
    [scrollToForm]
  );

  const clearEdit = useCallback(() => setEditingId(null), []);

  // Safety: if editingId changes from elsewhere, still bring the form into view
  useEffect(() => {
    if (editingId) {
      scrollToForm();
    }
  }, [editingId, scrollToForm]);

  const value = useMemo(
    () => ({
      editingId,
      task,
      isEditing: Boolean(editingId && task),
      beginEdit,
      clearEdit,
      registerFormAnchor,
    }),
    [editingId, task, beginEdit, clearEdit, registerFormAnchor]
  );

  return <EditTaskContext.Provider value={value}>{children}</EditTaskContext.Provider>;
}

export function useEditTaskContext() {
  const ctx = useContext(EditTaskContext);
  if (!ctx) throw new Error('useEditTaskContext must be used within EditTaskProvider');
  return ctx;
}
