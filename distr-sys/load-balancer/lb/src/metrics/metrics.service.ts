import { Injectable } from '@nestjs/common';

/**
 * Single recorded request metric.
 */
export interface RequestMetric {
  timestamp: number;
  algorithm: string;
  nodeId: string;
  responseTimeMs: number;
  success: boolean;
}

/**
 * Aggregated statistics computed from collected metrics.
 */
export interface AggregatedStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  avgLatencyMs: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  requestsPerSecond: number;
  perNode: Record<string, { count: number; avgLatencyMs: number }>;
  perAlgorithm: Record<string, { count: number; avgLatencyMs: number }>;
}

/**
 * Histogram bucket for response time distribution.
 */
export interface HistogramBucket {
  rangeLabel: string;
  minMs: number;
  maxMs: number;
  count: number;
}

/**
 * Metrics Service
 *
 * In-memory metrics store for load balancer performance data.
 * Collects per-request metrics and computes aggregated statistics
 * including percentiles, per-node/algorithm breakdowns, and histograms.
 */
@Injectable()
export class MetricsService {
  private metrics: RequestMetric[] = [];

  /**
   * Record a single request metric.
   */
  record(metric: RequestMetric): void {
    this.metrics.push(metric);
  }

  /**
   * Get aggregated statistics from all collected metrics.
   */
  getStats(): AggregatedStats {
    if (this.metrics.length === 0) {
      return {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        avgLatencyMs: 0,
        p50LatencyMs: 0,
        p95LatencyMs: 0,
        p99LatencyMs: 0,
        requestsPerSecond: 0,
        perNode: {},
        perAlgorithm: {},
      };
    }

    const total = this.metrics.length;
    const successful = this.metrics.filter((m) => m.success).length;
    const failed = total - successful;

    // Sort latencies for percentile calculation
    const latencies = this.metrics
      .map((m) => m.responseTimeMs)
      .sort((a, b) => a - b);

    const avgLatency =
      latencies.reduce((sum, l) => sum + l, 0) / latencies.length;

    // Calculate time span for RPS
    const firstTimestamp = Math.min(...this.metrics.map((m) => m.timestamp));
    const lastTimestamp = Math.max(...this.metrics.map((m) => m.timestamp));
    const durationSec = Math.max(1, (lastTimestamp - firstTimestamp) / 1000);
    const rps = total / durationSec;

    // Per-node breakdown
    const perNode: Record<string, { count: number; totalMs: number }> = {};
    for (const m of this.metrics) {
      if (!perNode[m.nodeId]) {
        perNode[m.nodeId] = { count: 0, totalMs: 0 };
      }
      perNode[m.nodeId].count++;
      perNode[m.nodeId].totalMs += m.responseTimeMs;
    }

    const perNodeResult: Record<string, { count: number; avgLatencyMs: number }> = {};
    for (const [nodeId, data] of Object.entries(perNode)) {
      perNodeResult[nodeId] = {
        count: data.count,
        avgLatencyMs: Math.round((data.totalMs / data.count) * 100) / 100,
      };
    }

    // Per-algorithm breakdown
    const perAlgo: Record<string, { count: number; totalMs: number }> = {};
    for (const m of this.metrics) {
      if (!perAlgo[m.algorithm]) {
        perAlgo[m.algorithm] = { count: 0, totalMs: 0 };
      }
      perAlgo[m.algorithm].count++;
      perAlgo[m.algorithm].totalMs += m.responseTimeMs;
    }

    const perAlgoResult: Record<string, { count: number; avgLatencyMs: number }> = {};
    for (const [algo, data] of Object.entries(perAlgo)) {
      perAlgoResult[algo] = {
        count: data.count,
        avgLatencyMs: Math.round((data.totalMs / data.count) * 100) / 100,
      };
    }

    return {
      totalRequests: total,
      successfulRequests: successful,
      failedRequests: failed,
      avgLatencyMs: Math.round(avgLatency * 100) / 100,
      p50LatencyMs: this.percentile(latencies, 50),
      p95LatencyMs: this.percentile(latencies, 95),
      p99LatencyMs: this.percentile(latencies, 99),
      requestsPerSecond: Math.round(rps * 100) / 100,
      perNode: perNodeResult,
      perAlgorithm: perAlgoResult,
    };
  }

  /**
   * Get response time distribution as histogram buckets.
   */
  getHistogram(): HistogramBucket[] {
    const bucketRanges = [
      { label: '0-50ms', min: 0, max: 50 },
      { label: '50-100ms', min: 50, max: 100 },
      { label: '100-200ms', min: 100, max: 200 },
      { label: '200-500ms', min: 200, max: 500 },
      { label: '500ms-1s', min: 500, max: 1000 },
      { label: '1-2s', min: 1000, max: 2000 },
      { label: '2-5s', min: 2000, max: 5000 },
      { label: '5-10s', min: 5000, max: 10000 },
      { label: '10s+', min: 10000, max: Infinity },
    ];

    return bucketRanges.map((range) => ({
      rangeLabel: range.label,
      minMs: range.min,
      maxMs: range.max,
      count: this.metrics.filter(
        (m) => m.responseTimeMs >= range.min && m.responseTimeMs < range.max,
      ).length,
    }));
  }

  /**
   * Clear all collected metrics.
   */
  reset(): void {
    this.metrics = [];
  }

  /**
   * Calculate a percentile value from a sorted array.
   */
  private percentile(sorted: number[], p: number): number {
    if (sorted.length === 0) return 0;
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return Math.round(sorted[Math.max(0, index)] * 100) / 100;
  }
}
