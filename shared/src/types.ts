export type Task = {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  projectId?: string;
  taskCreationDate: string;
  dueDate: string;
  submissionLink?: string;
  estimatedTimeHours?: number;
};

export type ProgressUpdate = {
  id: string;
  taskId: string;
  taskPercentageDone: number;
  taskUpdateDate: string;
};

export type Project = {
  id: string;
  ownerId: string;
  name: string;
  color: string;
};
