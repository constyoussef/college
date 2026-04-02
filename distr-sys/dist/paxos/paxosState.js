"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaxosState = void 0;
class PaxosState {
    constructor(nodeId) {
        // --- Paxos protocol state ---
        this.highestProposalSeen = 0; // Highest proposal number we've PROMISED to
        this.acceptedProposal = null; // Proposal number we've ACCEPTED
        this.acceptedValue = null; // Value we've ACCEPTED
        this.decidedValue = null; // Final consensus value (set once decided)
        // --- Node role & activity ---
        this.role = null; // 'proposer' | 'acceptor' | 'learner'
        this.isProposalActive = false; // Is there an active proposal round?
        this.nodeId = nodeId;
    }
    /**
     * Phase 1b — PROMISE
     *
     * When we receive a PREPARE(n) request:
     *   - If n > highestProposalSeen → promise not to accept anything < n
     *   - Return our previously accepted value (if any) so the proposer
     *     can adopt it (critical for Paxos correctness)
     */
    handlePrepare(proposalNumber) {
        if (proposalNumber > this.highestProposalSeen) {
            this.highestProposalSeen = proposalNumber;
            return {
                promised: true,
                acceptedProposal: this.acceptedProposal,
                acceptedValue: this.acceptedValue,
            };
        }
        // Reject: we've already promised to a higher proposal
        return {
            promised: false,
            highestSeen: this.highestProposalSeen,
        };
    }
    /**
     * Phase 2b — ACCEPTED
     *
     * When we receive an ACCEPT(n, value) request:
     *   - If n >= highestProposalSeen → accept the value
     *   - Otherwise reject (we've promised to a higher proposal)
     */
    handleAccept(proposalNumber, value) {
        if (proposalNumber >= this.highestProposalSeen) {
            this.highestProposalSeen = proposalNumber;
            this.acceptedProposal = proposalNumber;
            this.acceptedValue = value;
            return { accepted: true };
        }
        // Reject: we've already promised to a higher proposal
        return {
            accepted: false,
            highestSeen: this.highestProposalSeen,
        };
    }
    /**
     * DECIDE — Called when a value has been chosen by majority.
     * Once decided, the value is final and cannot change.
     */
    decide(value) {
        this.decidedValue = value;
        this.isProposalActive = false;
    }
    /**
     * Returns whether this node already knows the final decision.
     */
    hasDecided() {
        return this.decidedValue !== null;
    }
    /**
     * Returns a snapshot of this node's current state (for /status queries).
     */
    getStatus() {
        return {
            nodeId: this.nodeId,
            role: this.role,
            highestProposalSeen: this.highestProposalSeen,
            acceptedProposal: this.acceptedProposal,
            acceptedValue: this.acceptedValue,
            decidedValue: this.decidedValue,
            isProposalActive: this.isProposalActive,
        };
    }
}
exports.PaxosState = PaxosState;
//# sourceMappingURL=paxosState.js.map