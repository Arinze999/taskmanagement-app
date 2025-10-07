import * as Yup from 'yup';

export const TaskStatusEnum = {
  TODO: 'TODO',
  DOING: 'DOING',
  DONE: 'DONE',
} as const;

export type TaskStatus = keyof typeof TaskStatusEnum;

export interface TaskType {
  id?: string;
  userId?: string;
  title: string;
  description: string;
  status: TaskStatus;
  position?: number;
}

export const TaskSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  status: Yup.mixed<TaskStatus>()
    .oneOf(Object.keys(TaskStatusEnum) as TaskStatus[], 'Invalid status')
    .required('Status is required'),
  position: Yup.number()
    .min(0, 'Position must be >= 0')
    .optional(),
});

export type TaskData = Yup.InferType<typeof TaskSchema>;

export const taskInitialValues: TaskData = {
  title: '',
  description: '',
  status: TaskStatusEnum.TODO,
  position: 0,
};
