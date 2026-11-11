import { describe, expect, it } from 'vitest';
import { calculateProgress } from './progress';

describe('calculateProgress', () => {
  it('should return 0 when there are no subtasks', () => {
    expect(calculateProgress([])).toBe(0);
  });

  it('should return 100 when all subtasks are completed', () => {
    const subtasks = [
      { id: '1', taskId: '1', title: 'Subtask 1', position: 1, weight: 1, completedAt: '2023-01-01' },
      { id: '2', taskId: '1', title: 'Subtask 2', position: 2, weight: 1, completedAt: '2023-01-01' },
    ];
    expect(calculateProgress(subtasks)).toBe(100);
  });

  it('should return 50 when half of the subtasks are completed', () => {
    const subtasks = [
      { id: '1', taskId: '1', title: 'Subtask 1', position: 1, weight: 1, completedAt: '2023-01-01' },
      { id: '2', taskId: '1', title: 'Subtask 2', position: 2, weight: 1, completedAt: undefined },
    ];
    expect(calculateProgress(subtasks)).toBe(50);
  });

  it('should return 0 when there are no subtasks', () => {
    expect(calculateProgress([])).toBe(0);
  });

  it('should return 0 when all subtasks are incomplete', () => {
    const subtasks = [
      { id: '1', taskId: '1', title: 'Subtask 1', position: 1, weight: 1, completedAt: undefined },
      { id: '2', taskId: '1', title: 'Subtask 2', position: 2, weight: 1, completedAt: undefined },
    ];
    expect(calculateProgress(subtasks)).toBe(0);
  });

  it('should return the correct progress when subtasks have different weights', () => {
    const subtasks = [
      { id: '1', taskId: '1', title: 'Subtask 1', position: 1, weight: 2, completedAt: '2023-01-01' },
      { id: '2', taskId: '1', title: 'Subtask 2', position: 2, weight: 1, completedAt: undefined },
    ];
    expect(calculateProgress(subtasks)).toBeCloseTo(66.67, 2);
  });
});