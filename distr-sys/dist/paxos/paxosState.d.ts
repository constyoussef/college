/**
 * PaxosState — Manages the internal Paxos state for a single node.
 *
 * Each node maintains:
 *   - highestProposalSeen: The highest proposal number this node has promised to.
 *   - acceptedProposal:    The proposal number this node has accepted (if any).
 *   - acceptedValue:       The value this node has accepted (if any).
 *   - decidedValue:        The final consensus value (once decided).
 *   - role:                The node's current role (proposer | acceptor | learner).
 *   - isProposalActive:    Whether a proposal round is currently in progress.
 */
import { NodeRole, NodeStatus, PromiseResponse, AcceptedResponse } from './types';
export declare class PaxosState {
    nodeId: number;
    highestProposalSeen: number;
    acceptedProposal: number | null;
    acceptedValue: number | null;
    decidedValue: number | null;
    role: NodeRole | null;
    isProposalActive: boolean;
    constructor(nodeId: number);
    /**
     * Phase 1b — PROMISE
     *
     * When we receive a PREPARE(n) request:
     *   - If n > highestProposalSeen → promise not to accept anything < n
     *   - Return our previously accepted value (if any) so the proposer
     *     can adopt it (critical for Paxos correctness)
     */
    handlePrepare(proposalNumber: number): PromiseResponse;
    /**
     * Phase 2b — ACCEPTED
     *
     * When we receive an ACCEPT(n, value) request:
     *   - If n >= highestProposalSeen → accept the value
     *   - Otherwise reject (we've promised to a higher proposal)
     */
    handleAccept(proposalNumber: number, value: number): AcceptedResponse;
    /**
     * DECIDE — Called when a value has been chosen by majority.
     * Once decided, the value is final and cannot change.
     */
    decide(value: number): void;
    /**
     * Returns whether this node already knows the final decision.
     */
    hasDecided(): boolean;
    /**
     * Returns a snapshot of this node's current state (for /status queries).
     */
    getStatus(): NodeStatus;
}
//# sourceMappingURL=paxosState.d.ts.map