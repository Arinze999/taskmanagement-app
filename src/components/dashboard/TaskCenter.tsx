'use client';
import React, { useEffect, useMemo, useRef } from 'react';
import { FormComponent } from '../form/FormComponent';
import { TaskData, taskInitialValues, TaskSchema } from '@/schemas/task.schema';
import { TextInputField2 } from '../form/FormField';
import { StatusSelector } from './StatusSelector';
import ValidatingFormSubmitButton from '../buttons/ValidatingFormSubmitButton';
import { useCreateTask } from '@/hooks/tasks/useCreateTask';
import { FormikHelpers } from 'formik';
import Tasks from './Tasks/Tasks';
import { useFetchTasks } from '@/hooks/tasks/useFetchTasks';
import { useEditTaskContext } from '@/context/EditTaskContext';
import { useEditTask } from '@/hooks/tasks/useEditTask';

const TaskCenter = () => {
  const { loading, createTask } = useCreateTask();

  const { editTask, loading: updating } = useEditTask();

  const { loading: fetching, fetchTasks } = useFetchTasks();

  const { task, isEditing, clearEdit, registerFormAnchor } =
    useEditTaskContext();

  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerFormAnchor(anchorRef.current);
  }, [registerFormAnchor]);

  const formInitialValues: TaskData = useMemo(
    () => ({
      title: task?.title ?? taskInitialValues.title,
      description: task?.description ?? taskInitialValues.description,
      status: task?.status ?? taskInitialValues.status,
      // include position if it's part of TaskData
      position:
        (task as any)?.position ?? (taskInitialValues as any)?.position ?? 0,
    }),
    [task]
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // replace
  const handleSubmit = async (
    values: TaskData,
    actions: FormikHelpers<TaskData>
  ) => {
    try {
      if (isEditing && task) {
        await editTask(task.id, values);
        clearEdit();
        actions.resetForm({ values: taskInitialValues });
      } else {
        await createTask(values);
        actions.resetForm({ values: taskInitialValues });
      }
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <div className="my-3 col-start-mid">
      <h4 className="font-bold text-xl" ref={anchorRef}>
        {isEditing ? 'Edit Task' : 'Create New Task'}
      </h4>
      <FormComponent
        schema={TaskSchema}
        initialValues={formInitialValues}
        onSubmit={handleSubmit}
        className="w-full max-w-[500px]"
      >
        <TextInputField2 name="title" label="Title" />
        <TextInputField2 name="description" label="Description" />
        <StatusSelector name="status" />
        <div>
          {' '}
          {isEditing && (
            <button
              type="button"
              onClick={clearEdit}
              className="btn-ghost ml-2 text-orange-700 cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
        <ValidatingFormSubmitButton
          loading={loading || updating}
          disabled={loading || updating}
        >
          {isEditing ? 'Update' : 'Create'}
        </ValidatingFormSubmitButton>
      </FormComponent>
      {fetching ? 'Loading your tasks' : <Tasks />}
    </div>
  );
};

export default TaskCenter;
