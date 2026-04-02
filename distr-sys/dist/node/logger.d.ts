/**
 * Logger — Structured logging utility for Paxos nodes.
 *
 * Every log line is prefixed with [Node X] and a timestamp
 * so we can trace exactly what each container is doing.
 */
export declare class Logger {
    private nodeId;
    private prefix;
    constructor(nodeId: number);
    private timestamp;
    info(message: string, data?: unknown): void;
    warn(message: string, data?: unknown): void;
    error(message: string, data?: unknown): void;
    paxos(phase: string, message: string, data?: unknown): void;
    role(roleName: string): void;
    consensus(value: number): void;
}
//# sourceMappingURL=logger.d.ts.map