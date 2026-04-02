/**
 * Shared Paxos type definitions.
 *
 * These interfaces define the shape of every message and response
 * exchanged between nodes during the Paxos protocol.
 */
export type NodeRole = 'proposer' | 'acceptor' | 'learner';
export interface NodeStatus {
    nodeId: number;
    role: NodeRole | null;
    highestProposalSeen: number;
    acceptedProposal: number | null;
    acceptedValue: number | null;
    decidedValue: number | null;
    isProposalActive: boolean;
}
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
export type PromiseResponse = PromiseResponseOk | PromiseResponseReject | PromiseResponseDecided;
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
export type AcceptedResponse = AcceptedResponseOk | AcceptedResponseReject | AcceptedResponseDecided;
export interface DecideRequest {
    value: number;
    proposalNumber: number;
    deciderId: number;
}
export interface DecideResponse {
    acknowledged: boolean;
    decidedValue: number;
}
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
//# sourceMappingURL=types.d.ts.map