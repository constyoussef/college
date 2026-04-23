import { LoadBalancingAlgorithm, RequestContext } from './algorithm.interface';
import { NodeConfig } from '../config/nodes.config';

/**
 * Least Connections Algorithm
 *
 * Routes each request to the node with the fewest active connections.
 * Adapts to variable processing times — slower nodes naturally receive
 * fewer requests as their connection count stays higher.
 *
 * Time Complexity: O(n) per selection where n = number of nodes
 */
export class LeastConnectionsAlgorithm implements LoadBalancingAlgorithm {
  readonly name = 'least_connections';
  private connections: Map<string, number> = new Map();

  selectNode(nodes: NodeConfig[], _context: RequestContext): NodeConfig {
    let minConnections = Infinity;
    let selectedNode = nodes[0];

    for (const node of nodes) {
      const count = this.connections.get(node.id) || 0;
      if (count < minConnections) {
        minConnections = count;
        selectedNode = node;
      }
    }

    return selectedNode;
  }

  onRequestStart(nodeId: string): void {
    const current = this.connections.get(nodeId) || 0;
    this.connections.set(nodeId, current + 1);
  }

  onRequestEnd(nodeId: string): void {
    const current = this.connections.get(nodeId) || 0;
    this.connections.set(nodeId, Math.max(0, current - 1));
  }
}
