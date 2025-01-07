import TaskQueue, { TaskQueueResult } from './TaskQueue';

class TaskQueueSample extends TaskQueue {
  public readonly taskResult: string[] = [];

  public async taskA(): Promise<TaskQueueResult<string>> {
    return this.enqueue(async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.taskResult.push('A');
          resolve('A');
        }, 100);
      });
    });
  }

  public async taskB(): Promise<TaskQueueResult<string>> {
    return this.enqueue(async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.taskResult.push('B');
          resolve('B');
        }, 0);
      });
    });
  }

  public async taskC(): Promise<TaskQueueResult<string>> {
    return this.enqueue(async () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.taskResult.push('C');
          reject(new Error('error'));
        }, 0);
      });
    });
  }
}

describe('TaskQueue', () => {
  test('enqueue', async () => {
    const taskQueue = new TaskQueueSample();
    // taskA is executed first while it wait for 100 msec, and taskB is executed after taskA is completed.
    const [[a], [b]] = await Promise.all([taskQueue.taskA(), taskQueue.taskB()]);
    expect(a).toBe('A');
    expect(b).toBe('B');
    expect(taskQueue.taskResult).toEqual(['A', 'B']);
  });

  test('enqueue with error', async () => {
    const taskQueue = new TaskQueueSample();
    const [[a], [c, err], [b]] = await Promise.all([taskQueue.taskA(), taskQueue.taskC(), taskQueue.taskB()]);
    expect(a).toBe('A');
    expect(b).toBe('B');
    expect(c).toBe(undefined);
    expect(err).toBeInstanceOf(Error);
    expect(taskQueue.taskResult).toEqual(['A', 'C', 'B']);
  });
});
