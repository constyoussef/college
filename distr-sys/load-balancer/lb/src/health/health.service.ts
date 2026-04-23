import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import axios from 'axios';
import { NODES, NodeConfig } from '../config/nodes.config';

/**
 * Health Check Service
 *
 * Periodically pings all worker nodes via GET /health.
 * Maintains a set of healthy node IDs. Unhealthy nodes are
 * excluded from load balancing until they recover.
 */
@Injectable()
export class HealthService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(HealthService.name);
  private healthyNodes: Set<string> = new Set();
  private intervalHandle: ReturnType<typeof setInterval> | null = null;

  /** Health check interval in milliseconds */
  private readonly CHECK_INTERVAL_MS = 10_000;
  /** Timeout for each health check request */
  private readonly CHECK_TIMEOUT_MS = 3_000;

  onModuleInit(): void {
    // Initially mark all nodes as healthy (optimistic start)
    for (const node of NODES) {
      this.healthyNodes.add(node.id);
    }

    // Start periodic health checks
    this.intervalHandle = setInterval(() => {
      this.checkAllNodes();
    }, this.CHECK_INTERVAL_MS);

    this.logger.log(
      `Health checks started (interval=${this.CHECK_INTERVAL_MS}ms, nodes=${NODES.length})`,
    );
  }

  onModuleDestroy(): void {
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
    }
  }

  /**
   * Get the list of currently healthy nodes.
   * Only these nodes are eligible for load balancing.
   */
  getHealthyNodes(): NodeConfig[] {
    return NODES.filter((node) => this.healthyNodes.has(node.id));
  }

  /**
   * Check if a specific node is healthy.
   */
  isHealthy(nodeId: string): boolean {
    return this.healthyNodes.has(nodeId);
  }

  /**
   * Manually mark a node as unhealthy (e.g., after a failed request).
   */
  markUnhealthy(nodeId: string): void {
    if (this.healthyNodes.has(nodeId)) {
      this.healthyNodes.delete(nodeId);
      this.logger.warn(`Node ${nodeId} marked UNHEALTHY`);
    }
  }

  /**
   * Ping all nodes and update health status.
   */
  private async checkAllNodes(): Promise<void> {
    const checks = NODES.map((node) => this.checkNode(node));
    await Promise.allSettled(checks);
  }

  /**
   * Ping a single node's /health endpoint.
   */
  private async checkNode(node: NodeConfig): Promise<void> {
    try {
      const response = await axios.get(`${node.url}/health`, {
        timeout: this.CHECK_TIMEOUT_MS,
      });

      if (response.data?.status === 'ok') {
        if (!this.healthyNodes.has(node.id)) {
          this.healthyNodes.add(node.id);
          this.logger.log(`Node ${node.id} recovered — marked HEALTHY`);
        }
      } else {
        this.markUnhealthy(node.id);
      }
    } catch {
      this.markUnhealthy(node.id);
    }
  }
}
