/**
 * HTTP Client — Handles all inter-node communication.
 *
 * Each node uses this module to send Paxos messages (Prepare, Accept, Decide)
 * and to query the status of other nodes on startup.
 *
 * Nodes are addressed by container name (e.g., "node1:3000") which Docker
 * DNS resolves automatically on the shared network.
 */
import { Logger } from '../node/logger';
import { PeerStatus, PeerPrepareResult, PeerAcceptResult } from '../paxos/types';
export declare class HttpClient {
    private nodeId;
    private logger;
    private peers;
    constructor(nodeId: number, nodeList: string, logger: Logger);
    /**
     * Query every peer for their current Paxos status.
     * Used on startup to decide whether to become Proposer or Acceptor/Learner.
     * Failures are expected (peers may not be up yet) and silently swallowed.
     */
    queryAllStatuses(): Promise<PeerStatus[]>;
    /**
     * Send PREPARE(proposalNumber) to all peers.
     * Returns an array of { peer, response } for those that replied.
     */
    sendPrepare(proposalNumber: number): Promise<PeerPrepareResult[]>;
    /**
     * Send ACCEPT(proposalNumber, value) to all peers.
     * Returns an array of { peer, response } for those that replied.
     */
    sendAccept(proposalNumber: number, value: number): Promise<PeerAcceptResult[]>;
    /**
     * Broadcast the final decided value to all peers so every node
     * can learn the outcome and execute the corresponding function.
     */
    broadcastDecision(value: number, proposalNumber: number): Promise<void>;
}
//# sourceMappingURL=httpClient.d.ts.map