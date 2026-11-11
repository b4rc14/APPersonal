export type Task = {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  projectId?: string;
  creationDate: string;
  dueDate: string;
  submissionLink?: string;
  estimatedTimeHours?: number;
};

export type Subtask = {
  id: string;
  taskId: string;
  title: string;
  position: number;
  weight?: number;
  completedAt?: string;
};

export type Project = {
  id: string;
  ownerId: string;
  name: string;
  color: string;
};
