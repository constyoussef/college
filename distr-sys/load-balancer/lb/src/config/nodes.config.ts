/**
 * Worker node configuration.
 * Defines all backend nodes the load balancer distributes traffic to.
 */
export interface NodeConfig {
  /** Unique identifier for this node */
  id: string;
  /** Internal Docker network URL */
  url: string;
  /** Weight for Weighted Round Robin algorithm (higher = more traffic) */
  weight: number;
}

/**
 * Worker node definitions.
 * URLs use Docker service names (resolved via Docker internal DNS).
 * Weights: node-1 gets 3x traffic, node-2 gets 2x, node-3 gets 1x in WRR.
 */
export const NODES: NodeConfig[] = [
  { id: 'node-1', url: 'http://node1:3001', weight: 3 },
  { id: 'node-2', url: 'http://node2:3002', weight: 2 },
  { id: 'node-3', url: 'http://node3:3003', weight: 1 },
];
