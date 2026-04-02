/**
 * HTTP Client — Handles all inter-node communication.
 *
 * Each node uses this module to send Paxos messages (Prepare, Accept, Decide)
 * and to query the status of other nodes on startup.
 *
 * Nodes are addressed by container name (e.g., "node1:3000") which Docker
 * DNS resolves automatically on the shared network.
 */

import axios from 'axios';
import { Logger } from '../node/logger';
import {
  PeerStatus,
  PeerPrepareResult,
  PeerAcceptResult,
  PromiseResponse,
  AcceptedResponse,
  NodeStatus,
  DecideResponse,
} from '../paxos/types';

const TIMEOUT_MS = 5000; // Per-request timeout

export class HttpClient {
  private nodeId: number;
  private logger: Logger;
  private peers: string[];

  constructor(nodeId: number, nodeList: string, logger: Logger) {
    this.nodeId = nodeId;
    this.logger = logger;

    // Parse NODE_LIST ("node1:3000,node2:3000,...") into an array of peer URLs,
    // excluding ourselves so we never send messages to our own container.
    this.peers = nodeList
      .split(',')
      .map((n) => n.trim())
      .filter((n) => !n.startsWith(`node${nodeId}`))
      .map((n) => `http://${n}`);

    this.logger.info(`Peers configured: ${this.peers.join(', ')}`);
  }

  // ─── Status / Discovery ────────────────────────────────────────────

  /**
   * Query every peer for their current Paxos status.
   * Used on startup to decide whether to become Proposer or Acceptor/Learner.
   * Failures are expected (peers may not be up yet) and silently swallowed.
   */
  async queryAllStatuses(): Promise<PeerStatus[]> {
    const results: PeerStatus[] = [];

    const requests = this.peers.map(async (peerUrl) => {
      try {
        const res = await axios.get<NodeStatus>(`${peerUrl}/status`, {
          timeout: TIMEOUT_MS,
        });
        results.push({ peer: peerUrl, status: res.data });
      } catch {
        // Peer not up yet — that's fine during startup
        this.logger.warn(`Could not reach ${peerUrl} for status check`);
      }
    });

    await Promise.all(requests);
    return results;
  }

  // ─── Phase 1a: PREPARE ──────────────────────────────────────────────

  /**
   * Send PREPARE(proposalNumber) to all peers.
   * Returns an array of { peer, response } for those that replied.
   */
  async sendPrepare(proposalNumber: number): Promise<PeerPrepareResult[]> {
    this.logger.paxos('PREPARE', `Sending PREPARE(${proposalNumber}) to all peers`);

    const promises = this.peers.map((peerUrl) =>
      axios
        .post<PromiseResponse>(
          `${peerUrl}/paxos/prepare`,
          { proposalNumber, proposerId: this.nodeId },
          { timeout: TIMEOUT_MS }
        )
        .then((res): PeerPrepareResult => {
          this.logger.paxos('PREPARE', `Received response from ${peerUrl}`, res.data);
          return { peer: peerUrl, response: res.data };
        })
        .catch((err: Error): null => {
          this.logger.warn(`PREPARE to ${peerUrl} failed: ${err.message}`);
          return null;
        })
    );

    const results = await Promise.all(promises);
    return results.filter((r): r is PeerPrepareResult => r !== null);
  }

  // ─── Phase 2a: ACCEPT ──────────────────────────────────────────────

  /**
   * Send ACCEPT(proposalNumber, value) to all peers.
   * Returns an array of { peer, response } for those that replied.
   */
  async sendAccept(proposalNumber: number, value: number): Promise<PeerAcceptResult[]> {
    this.logger.paxos(
      'ACCEPT',
      `Sending ACCEPT(${proposalNumber}, value=${value}) to all peers`
    );

    const promises = this.peers.map((peerUrl) =>
      axios
        .post<AcceptedResponse>(
          `${peerUrl}/paxos/accept`,
          { proposalNumber, value, proposerId: this.nodeId },
          { timeout: TIMEOUT_MS }
        )
        .then((res): PeerAcceptResult => {
          this.logger.paxos('ACCEPT', `Received response from ${peerUrl}`, res.data);
          return { peer: peerUrl, response: res.data };
        })
        .catch((err: Error): null => {
          this.logger.warn(`ACCEPT to ${peerUrl} failed: ${err.message}`);
          return null;
        })
    );

    const results = await Promise.all(promises);
    return results.filter((r): r is PeerAcceptResult => r !== null);
  }

  // ─── DECIDE (broadcast) ────────────────────────────────────────────

  /**
   * Broadcast the final decided value to all peers so every node
   * can learn the outcome and execute the corresponding function.
   */
  async broadcastDecision(value: number, proposalNumber: number): Promise<void> {
    this.logger.paxos(
      'DECIDE',
      `Broadcasting decision: value=${value}, proposal=${proposalNumber}`
    );

    const promises = this.peers.map((peerUrl) =>
      axios
        .post<DecideResponse>(
          `${peerUrl}/paxos/decide`,
          { value, proposalNumber, deciderId: this.nodeId },
          { timeout: TIMEOUT_MS }
        )
        .catch((err: Error) => {
          this.logger.warn(`DECIDE broadcast to ${peerUrl} failed: ${err.message}`);
        })
    );

    await Promise.all(promises);
  }
}
