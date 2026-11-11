import type { Subtask } from './types';

export function calculateProgress(subtasks: Subtask[]): number {
  const totalWeight = subtasks.reduce((sum, subtask) => sum + (subtask.weight ?? 1), 0);
  const completedWeight = subtasks.reduce(
    (sum, subtask) => sum + (subtask.completedAt ? (subtask.weight ?? 1) : 0),
    0,
  );
  return totalWeight === 0 ? 0 : (completedWeight / totalWeight) * 100;
}
