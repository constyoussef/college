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
export {};
//# sourceMappingURL=index.d.ts.map