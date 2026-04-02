/**
 * Logger — Structured logging utility for Paxos nodes.
 *
 * Every log line is prefixed with [Node X] and a timestamp
 * so we can trace exactly what each container is doing.
 */

export class Logger {
  private nodeId: number;
  private prefix: string;

  constructor(nodeId: number) {
    this.nodeId = nodeId;
    this.prefix = `[Node ${nodeId}]`;
  }

  private timestamp(): string {
    return new Date().toISOString();
  }

  info(message: string, data?: unknown): void {
    const line = `${this.timestamp()} ${this.prefix} [INFO]  ${message}`;
    if (data !== undefined) {
      console.log(line, JSON.stringify(data));
    } else {
      console.log(line);
    }
  }

  warn(message: string, data?: unknown): void {
    const line = `${this.timestamp()} ${this.prefix} [WARN]  ${message}`;
    if (data !== undefined) {
      console.warn(line, JSON.stringify(data));
    } else {
      console.warn(line);
    }
  }

  error(message: string, data?: unknown): void {
    const line = `${this.timestamp()} ${this.prefix} [ERROR] ${message}`;
    if (data !== undefined) {
      console.error(line, JSON.stringify(data));
    } else {
      console.error(line);
    }
  }

  paxos(phase: string, message: string, data?: unknown): void {
    const line = `${this.timestamp()} ${this.prefix} [PAXOS:${phase}] ${message}`;
    if (data !== undefined) {
      console.log(line, JSON.stringify(data));
    } else {
      console.log(line);
    }
  }

  role(roleName: string): void {
    this.info(`======== ROLE ASSIGNED: ${roleName.toUpperCase()} ========`);
  }

  consensus(value: number): void {
    this.info(`★★★ CONSENSUS REACHED — Decided value: ${value} ★★★`);
  }
}
