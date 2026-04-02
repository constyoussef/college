/**
 * Shared Paxos type definitions.
 *
 * These interfaces define the shape of every message and response
 * exchanged between nodes during the Paxos protocol.
 */

// ─── Node Roles ──────────────────────────────────────────────
export type NodeRole = 'proposer' | 'acceptor' | 'learner';

// ─── Status (used by /status endpoint for discovery) ─────────
export interface NodeStatus {
  nodeId: number;
  role: NodeRole | null;
  highestProposalSeen: number;
  acceptedProposal: number | null;
  acceptedValue: number | null;
  decidedValue: number | null;
  isProposalActive: boolean;
}

// ─── Phase 1: Prepare / Promise ──────────────────────────────

export interface PrepareRequest {
  proposalNumber: number;
  proposerId: number;
}

export interface PromiseResponseOk {
  promised: true;
  acceptedProposal: number | null;
  acceptedValue: number | null;
}

export interface PromiseResponseReject {
  promised: false;
  highestSeen: number;
}

export interface PromiseResponseDecided {
  promised: false;
  alreadyDecided: true;
  decidedValue: number;
}

export type PromiseResponse =
  | PromiseResponseOk
  | PromiseResponseReject
  | PromiseResponseDecided;

// ─── Phase 2: Accept / Accepted ──────────────────────────────

export interface AcceptRequest {
  proposalNumber: number;
  value: number;
  proposerId: number;
}

export interface AcceptedResponseOk {
  accepted: true;
}

export interface AcceptedResponseReject {
  accepted: false;
  highestSeen: number;
}

export interface AcceptedResponseDecided {
  accepted: false;
  alreadyDecided: true;
  decidedValue: number;
}

export type AcceptedResponse =
  | AcceptedResponseOk
  | AcceptedResponseReject
  | AcceptedResponseDecided;

// ─── Decision broadcast ──────────────────────────────────────

export interface DecideRequest {
  value: number;
  proposalNumber: number;
  deciderId: number;
}

export interface DecideResponse {
  acknowledged: boolean;
  decidedValue: number;
}

// ─── Peer query result ───────────────────────────────────────

export interface PeerStatus {
  peer: string;
  status: NodeStatus;
}

export interface PeerPrepareResult {
  peer: string;
  response: PromiseResponse;
}

export interface PeerAcceptResult {
  peer: string;
  response: AcceptedResponse;
}
