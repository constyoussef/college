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

import {
  NodeRole,
  NodeStatus,
  PromiseResponse,
  AcceptedResponse,
} from './types';

export class PaxosState {
  public nodeId: number;

  // --- Paxos protocol state ---
  public highestProposalSeen: number = 0;       // Highest proposal number we've PROMISED to
  public acceptedProposal: number | null = null; // Proposal number we've ACCEPTED
  public acceptedValue: number | null = null;    // Value we've ACCEPTED
  public decidedValue: number | null = null;     // Final consensus value (set once decided)

  // --- Node role & activity ---
  public role: NodeRole | null = null;           // 'proposer' | 'acceptor' | 'learner'
  public isProposalActive: boolean = false;      // Is there an active proposal round?

  constructor(nodeId: number) {
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
  handlePrepare(proposalNumber: number): PromiseResponse {
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
  handleAccept(proposalNumber: number, value: number): AcceptedResponse {
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
  decide(value: number): void {
    this.decidedValue = value;
    this.isProposalActive = false;
  }

  /**
   * Returns whether this node already knows the final decision.
   */
  hasDecided(): boolean {
    return this.decidedValue !== null;
  }

  /**
   * Returns a snapshot of this node's current state (for /status queries).
   */
  getStatus(): NodeStatus {
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
