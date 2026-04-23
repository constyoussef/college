import { LoadBalancingAlgorithm, RequestContext } from './algorithm.interface';
import { NodeConfig } from '../config/nodes.config';

/**
 * Round Robin Algorithm
 *
 * Distributes requests evenly across all nodes in sequential order.
 * Simple and fair — each node gets an equal share of traffic.
 *
 * Time Complexity: O(1) per selection
 */
export class RoundRobinAlgorithm implements LoadBalancingAlgorithm {
  readonly name = 'round_robin';
  private currentIndex = 0;

  selectNode(nodes: NodeConfig[], _context: RequestContext): NodeConfig {
    const node = nodes[this.currentIndex % nodes.length];
    this.currentIndex++;
    return node;
  }
}
