# Load Balancer — Distributed Systems Project

A production-quality Load Balancer system built with **NestJS** and **Docker** that simulates real-world traffic distribution across multiple backend worker nodes.

## Architecture

```
                    ┌──────────────────┐
                    │     Client       │
                    │  (ab / curl)     │
                    └────────┬─────────┘
                             │
                      :8090  │  HTTP
                             ▼
                    ┌──────────────────┐
                    │  Load Balancer   │
                    │    (NestJS)      │
                    │                  │
                    │  5 Algorithms:   │
                    │  • Round Robin   │
                    │  • Random        │
                    │  • Least Conn    │
                    │  • Hash-based    │
                    │  • Weighted RR   │
                    └──┬─────┬─────┬───┘
                       │     │     │
          ┌────────────┘     │     └────────────┐
          ▼                  ▼                  ▼
   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
   │  Node 1     │   │  Node 2     │   │  Node 3     │
   │  :3001      │   │  :3002      │   │  :3003      │
   │  (Express)  │   │  (Express)  │   │  (Express)  │
   │             │   │             │   │             │
   │  Queue: 2   │   │  Queue: 2   │   │  Queue: 2   │
   └─────────────┘   └─────────────┘   └─────────────┘
   
   ◄──── Docker Internal Network (lb-network) ────►
         (clients cannot access nodes directly)
```

## Prerequisites

- **Docker** & **Docker Compose**
- **Apache Benchmark** (`ab`) — for benchmarking
  ```bash
  # macOS (pre-installed)
  # Ubuntu
  sudo apt install apache2-utils
  ```

## Quick Start

```bash
# 1. Build and start all services
docker-compose up --build -d

# 2. Verify services are running
docker-compose ps

# 3. Send a test request
curl "http://localhost:8090/calc?n=1&algo=round_robin"

# 4. View the dashboard
open http://localhost:8090/dashboard
```

## API Reference

### Load Balancer Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/calc?n=5&algo=round_robin` | Compute H(n) via load-balanced worker |
| GET | `/metrics` | Aggregated stats (JSON) |
| GET | `/metrics/histogram` | Response time distribution |
| GET | `/metrics/reset` | Clear collected metrics |
| GET | `/dashboard` | Chart.js visualization |
| GET | `/` | Service info + available algorithms |

### Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| `n` | int | Multiplier for computation (n × 1,000,000 iterations) |
| `algo` | string | Algorithm: `round_robin`, `random`, `least_connections`, `hash`, `weighted_round_robin` |

### Response Format

```json
{
  "result": 1234.567891,
  "processingTimeMs": 342.15,
  "totalResponseTimeMs": 348.72,
  "nodeUsed": "node-1",
  "algorithm": "round_robin",
  "queueDepth": 3
}
```

## Load Balancing Algorithms

### 1. Round Robin
Distributes requests sequentially across nodes (1→2→3→1→2→3...).
Fair and predictable.

### 2. Random
Selects a random node per request. Statistically even over large counts.

### 3. Least Connections
Routes to the node with the fewest active connections.
Adapts to variable processing times.

### 4. Hash-Based
Deterministic routing based on hash of `n` + client IP.
Same input always goes to the same node (cache affinity).

### 5. Weighted Round Robin
Proportional distribution based on configured weights.
Default weights: node-1 (3), node-2 (2), node-3 (1).

## CPU-Intensive Function

Each worker computes:

```
H(n) = Σ (i=1 to n×1,000,000) √i × sin(i) / ln(i+1)
```

Workers maintain a bounded task queue (concurrency=2) to simulate real server thread pool limits.

## Benchmarking

```bash
# Run full benchmark suite (all algorithms)
chmod +x benchmarks/run-benchmarks.sh
./benchmarks/run-benchmarks.sh

# Or run a single algorithm
ab -n 10000 -c 200 "http://localhost:8090/calc?n=5&algo=round_robin"
```

Results are saved to `benchmarks/results/`.

## Metrics Collection

After a benchmark run:

```bash
# Get stats
curl http://localhost:8090/metrics | jq .

# View histogram
curl http://localhost:8090/metrics/histogram | jq .

# Visual dashboard
open http://localhost:8090/dashboard
```

### Key Metrics Collected
- **Requests per second** — throughput
- **Avg / P50 / P95 / P99 latency** — response time distribution
- **Failed requests** — error count
- **Per-node breakdown** — traffic distribution
- **Per-algorithm breakdown** — algorithm comparison

## Health Checks & Resilience

- LB pings all nodes every 10 seconds via `GET /health`
- Unhealthy nodes are excluded from routing
- Nodes auto-recover when health check passes
- Failed requests trigger retry on a different node (max 2 retries)

Test node failure:
```bash
docker-compose stop node1
# Requests now routed to node2 and node3 only
curl "http://localhost:8090/calc?n=1&algo=round_robin"
docker-compose start node1
# node1 auto-recovers after next health check
```

## Logs

```bash
# All services
docker-compose logs -f

# Load balancer only
docker-compose logs -f lb

# Specific worker
docker-compose logs -f node1
```

## Stopping

```bash
docker-compose down
```

## Project Structure

```
load-balancer/
├── docker-compose.yml          # Orchestration
├── README.md
├── lb/                         # Load Balancer (NestJS)
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── main.ts
│       ├── app.module.ts
│       ├── app.controller.ts
│       ├── app.service.ts
│       ├── algorithms/         # Strategy pattern
│       │   ├── algorithm.interface.ts
│       │   ├── algorithm.factory.ts
│       │   ├── round-robin.algorithm.ts
│       │   ├── random.algorithm.ts
│       │   ├── least-connections.algorithm.ts
│       │   ├── hash-based.algorithm.ts
│       │   └── weighted-round-robin.algorithm.ts
│       ├── health/             # Node health monitoring
│       │   ├── health.service.ts
│       │   └── health.module.ts
│       ├── metrics/            # Performance metrics
│       │   ├── metrics.service.ts
│       │   ├── metrics.controller.ts
│       │   └── metrics.module.ts
│       └── config/
│           └── nodes.config.ts
├── worker/                     # Worker Node (Express)
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── index.ts
│       ├── calc.ts
│       └── queue.ts
└── benchmarks/
    ├── run-benchmarks.sh
    └── results/
```
