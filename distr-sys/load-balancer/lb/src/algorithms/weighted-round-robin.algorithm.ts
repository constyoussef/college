import { LoadBalancingAlgorithm, RequestContext } from './algorithm.interface';
import { NodeConfig } from '../config/nodes.config';

/**
 * Weighted Round Robin Algorithm
 *
 * Distributes requests proportionally based on configured node weights.
 * Nodes with higher weights receive proportionally more traffic.
 *
 * Implementation: builds an expanded index list based on weights,
 * then round-robins over it.
 *
 * Example: weights [3, 2, 1] → sequence [n1, n1, n1, n2, n2, n3] repeating
 *
 * Time Complexity: O(1) per selection after initialization
 * Space Complexity: O(Σ weights) for the expanded list
 */
export class WeightedRoundRobinAlgorithm implements LoadBalancingAlgorithm {
  readonly name = 'weighted_round_robin';
  private currentIndex = 0;
  private expandedList: number[] = [];
  private lastNodeSignature = '';

  selectNode(nodes: NodeConfig[], _context: RequestContext): NodeConfig {
    // Rebuild expanded list if node configuration changed
    const signature = nodes.map((n) => `${n.id}:${n.weight}`).join(',');
    if (signature !== this.lastNodeSignature) {
      this.rebuildExpandedList(nodes);
      this.lastNodeSignature = signature;
    }

    const nodeIndex = this.expandedList[this.currentIndex % this.expandedList.length];
    this.currentIndex++;
    return nodes[nodeIndex];
  }

  /**
   * Build the expanded index list based on node weights.
   * E.g., weights [3, 2, 1] → [0, 0, 0, 1, 1, 2]
   */
  private rebuildExpandedList(nodes: NodeConfig[]): void {
    this.expandedList = [];
    for (let i = 0; i < nodes.length; i++) {
      const weight = Math.max(1, nodes[i].weight);
      for (let w = 0; w < weight; w++) {
        this.expandedList.push(i);
      }
    }
  }
}
