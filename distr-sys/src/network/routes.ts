/**
 * Express Routes — HTTP API endpoints for Paxos inter-node communication.
 *
 * Every node exposes the same set of endpoints:
 *   GET  /status         — Returns current Paxos state (used for discovery)
 *   POST /paxos/prepare  — Phase 1a: Receive a PREPARE request
 *   POST /paxos/accept   — Phase 2a: Receive an ACCEPT request
 *   POST /paxos/decide   — Receive the final DECIDE notification
 */

import { Router, Request, Response } from 'express';
import { PaxosState } from '../paxos/paxosState';
import { Logger } from '../node/logger';
import { executeDecision } from '../node/functions';
import {
  PrepareRequest,
  AcceptRequest,
  DecideRequest,
} from '../paxos/types';

export function createRoutes(paxosState: PaxosState, logger: Logger): Router {
  const router = Router();

  // ─── GET /status ────────────────────────────────────────────────
  // Returns a snapshot of this node's Paxos state.
  // Other nodes hit this on startup to determine if a proposal is active.
  router.get('/status', (_req: Request, res: Response) => {
    const status = paxosState.getStatus();
    logger.info('Status requested', status);
    res.json(status);
  });

  // ─── POST /paxos/prepare ───────────────────────────────────────
  // Phase 1b: Handle an incoming PREPARE(n) from a proposer.
  //
  // Paxos rule:
  //   If n > highestProposalSeen → PROMISE not to accept anything < n
  //   Otherwise → REJECT (we already promised a higher proposal)
  router.post('/paxos/prepare', (req: Request<{}, {}, PrepareRequest>, res: Response) => {
    const { proposalNumber, proposerId } = req.body;

    logger.paxos(
      'PREPARE',
      `Received PREPARE(${proposalNumber}) from Node ${proposerId}`
    );

    // If we've already decided, tell the proposer immediately
    if (paxosState.hasDecided()) {
      logger.paxos(
        'PREPARE',
        `Already decided value ${paxosState.decidedValue} — sending NACK with decision`
      );
      res.json({
        promised: false,
        alreadyDecided: true,
        decidedValue: paxosState.decidedValue,
      });
      return;
    }

    const result = paxosState.handlePrepare(proposalNumber);

    if (result.promised) {
      // Set role to acceptor if we don't have one yet
      if (!paxosState.role) {
        paxosState.role = 'acceptor';
        logger.role('Acceptor');
      }
      paxosState.isProposalActive = true;

      logger.paxos('PROMISE', `Sending PROMISE for proposal ${proposalNumber}`, result);
    } else {
      logger.paxos(
        'PROMISE',
        `Rejecting PREPARE(${proposalNumber}) — already promised to higher`
      );
    }

    res.json(result);
  });

  // ─── POST /paxos/accept ────────────────────────────────────────
  // Phase 2b: Handle an incoming ACCEPT(n, value) from a proposer.
  //
  // Paxos rule:
  //   If n >= highestProposalSeen → ACCEPT the value
  //   Otherwise → REJECT
  router.post('/paxos/accept', (req: Request<{}, {}, AcceptRequest>, res: Response) => {
    const { proposalNumber, value, proposerId } = req.body;

    logger.paxos(
      'ACCEPT',
      `Received ACCEPT(${proposalNumber}, value=${value}) from Node ${proposerId}`
    );

    // If we've already decided, inform the proposer
    if (paxosState.hasDecided()) {
      logger.paxos(
        'ACCEPT',
        `Already decided value ${paxosState.decidedValue} — rejecting`
      );
      res.json({
        accepted: false,
        alreadyDecided: true,
        decidedValue: paxosState.decidedValue,
      });
      return;
    }

    const result = paxosState.handleAccept(proposalNumber, value);

    if (result.accepted) {
      logger.paxos('ACCEPTED', `ACCEPTED proposal ${proposalNumber} with value ${value}`);
    } else {
      logger.paxos(
        'ACCEPTED',
        `Rejected ACCEPT(${proposalNumber}) — already promised to higher`
      );
    }

    res.json(result);
  });

  // ─── POST /paxos/decide ────────────────────────────────────────
  // Final phase: A proposer tells us the consensus value has been chosen.
  // We record the decision and execute the corresponding function.
  router.post('/paxos/decide', (req: Request<{}, {}, DecideRequest>, res: Response) => {
    const { value, proposalNumber, deciderId } = req.body;

    logger.paxos(
      'DECIDE',
      `Received DECIDE from Node ${deciderId}: value=${value}, proposal=${proposalNumber}`
    );

    if (!paxosState.hasDecided()) {
      paxosState.decide(value);

      // If this node was not the proposer, it's a learner
      if (paxosState.role !== 'proposer') {
        paxosState.role = 'learner';
        logger.role('Learner');
      }

      logger.consensus(value);
      executeDecision(value, logger);
    } else {
      logger.paxos('DECIDE', `Already decided on value ${paxosState.decidedValue} — ignoring`);
    }

    res.json({ acknowledged: true, decidedValue: paxosState.decidedValue });
  });

  return router;
}
