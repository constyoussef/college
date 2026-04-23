/**
 * Async task queue with configurable concurrency.
 *
 * Simulates real server thread/process pool limits.
 * Tasks are enqueued and executed up to `concurrency` at a time.
 * Excess tasks wait in line until a slot frees up.
 */
export class TaskQueue {
  private _activeCount = 0;
  private _pendingCount = 0;
  private readonly queue: Array<() => void> = [];

  constructor(private readonly concurrency: number = 2) {}

  /**
   * Enqueue a task for execution.
   * Returns a promise that resolves with the task's result once it completes.
   */
  enqueue<T>(task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this._pendingCount++;

      const run = async () => {
        this._pendingCount--;
        this._activeCount++;

        try {
          const result = await task();
          resolve(result);
        } catch (err) {
          reject(err);
        } finally {
          this._activeCount--;
          this.dequeue();
        }
      };

      if (this._activeCount < this.concurrency) {
        run();
      } else {
        this.queue.push(run);
      }
    });
  }

  private dequeue(): void {
    if (this.queue.length > 0 && this._activeCount < this.concurrency) {
      const next = this.queue.shift();
      if (next) next();
    }
  }

  get activeCount(): number {
    return this._activeCount;
  }

  get pendingCount(): number {
    return this._pendingCount;
  }

  get totalCount(): number {
    return this._activeCount + this._pendingCount;
  }
}
