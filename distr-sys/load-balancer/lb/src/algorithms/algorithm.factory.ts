import { LoadBalancingAlgorithm } from './algorithm.interface';
import { RoundRobinAlgorithm } from './round-robin.algorithm';
import { RandomAlgorithm } from './random.algorithm';
import { LeastConnectionsAlgorithm } from './least-connections.algorithm';
import { HashBasedAlgorithm } from './hash-based.algorithm';
import { WeightedRoundRobinAlgorithm } from './weighted-round-robin.algorithm';

/**
 * Algorithm Factory
 *
 * Maps algorithm names (from the `algo` query parameter) to their implementations.
 * Each algorithm is a singleton instance — state (like round-robin counters
 * and connection counts) persists across requests.
 */
const ALGORITHMS: Record<string, LoadBalancingAlgorithm> = {
  round_robin: new RoundRobinAlgorithm(),
  random: new RandomAlgorithm(),
  least_connections: new LeastConnectionsAlgorithm(),
  hash: new HashBasedAlgorithm(),
  weighted_round_robin: new WeightedRoundRobinAlgorithm(),
};

/**
 * Get a load balancing algorithm by name.
 * @param name - Algorithm identifier (e.g., "round_robin")
 * @returns The algorithm instance
 * @throws Error if the algorithm name is not recognized
 */
export function getAlgorithm(name: string): LoadBalancingAlgorithm {
  const algorithm = ALGORITHMS[name];
  if (!algorithm) {
    const available = Object.keys(ALGORITHMS).join(', ');
    throw new Error(`Unknown algorithm "${name}". Available: ${available}`);
  }
  return algorithm;
}

/**
 * Get list of all supported algorithm names.
 */
export function getAvailableAlgorithms(): string[] {
  return Object.keys(ALGORITHMS);
}
