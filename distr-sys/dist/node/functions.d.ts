/**
 * Predefined Functions — 10 functions mapped to consensus values 1–10.
 *
 * Once the Paxos round decides on a value, the corresponding function
 * is executed on every node that learns the decision.
 */
import { Logger } from './logger';
/**
 * Execute the function corresponding to the decided consensus value.
 */
export declare function executeDecision(value: number, logger: Logger): void;
//# sourceMappingURL=functions.d.ts.map