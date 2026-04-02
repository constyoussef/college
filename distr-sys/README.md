# Paxos Distributed Consensus Simulation

A complete distributed system simulation running 5 Docker containers that implement the **Paxos consensus algorithm** to agree on a single value.

---

## 📁 Project Structure

```
.
├── docker/
│   └── Dockerfile              # Multi-stage Docker image for each node
├── src/
│   ├── index.js                # Main entry point — startup, discovery, role selection
│   ├── paxos/
│   │   ├── paxosState.js       # Core Paxos state machine (prepare/accept/decide)
│   │   └── proposer.js         # Proposer logic — drives Phase 1 & Phase 2
│   ├── network/
│   │   ├── httpClient.js       # HTTP client for inter-node communication
│   │   └── routes.js           # Express routes (/status, /paxos/*)
│   └── node/
│       ├── functions.js        # 10 predefined functions mapped to values 1–10
│       └── logger.js           # Structured logging utility
├── docker-compose.yml          # Orchestrates 5 containers on shared network
├── package.json
└── README.md
```

---

## 🚀 How to Run

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed

### Start the System

```bash
# Build and launch all 5 nodes
docker-compose up --build

# Run in detached mode (background)
docker-compose up --build -d

# View logs
docker-compose logs -f

# View logs for a specific node
docker-compose logs -f node1

# Stop everything
docker-compose down
```

---

## 🧠 How Paxos Works (Simplified)

### Node Startup

1. Each node starts with a **random delay** (0–5 seconds) to simulate staggered boot.
2. The node starts its HTTP server, then queries all peers for their status.
3. Based on peer responses, it decides its **role**:

| Scenario | Role Assigned |
|----------|---------------|
| No peer has an active proposal | **Proposer** — initiates a new Paxos round |
| A peer has an active proposal (not decided) | **Acceptor** — responds to Paxos messages |
| A peer has already decided | **Learner** — adopts the decided value |

### Paxos Protocol (Two Phases)

#### Phase 1: Prepare / Promise

```
Proposer                          Acceptors
   │                                  │
   │──── PREPARE(n) ─────────────────►│
   │                                  │
   │◄─── PROMISE(ok, prev_accepted) ──│  (if n > highest seen)
   │◄─── REJECT(highest_seen) ───────│  (if n ≤ highest seen)
   │                                  │
   │  Need ≥ 3 promises (majority)    │
```

- The proposer generates a **unique proposal number** `n` (timestamp-based + nodeId).
- Sends `PREPARE(n)` to all peers.
- Each acceptor **promises** not to accept any proposal numbered less than `n`.
- If an acceptor previously accepted a value, it includes that in the promise (so the proposer can adopt it — **critical Paxos correctness rule**).

#### Phase 2: Accept / Accepted

```
Proposer                          Acceptors
   │                                  │
   │──── ACCEPT(n, value) ──────────►│
   │                                  │
   │◄─── ACCEPTED(ok) ──────────────│  (if n ≥ highest promised)
   │◄─── REJECT ────────────────────│  (if n < highest promised)
   │                                  │
   │  Need ≥ 3 acceptances (majority) │
```

- The proposer sends `ACCEPT(n, value)` to all peers.
- If a majority (≥3/5) accept → **consensus is reached!**
- The proposer broadcasts `DECIDE(value)` to all nodes.

### After Consensus

The chosen value (1–10) maps to one of 10 predefined functions that gets executed on every node:

| Value | Function |
|-------|----------|
| 1 | Initialize distributed cache replication |
| 2 | Trigger leader election protocol |
| 3 | Start log compaction across cluster |
| 4 | Rebalance partition assignments |
| 5 | Initiate cluster-wide health check |
| 6 | Propagate configuration update |
| 7 | Rotate encryption keys |
| 8 | Snapshot current state machine |
| 9 | Flush write-ahead log to disk |
| 10 | Broadcast membership change |

---

## 🔧 Edge Cases Handled

| Edge Case | How It's Handled |
|-----------|-----------------|
| **Multiple concurrent proposers** | Unique proposal numbers (timestamp × 10 + nodeId) ensure ordering; loser retries with backoff |
| **Node not yet started** | HTTP requests timeout gracefully; startup delay + discovery sleep gives peers time to boot |
| **Previously accepted value** | Proposer adopts the highest-numbered previously-accepted value (Paxos correctness) |
| **Proposal rejected** | Proposer retries up to 3 times with randomized exponential backoff |
| **Late-joining node** | Discovers an existing decision via `/status` and adopts it as a Learner |

---

## 📋 Example Logs

Below is an example of what you'll see when running `docker-compose up --build`:

