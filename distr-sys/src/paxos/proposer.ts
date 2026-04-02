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
import { executeDecision } from '../node/functions';
import {
  PeerPrepareResult,
  PromiseResponseDecided,
  PromiseResponseOk,
  AcceptedResponseDecided,
} from './types';

// Total number of nodes in the cluster
const TOTAL_NODES = 5;
// Majority quorum: need at least 3 out of 5 (including self)
const MAJORITY = Math.floor(TOTAL_NODES / 2) + 1; // = 3

export class Proposer {
  private nodeId: number;
  private paxosState: PaxosState;
  private httpClient: HttpClient;
  private logger: Logger;

  constructor(
    nodeId: number,
    paxosState: PaxosState,
    httpClient: HttpClient,
    logger: Logger
  ) {
    this.nodeId = nodeId;
    this.paxosState = paxosState;
    this.httpClient = httpClient;
    this.logger = logger;
  }

  /**
   * Generate a unique proposal number.
   *
   * Uses timestamp * 10 + nodeId to ensure:
   *   1. Later proposals get higher numbers (timestamp)
   *   2. Simultaneous proposals from different nodes don't collide (+nodeId)
   */
  private generateProposalNumber(): number {
    return Date.now() * 10 + this.nodeId;
  }

  /**
   * Run the full Paxos consensus protocol.
   *
   * @param proposedValue — The value (1–10) this proposer wants to propose
   * @param retryCount    — How many times we've retried (prevents infinite loops)
   */
  async runConsensus(proposedValue: number, retryCount: number = 0): Promise<void> {
    const MAX_RETRIES = 3;

    if (retryCount >= MAX_RETRIES) {
      this.logger.error(`Exceeded max retries (${MAX_RETRIES}). Giving up on proposal.`);
      return;
    }

    if (this.paxosState.hasDecided()) {
      this.logger.info('Consensus already reached — skipping proposal');
      return;
    }

    const proposalNumber = this.generateProposalNumber();
    this.logger.paxos(
      'PROPOSE',
      `Starting proposal round (attempt ${retryCount + 1}/${MAX_RETRIES})`,
      { proposalNumber, proposedValue }
    );

    // ──────────────────────────────────────────────────────────
    // PHASE 1: PREPARE
    // ──────────────────────────────────────────────────────────
    this.logger.paxos('PHASE-1', '═══ Starting PREPARE phase ═══');

    const prepareResponses = await this.httpClient.sendPrepare(proposalNumber);

    // Check if any peer already has a decided value
    const alreadyDecided = prepareResponses.find(
      (r): r is PeerPrepareResult & { response: PromiseResponseDecided } =>
        'alreadyDecided' in r.response && r.response.alreadyDecided === true
    );

    if (alreadyDecided) {
      const decidedValue = alreadyDecided.response.decidedValue;
      this.logger.paxos(
        'PHASE-1',
        `Peer already decided on value ${decidedValue} — adopting decision`
      );
      this.paxosState.decide(decidedValue);
      this.paxosState.role = 'learner';
      this.logger.role('Learner');
      this.logger.consensus(decidedValue);
      executeDecision(decidedValue, this.logger);
      return;
    }

    // Count successful promises (include our own implicit promise)
    const promiseCount =
      prepareResponses.filter((r) => r.response.promised).length + 1; // +1 for self

    this.logger.paxos(
      'PHASE-1',
      `Received ${promiseCount} promises (need ${MAJORITY} for majority)`
    );

    if (promiseCount < MAJORITY) {
      this.logger.paxos(
        'PHASE-1',
        `Failed to get majority promises (${promiseCount}/${MAJORITY}). Retrying after delay...`
      );
      // Back off with randomized delay before retrying
      const backoff = 2000 + Math.random() * 3000;
      await this.sleep(backoff);
      return this.runConsensus(proposedValue, retryCount + 1);
    }

    // ──────────────────────────────────────────────────────────
    // PAXOS CORRECTNESS: Adopt highest previously accepted value
    //
    // If any acceptor in our promise set has already accepted a
    // value from a prior proposal, we MUST adopt the value from
    // the highest-numbered such proposal. This is what prevents
    // Paxos from choosing two different values.
    // ──────────────────────────────────────────────────────────
    let valueToPropose = proposedValue;
    let highestAcceptedProposal = 0;

    for (const { response } of prepareResponses) {
      if (response.promised) {
        const okResponse = response as PromiseResponseOk;
        if (
          okResponse.acceptedProposal !== null &&
          okResponse.acceptedProposal > highestAcceptedProposal
        ) {
          highestAcceptedProposal = okResponse.acceptedProposal;
          valueToPropose = okResponse.acceptedValue!;
          this.logger.paxos(
            'PHASE-1',
            `Adopting previously accepted value ${valueToPropose} from proposal ${highestAcceptedProposal}`
          );
        }
      }
    }

    // Accept our own proposal locally
    this.paxosState.handlePrepare(proposalNumber);
    this.paxosState.handleAccept(proposalNumber, valueToPropose);

    // ──────────────────────────────────────────────────────────
    // PHASE 2: ACCEPT
    // ──────────────────────────────────────────────────────────
    this.logger.paxos('PHASE-2', '═══ Starting ACCEPT phase ═══');
    this.logger.paxos('PHASE-2', `Proposing value: ${valueToPropose}`);

    const acceptResponses = await this.httpClient.sendAccept(
      proposalNumber,
      valueToPropose
    );

    // Check again if any peer decided in the meantime
    const decidedDuringAccept = acceptResponses.find(
      (r): r is { peer: string; response: AcceptedResponseDecided } =>
        'alreadyDecided' in r.response && r.response.alreadyDecided === true
    );

    if (decidedDuringAccept) {
      const decidedValue = decidedDuringAccept.response.decidedValue;
      this.logger.paxos(
        'PHASE-2',
        `Peer already decided on value ${decidedValue} — adopting`
      );
      this.paxosState.decide(decidedValue);
      this.logger.consensus(decidedValue);
      executeDecision(decidedValue, this.logger);
      return;
    }

    // Count accepted responses (include our own acceptance)
    const acceptedCount =
      acceptResponses.filter((r) => r.response.accepted).length + 1; // +1 for self

    this.logger.paxos(
      'PHASE-2',
      `Received ${acceptedCount} acceptances (need ${MAJORITY} for majority)`
    );

    if (acceptedCount < MAJORITY) {
      this.logger.paxos(
        'PHASE-2',
        `Failed to get majority acceptances (${acceptedCount}/${MAJORITY}). Retrying after delay...`
      );
      const backoff = 2000 + Math.random() * 3000;
      await this.sleep(backoff);
      return this.runConsensus(proposedValue, retryCount + 1);
    }

    // ──────────────────────────────────────────────────────────
    // CONSENSUS REACHED!
    // ──────────────────────────────────────────────────────────
    this.logger.paxos(
      'PHASE-2',
      `★ Majority achieved! Value ${valueToPropose} is CHOSEN ★`
    );

    // Record decision locally
    this.paxosState.decide(valueToPropose);
    this.logger.consensus(valueToPropose);

    // Execute the function locally
    executeDecision(valueToPropose, this.logger);

    // Broadcast decision to all peers so learners can execute
    await this.httpClient.broadcastDecision(valueToPropose, proposalNumber);

    this.logger.info('Paxos round complete. All peers notified.');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
