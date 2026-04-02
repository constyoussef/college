"use strict";
/**
 * Logger — Structured logging utility for Paxos nodes.
 *
 * Every log line is prefixed with [Node X] and a timestamp
 * so we can trace exactly what each container is doing.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    constructor(nodeId) {
        this.nodeId = nodeId;
        this.prefix = `[Node ${nodeId}]`;
    }
    timestamp() {
        return new Date().toISOString();
    }
    info(message, data) {
        const line = `${this.timestamp()} ${this.prefix} [INFO]  ${message}`;
        if (data !== undefined) {
            console.log(line, JSON.stringify(data));
        }
        else {
            console.log(line);
        }
    }
    warn(message, data) {
        const line = `${this.timestamp()} ${this.prefix} [WARN]  ${message}`;
        if (data !== undefined) {
            console.warn(line, JSON.stringify(data));
        }
        else {
            console.warn(line);
        }
    }
    error(message, data) {
        const line = `${this.timestamp()} ${this.prefix} [ERROR] ${message}`;
        if (data !== undefined) {
            console.error(line, JSON.stringify(data));
        }
        else {
            console.error(line);
        }
    }
    paxos(phase, message, data) {
        const line = `${this.timestamp()} ${this.prefix} [PAXOS:${phase}] ${message}`;
        if (data !== undefined) {
            console.log(line, JSON.stringify(data));
        }
        else {
            console.log(line);
        }
    }
    role(roleName) {
        this.info(`======== ROLE ASSIGNED: ${roleName.toUpperCase()} ========`);
    }
    consensus(value) {
        this.info(`★★★ CONSENSUS REACHED — Decided value: ${value} ★★★`);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map