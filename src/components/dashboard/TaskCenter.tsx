'use client';
import React, { useEffect } from 'react';
import { FormComponent } from '../form/FormComponent';
import { TaskData, taskInitialValues, TaskSchema } from '@/schemas/task.schema';
import { TextInputField2 } from '../form/FormField';
import { StatusSelector } from './StatusSelector';
import ValidatingFormSubmitButton from '../buttons/ValidatingFormSubmitButton';
import { useCreateTask } from '@/hooks/tasks/useCreateTask';
import { FormikHelpers } from 'formik';
import Tasks from './Tasks/Tasks';
import { useFetchTasks } from '@/hooks/tasks/useFetchTasks';

const TaskCenter = () => {
  const { loading, createTask } = useCreateTask();

  const { loading: fetching, fetchTasks } = useFetchTasks();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleSubmit = (values: TaskData, actions: FormikHelpers<TaskData>) => {
    createTask(values);
    actions.resetForm({ values: taskInitialValues });
  };

  return (
    <div className="h-[200rem] my-3 col-start-mid">
      <h4>Create New Task</h4>
      <FormComponent
        schema={TaskSchema}
        initialValues={taskInitialValues}
        onSubmit={handleSubmit}
        className="w-full max-w-[500px]"
      >
        <TextInputField2 name="title" label="Title" />
        <TextInputField2 name="description" label="Description" />
        <StatusSelector name="status" />
        <ValidatingFormSubmitButton loading={loading} disabled={loading}>
          Create
        </ValidatingFormSubmitButton>
      </FormComponent>
      {fetching ? 'Loading your tasks' : <Tasks />}
    </div>
  );
};

export default TaskCenter;
