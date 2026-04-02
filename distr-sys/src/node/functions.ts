/**
 * Predefined Functions — 10 functions mapped to consensus values 1–10.
 *
 * Once the Paxos round decides on a value, the corresponding function
 * is executed on every node that learns the decision.
 */

import { Logger } from './logger';

type DecisionFunction = () => void;

const functions: Record<number, DecisionFunction> = {
  1:  () => console.log('>>> Executing function 1: Initializing distributed cache replication'),
  2:  () => console.log('>>> Executing function 2: Triggering leader election protocol'),
  3:  () => console.log('>>> Executing function 3: Starting log compaction across cluster'),
  4:  () => console.log('>>> Executing function 4: Rebalancing partition assignments'),
  5:  () => console.log('>>> Executing function 5: Initiating cluster-wide health check'),
  6:  () => console.log('>>> Executing function 6: Propagating configuration update'),
  7:  () => console.log('>>> Executing function 7: Rotating encryption keys'),
  8:  () => console.log('>>> Executing function 8: Snapshotting current state machine'),
  9:  () => console.log('>>> Executing function 9: Flushing write-ahead log to disk'),
  10: () => console.log('>>> Executing function 10: Broadcasting membership change'),
};

/**
 * Execute the function corresponding to the decided consensus value.
 */
export function executeDecision(value: number, logger: Logger): void {
  const fn = functions[value];
  if (fn) {
    logger.info(`Decision execution — running function mapped to value ${value}`);
    fn();
  } else {
    logger.error(`No function mapped to value: ${value}`);
  }
}
