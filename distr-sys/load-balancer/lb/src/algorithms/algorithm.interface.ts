import { NodeConfig } from '../config/nodes.config';

/**
 * Context passed to the algorithm for making routing decisions.
 */
export interface RequestContext {
  /** The `n` parameter from the client request */
  n: number;
  /** The client's IP address (for hash-based routing) */
  clientIp: string;
}

/**
 * Strategy interface for load balancing algorithms.
 *
 * All algorithms implement this interface, enabling the factory
 * to swap strategies without changing the core forwarding logic.
 */
export interface LoadBalancingAlgorithm {
  /** Human-readable name of the algorithm */
  readonly name: string;

  /**
   * Select a node from the available pool.
   * @param nodes - List of healthy nodes to choose from
   * @param context - Request metadata for routing decisions
   * @returns The selected node configuration
   */
  selectNode(nodes: NodeConfig[], context: RequestContext): NodeConfig;

  /**
   * Called when a request begins processing on a node.
   * Used by algorithms like Least Connections to track active load.
   */
  onRequestStart?(nodeId: string): void;

  /**
   * Called when a request finishes processing on a node.
   */
  onRequestEnd?(nodeId: string): void;
}
