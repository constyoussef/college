/**
 * Express Routes — HTTP API endpoints for Paxos inter-node communication.
 *
 * Every node exposes the same set of endpoints:
 *   GET  /status         — Returns current Paxos state (used for discovery)
 *   POST /paxos/prepare  — Phase 1a: Receive a PREPARE request
 *   POST /paxos/accept   — Phase 2a: Receive an ACCEPT request
 *   POST /paxos/decide   — Receive the final DECIDE notification
 */
import { Router } from 'express';
import { PaxosState } from '../paxos/paxosState';
import { Logger } from '../node/logger';
export declare function createRoutes(paxosState: PaxosState, logger: Logger): Router;
//# sourceMappingURL=routes.d.ts.map