import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { performance } from 'perf_hooks';
import { getAlgorithm } from './algorithms/algorithm.factory';
import { RequestContext } from './algorithms/algorithm.interface';
import { NodeConfig } from './config/nodes.config';
import { HealthService } from './health/health.service';
import { MetricsService } from './metrics/metrics.service';

export interface LBResponse {
  result: number;
  processingTimeMs: number;
  totalResponseTimeMs: number;
  nodeUsed: string;
  algorithm: string;
  queueDepth?: number;
}

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private readonly MAX_RETRIES = 2;
  private readonly REQUEST_TIMEOUT_MS = 300_000; // 5 min — handle massive queues

  constructor(
    private readonly healthService: HealthService,
    private readonly metricsService: MetricsService,
  ) {}

  async handleCalcRequest(n: number, algoName: string, clientIp: string): Promise<LBResponse> {
    const totalStart = performance.now();
    const algorithm = getAlgorithm(algoName);
    const context: RequestContext = { n, clientIp };
    const healthyNodes = this.healthService.getHealthyNodes();

    if (healthyNodes.length === 0) {
      throw new Error('No healthy nodes available');
    }

    let lastError: Error | null = null;
    const triedNodes: Set<string> = new Set();

    for (let attempt = 0; attempt <= this.MAX_RETRIES; attempt++) {
      const availableNodes = healthyNodes.filter((node) => !triedNodes.has(node.id));
      if (availableNodes.length === 0) break;

      const selectedNode = algorithm.selectNode(availableNodes, context);
      triedNodes.add(selectedNode.id);

      algorithm.onRequestStart?.(selectedNode.id);

      try {
        const response = await axios.get(`${selectedNode.url}/calc?n=${n}`, {
          timeout: this.REQUEST_TIMEOUT_MS,
        });
        algorithm.onRequestEnd?.(selectedNode.id);

        const totalResponseTimeMs = Math.round((performance.now() - totalStart) * 100) / 100;

        this.metricsService.record({
          timestamp: Date.now(),
          algorithm: algoName,
          nodeId: selectedNode.id,
          responseTimeMs: totalResponseTimeMs,
          success: true,
        });

        this.logger.log(`[${algoName}] ← ${selectedNode.id} done in ${totalResponseTimeMs}ms`);

        return {
          result: response.data.result,
          processingTimeMs: response.data.processingTimeMs,
          totalResponseTimeMs,
          nodeUsed: selectedNode.id,
          algorithm: algoName,
          queueDepth: response.data.queueDepth,
        };
      } catch (err) {
        algorithm.onRequestEnd?.(selectedNode.id);
        lastError = err as Error;
        this.logger.error(`[${algoName}] ${selectedNode.id} failed: ${(err as Error).message}`);
        this.healthService.markUnhealthy(selectedNode.id);
      }
    }

    const totalResponseTimeMs = Math.round((performance.now() - totalStart) * 100) / 100;
    this.metricsService.record({
      timestamp: Date.now(),
      algorithm: algoName,
      nodeId: 'none',
      responseTimeMs: totalResponseTimeMs,
      success: false,
    });

    throw new Error(`All nodes failed. Last error: ${lastError?.message}`);
  }
}