```
paxos-node-3  | 2025-01-15T10:00:01.234Z [Node 3] [INFO]  Starting with random delay of 412ms...
paxos-node-1  | 2025-01-15T10:00:01.567Z [Node 1] [INFO]  Starting with random delay of 3842ms...
paxos-node-5  | 2025-01-15T10:00:01.890Z [Node 5] [INFO]  Starting with random delay of 1203ms...
paxos-node-2  | 2025-01-15T10:00:02.123Z [Node 2] [INFO]  Starting with random delay of 4567ms...
paxos-node-4  | 2025-01-15T10:00:02.456Z [Node 4] [INFO]  Starting with random delay of 2891ms...

paxos-node-3  | 2025-01-15T10:00:01.650Z [Node 3] [INFO]  HTTP server listening on port 3000
paxos-node-3  | 2025-01-15T10:00:01.651Z [Node 3] [INFO]  Node is UP. Discovering peers...
paxos-node-3  | 2025-01-15T10:00:04.700Z [Node 3] [INFO]  Received status from 2 peer(s)
paxos-node-3  | 2025-01-15T10:00:04.701Z [Node 3] [INFO]  ======== ROLE ASSIGNED: PROPOSER ========
paxos-node-3  | 2025-01-15T10:00:04.702Z [Node 3] [INFO]  Generated random proposed value: 7

paxos-node-3  | 2025-01-15T10:00:06.710Z [Node 3] [PAXOS:PHASE-1] ═══ Starting PREPARE phase ═══
paxos-node-3  | 2025-01-15T10:00:06.711Z [Node 3] [PAXOS:PREPARE] Sending PREPARE(17368...) to all peers
paxos-node-5  | 2025-01-15T10:00:06.720Z [Node 5] [PAXOS:PREPARE] Received PREPARE(17368...) from Node 3
paxos-node-5  | 2025-01-15T10:00:06.721Z [Node 5] [INFO]  ======== ROLE ASSIGNED: ACCEPTOR ========
paxos-node-5  | 2025-01-15T10:00:06.722Z [Node 5] [PAXOS:PROMISE] Sending PROMISE for proposal 17368...
paxos-node-4  | 2025-01-15T10:00:06.730Z [Node 4] [PAXOS:PREPARE] Received PREPARE(17368...) from Node 3
paxos-node-4  | 2025-01-15T10:00:06.731Z [Node 4] [PAXOS:PROMISE] Sending PROMISE for proposal 17368...

paxos-node-3  | 2025-01-15T10:00:06.750Z [Node 3] [PAXOS:PHASE-1] Received 4 promises (need 3 for majority)
paxos-node-3  | 2025-01-15T10:00:06.751Z [Node 3] [PAXOS:PHASE-2] ═══ Starting ACCEPT phase ═══
paxos-node-3  | 2025-01-15T10:00:06.752Z [Node 3] [PAXOS:PHASE-2] Proposing value: 7
paxos-node-3  | 2025-01-15T10:00:06.753Z [Node 3] [PAXOS:ACCEPT] Sending ACCEPT(17368..., value=7) to all peers

paxos-node-5  | 2025-01-15T10:00:06.760Z [Node 5] [PAXOS:ACCEPT] Received ACCEPT(17368..., value=7) from Node 3
paxos-node-5  | 2025-01-15T10:00:06.761Z [Node 5] [PAXOS:ACCEPTED] ACCEPTED proposal 17368... with value 7

paxos-node-3  | 2025-01-15T10:00:06.780Z [Node 3] [PAXOS:PHASE-2] Received 4 acceptances (need 3 for majority)
paxos-node-3  | 2025-01-15T10:00:06.781Z [Node 3] [PAXOS:PHASE-2] ★ Majority achieved! Value 7 is CHOSEN ★
paxos-node-3  | 2025-01-15T10:00:06.782Z [Node 3] [INFO]  ★★★ CONSENSUS REACHED — Decided value: 7 ★★★
paxos-node-3  | 2025-01-15T10:00:06.783Z [Node 3] [INFO]  Decision execution — running function mapped to value 7
paxos-node-3  | >>> Executing function 7: Rotating encryption keys

paxos-node-5  | 2025-01-15T10:00:06.800Z [Node 5] [PAXOS:DECIDE] Received DECIDE from Node 3: value=7
paxos-node-5  | 2025-01-15T10:00:06.801Z [Node 5] [INFO]  ======== ROLE ASSIGNED: LEARNER ========
paxos-node-5  | 2025-01-15T10:00:06.802Z [Node 5] [INFO]  ★★★ CONSENSUS REACHED — Decided value: 7 ★★★
paxos-node-5  | >>> Executing function 7: Rotating encryption keys
```

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Network (paxos-net)                │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│  │  node1   │  │  node2   │  │  node3   │  │  node4   │  │  node5   │
│  │  :3000   │  │  :3000   │  │  :3000   │  │  :3000   │  │  :3000   │
│  │          │  │          │  │          │  │          │  │          │
│  │ Express  │  │ Express  │  │ Express  │  │ Express  │  │ Express  │
│  │ Paxos    │  │ Paxos    │  │ Paxos    │  │ Paxos    │  │ Paxos    │
│  │ State    │  │ State    │  │ State    │  │ State    │  │ State    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
│       │             │             │             │             │
│       └─────────────┴──────┬──────┴─────────────┴─────────────┘
│                            │
│                    HTTP Communication
│               (PREPARE / PROMISE / ACCEPT /
│                ACCEPTED / DECIDE)
└─────────────────────────────────────────────────────────────────┘
```

Each container runs the **exact same image** — the `NODE_ID` environment variable determines its identity.

---

## 📚 References

- [Paxos Made Simple](https://lamport.azurewebsites.net/pubs/paxos-simple.pdf) — Leslie Lamport
- [Understanding Paxos](https://understandingpaxos.wordpress.com/) — Informal tutorial
