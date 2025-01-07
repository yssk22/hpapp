export type TaskQueueResult<T> = [T, undefined] | [undefined, Error];

export default class TaskQueue {
  private queue: Promise<void> = Promise.resolve();

  enqueue<T>(task: () => Promise<T>): Promise<TaskQueueResult<T>> {
    const resultPromise = this.queue.then(() =>
      task().then(
        (result) => [result, undefined] as [T, undefined],
        (err) => [undefined, err] as [undefined, Error]
      )
    );
    this.queue = resultPromise.then(() => {});
    return resultPromise;
  }
}
