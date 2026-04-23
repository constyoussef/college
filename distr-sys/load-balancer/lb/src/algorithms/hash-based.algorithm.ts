import { LoadBalancingAlgorithm, RequestContext } from './algorithm.interface';
import { NodeConfig } from '../config/nodes.config';

/**
 * Hash-Based Algorithm
 *
 * Deterministically routes requests based on a hash of the `n` parameter
 * or client IP. Ensures the same input always goes to the same node,
 * useful for cache affinity and session stickiness.
 *
 * Uses a simple DJB2-style hash function for fast, well-distributed hashing.
 *
 * Time Complexity: O(k) per selection where k = length of hash key string
 */
export class HashBasedAlgorithm implements LoadBalancingAlgorithm {
  readonly name = 'hash';

  selectNode(nodes: NodeConfig[], context: RequestContext): NodeConfig {
    // Combine n and client IP to create the hash key
    const key = `${context.n}:${context.clientIp}`;
    const hashValue = this.hash(key);
    const index = Math.abs(hashValue) % nodes.length;
    return nodes[index];
  }

  /**
   * DJB2 hash function — fast, simple, well-distributed.
   * Produces a 32-bit integer hash from a string.
   */
  private hash(str: string): number {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      // hash * 33 + char
      hash = ((hash << 5) + hash) + str.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }
}
