/**
 * Main Entry Point — Bootstraps a Paxos node.
 *
 * Lifecycle:
 *   1. Read NODE_ID and NODE_LIST from environment variables
 *   2. Sleep for a random delay (0–5s) to simulate staggered startup
 *   3. Start the Express HTTP server
 *   4. Query all peers for their status
 *   5. If no active proposal → become PROPOSER and run Paxos
 *      If active proposal   → become ACCEPTOR/LEARNER and wait
 */

import express from 'express';
import { PaxosState } from './paxos/paxosState';
import { Proposer } from './paxos/proposer';
import { HttpClient } from './network/httpClient';
import { createRoutes } from './network/routes';
import { Logger } from './node/logger';
import { executeDecision } from './node/functions';

// ─── Configuration from environment ──────────────────────────────
const NODE_ID = parseInt(process.env.NODE_ID || '0', 10);
const NODE_LIST = process.env.NODE_LIST || '';
const PORT = parseInt(process.env.PORT || '3000', 10);

if (!NODE_ID || !NODE_LIST) {
  console.error('ERROR: NODE_ID and NODE_LIST environment variables are required.');
  process.exit(1);
}

// ─── Initialize components ──────────────────────────────────────
const logger = new Logger(NODE_ID);
const paxosState = new PaxosState(NODE_ID);
const httpClient = new HttpClient(NODE_ID, NODE_LIST, logger);

// ─── Express setup ──────────────────────────────────────────────
const app = express();
app.use(express.json());
app.use('/', createRoutes(paxosState, logger));

/**
 * Sleep for a given number of milliseconds.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Main startup sequence.
 */
async function main(): Promise<void> {
  // Step 1: Random startup delay (0–5 seconds)
  const startupDelay = Math.floor(Math.random() * 5000);
  logger.info(`Starting with random delay of ${startupDelay}ms...`);
  await sleep(startupDelay);

  // Step 2: Start HTTP server
  await new Promise<void>((resolve) => {
    app.listen(PORT, () => {
      logger.info(`HTTP server listening on port ${PORT}`);
      resolve();
    });
  });

  logger.info('Node is UP. Discovering peers...');

  // Step 3: Wait a bit for other nodes to come up, then query statuses
  // We wait a short period so that the discovery phase has the best
  // chance of reaching peers that started with a shorter delay.
  await sleep(3000);

  const statuses = await httpClient.queryAllStatuses();
  logger.info(`Received status from ${statuses.length} peer(s)`);

  // Step 4: Check if ANY peer has an active proposal or has already decided
  const activeProposal = statuses.find(
    (s) => s.status.isProposalActive || s.status.decidedValue !== null
  );

  if (activeProposal) {
    // ── CASE B: Existing proposal detected ─────────────────
    // Check if a decision has already been made
    const decided = statuses.find((s) => s.status.decidedValue !== null);

    if (decided) {
      // A consensus value already exists — become a Learner
      paxosState.role = 'learner';
      logger.role('Learner');

      const value = decided.status.decidedValue!;
      paxosState.decide(value);
      logger.consensus(value);
      executeDecision(value, logger);
    } else {
      // A proposal is in progress but not yet decided — become Acceptor
      paxosState.role = 'acceptor';
      logger.role('Acceptor');
      logger.info('Waiting for incoming Paxos messages from the active proposer...');
    }
  } else {
    // ── CASE A: No existing proposal — become Proposer ─────
    paxosState.role = 'proposer';
    paxosState.isProposalActive = true;
    logger.role('Proposer');

    // Generate a random value between 1 and 10
    const proposedValue = Math.floor(Math.random() * 10) + 1;
    logger.info(`Generated random proposed value: ${proposedValue}`);

    const proposer = new Proposer(NODE_ID, paxosState, httpClient, logger);

    // Small delay to give other nodes time to start their HTTP servers
    await sleep(2000);

    // Run the full Paxos protocol
    await proposer.runConsensus(proposedValue);
  }

  // Step 5: Keep the process alive so the HTTP server stays up
  logger.info('Node is idle — HTTP server remains active for incoming messages.');
}

// ─── Launch ──────────────────────────────────────────────────────
main().catch((err: Error) => {
  logger.error('Fatal error during startup', { message: err.message, stack: err.stack });
  process.exit(1);
});
