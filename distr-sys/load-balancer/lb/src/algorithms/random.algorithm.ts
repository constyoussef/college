import { LoadBalancingAlgorithm, RequestContext } from './algorithm.interface';
import { NodeConfig } from '../config/nodes.config';

/**
 * Random Algorithm
 *
 * Selects a node at random for each request.
 * Statistically even distribution over large request counts,
 * but may cause short-term imbalances.
 *
 * Time Complexity: O(1) per selection
 */
export class RandomAlgorithm implements LoadBalancingAlgorithm {
  readonly name = 'random';

  selectNode(nodes: NodeConfig[], _context: RequestContext): NodeConfig {
    const index = Math.floor(Math.random() * nodes.length);
    return nodes[index];
  }
}
