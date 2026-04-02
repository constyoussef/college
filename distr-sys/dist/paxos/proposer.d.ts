/**
 * Proposer — Drives the Paxos consensus protocol.
 *
 * A node becomes a Proposer when it starts and finds no existing proposal
 * among its peers. The proposer runs two phases:
 *
 *   Phase 1 (Prepare):
 *     - Generate a unique proposal number (timestamp-based + nodeId for uniqueness)
 *     - Send PREPARE(n) to all peers
 *     - Collect PROMISE responses
 *     - Need majority (≥ 3 out of 5) promises to proceed
 *     - If any promise carries an already-accepted value, adopt the
 *       highest-numbered one (Paxos correctness requirement)
 *
 *   Phase 2 (Accept):
 *     - Send ACCEPT(n, value) to all peers
 *     - Collect ACCEPTED responses
 *     - Need majority (≥ 3 out of 5) acceptances
 *     - If majority reached → broadcast DECIDE to all peers
 */
import { PaxosState } from './paxosState';
import { HttpClient } from '../network/httpClient';
import { Logger } from '../node/logger';
export declare class Proposer {
    private nodeId;
    private paxosState;
    private httpClient;
    private logger;
    constructor(nodeId: number, paxosState: PaxosState, httpClient: HttpClient, logger: Logger);
    /**
     * Generate a unique proposal number.
     *
     * Uses timestamp * 10 + nodeId to ensure:
     *   1. Later proposals get higher numbers (timestamp)
     *   2. Simultaneous proposals from different nodes don't collide (+nodeId)
     */
    private generateProposalNumber;
    /**
     * Run the full Paxos consensus protocol.
     *
     * @param proposedValue — The value (1–10) this proposer wants to propose
     * @param retryCount    — How many times we've retried (prevents infinite loops)
     */
    runConsensus(proposedValue: number, retryCount?: number): Promise<void>;
    private sleep;
}
//# sourceMappingURL=proposer.d.ts.map