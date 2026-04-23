#!/bin/bash
# =============================================================================
# Load Balancer Benchmark Script
# Runs Apache Benchmark (ab) against all 5 load balancing algorithms
# =============================================================================

set -e

BASE_URL="http://localhost:8090/calc"
REQUESTS=${1:-1000}
CONCURRENCY=${2:-50}
N_VALUE=${3:-2}
RESULTS_DIR="$(dirname "$0")/results"

# Create results directory
mkdir -p "$RESULTS_DIR"

ALGOS=("round_robin" "random" "least_connections" "hash" "weighted_round_robin")

echo "========================================"
echo "  Load Balancer Benchmark Suite"
echo "========================================"
echo "  Requests per algo: $REQUESTS"
echo "  Concurrency:       $CONCURRENCY"
echo "  n value:           $N_VALUE"
echo "========================================"
echo ""

# Reset metrics before benchmarking
echo "Resetting metrics..."
curl -s "http://localhost:8090/metrics/reset" > /dev/null
echo ""

for algo in "${ALGOS[@]}"; do
  echo "──────────────────────────────────────"
  echo "  Algorithm: $algo"
  echo "──────────────────────────────────────"

  # Reset metrics before each algorithm test
  curl -s "http://localhost:8090/metrics/reset" > /dev/null

  RESULT_FILE="$RESULTS_DIR/${algo}_results.txt"

  ab -n $REQUESTS -c $CONCURRENCY -l -k \
    "${BASE_URL}?n=${N_VALUE}&algo=${algo}" \
    > "$RESULT_FILE" 2>&1

  echo "  ✓ Results saved to: $RESULT_FILE"

  # Extract key metrics from ab output
  RPS=$(grep "Requests per second" "$RESULT_FILE" | awk '{print $4}')
  MEAN_TIME=$(grep "Time per request" "$RESULT_FILE" | head -1 | awk '{print $4}')
  FAILED=$(grep "Failed requests" "$RESULT_FILE" | awk '{print $3}')

  echo "  → Requests/sec:  $RPS"
  echo "  → Mean time:     ${MEAN_TIME}ms"
  echo "  → Failed:        $FAILED"

  # Save LB metrics
  curl -s "http://localhost:8090/metrics" > "$RESULTS_DIR/${algo}_lb_metrics.json"
  echo "  → LB metrics saved"
  echo ""
done

echo "========================================"
echo "  Benchmark Complete!"
echo "  Results in: $RESULTS_DIR/"
echo "========================================"
echo ""
echo "View dashboard: http://localhost:8090/dashboard"
