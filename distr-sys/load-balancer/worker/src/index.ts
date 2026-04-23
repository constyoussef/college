import express, { Request, Response } from 'express';
import { computeH } from './calc';
import { TaskQueue } from './queue';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);
const NODE_ID = process.env.NODE_ID || 'node-unknown';
const CONCURRENCY = parseInt(process.env.CONCURRENCY || '2', 10);

const taskQueue = new TaskQueue(CONCURRENCY);
const startUpTime = Date.now();

/**
 * GET /calc?n=5
 *
 * Enqueues the H(n) computation in the task queue.
 * Returns the result, processing time, node ID, and queue depth.
 */
app.get('/calc', async (req: Request, res: Response) => {
  const n = parseInt(req.query.n as string, 10);

  if (isNaN(n) || n < 1) {
    res.status(400).json({ error: 'Parameter "n" must be a positive integer' });
    return;
  }

  const queueDepthAtEntry = taskQueue.totalCount;

  console.log(
    `[${NODE_ID}] Received calc n=${n} | pending=${taskQueue.pendingCount} active=${taskQueue.activeCount}`,
  );

  try {
    const result = await taskQueue.enqueue(() => {
      return new Promise<{ result: number; processingTimeMs: number }>((resolve) => {
        const computed = computeH(n);
        resolve(computed);
      });
    });

    console.log(
      `[${NODE_ID}] Completed calc n=${n} | result=${result.result} | time=${result.processingTimeMs}ms`,
    );

    res.json({
      result: result.result,
      processingTimeMs: result.processingTimeMs,
      nodeId: NODE_ID,
      queueDepth: queueDepthAtEntry,
    });
  } catch (err) {
    console.error(`[${NODE_ID}] Error processing calc n=${n}:`, err);
    res.status(500).json({ error: 'Internal computation error' });
  }
});

/**
 * GET /health
 *
 * Health check endpoint for the load balancer.
 */
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    nodeId: NODE_ID,
    activeConnections: taskQueue.activeCount,
    pendingTasks: taskQueue.pendingCount,
    uptime: Math.round((Date.now() - startUpTime) / 1000),
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(
    `[${NODE_ID}] Worker node listening on port ${PORT} (concurrency=${CONCURRENCY})`,
  );
});
