import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { MetricsService } from './metrics.service';

/**
 * Metrics Controller
 *
 * Exposes endpoints for viewing collected load balancer metrics
 * and a Chart.js dashboard for histogram visualization.
 */
@Controller()
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  /**
   * GET /metrics
   * Returns aggregated statistics as JSON.
   */
  @Get('metrics')
  getMetrics() {
    return this.metricsService.getStats();
  }

  /**
   * GET /metrics/histogram
   * Returns response time distribution as histogram buckets.
   */
  @Get('metrics/histogram')
  getHistogram() {
    return this.metricsService.getHistogram();
  }

  /**
   * GET /metrics/reset
   * Clears all collected metrics. Use between benchmark runs.
   */
  @Get('metrics/reset')
  resetMetrics() {
    this.metricsService.reset();
    return { message: 'Metrics reset successfully' };
  }

  /**
   * GET /dashboard
   * Serves a self-contained HTML page with Chart.js visualizations.
   */
  @Get('dashboard')
  getDashboard(@Res() res: Response) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Load Balancer Dashboard</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      padding: 2rem;
    }
    h1 {
      text-align: center;
      font-size: 1.8rem;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #60a5fa, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      text-align: center;
      color: #94a3b8;
      margin-bottom: 2rem;
      font-size: 0.9rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    .card {
      background: #1e293b;
      border-radius: 12px;
      padding: 1.5rem;
      border: 1px solid #334155;
    }
    .card h2 {
      font-size: 1rem;
      color: #94a3b8;
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
    .stat {
      text-align: center;
    }
    .stat .value {
      font-size: 1.8rem;
      font-weight: 700;
      color: #60a5fa;
    }
    .stat .label {
      font-size: 0.75rem;
      color: #64748b;
      margin-top: 0.25rem;
    }
    .chart-container {
      position: relative;
      height: 300px;
    }
    .full-width { grid-column: 1 / -1; }
    button {
      display: block;
      margin: 2rem auto 0;
      padding: 0.75rem 2rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: background 0.2s;
    }
    button:hover { background: #2563eb; }
    .actions { display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; }
  </style>
</head>
<body>
  <h1>⚖️ Load Balancer Dashboard</h1>
  <p class="subtitle">Real-time metrics visualization</p>

  <div class="grid">
    <div class="card">
      <h2>Overview</h2>
      <div class="stat-grid" id="overview">
        <div class="stat"><div class="value" id="total">-</div><div class="label">Total Requests</div></div>
        <div class="stat"><div class="value" id="rps">-</div><div class="label">Req/sec</div></div>
        <div class="stat"><div class="value" id="avgLatency">-</div><div class="label">Avg Latency</div></div>
        <div class="stat"><div class="value" id="failed">-</div><div class="label">Failed</div></div>
      </div>
    </div>

    <div class="card">
      <h2>Percentiles</h2>
      <div class="stat-grid">
        <div class="stat"><div class="value" id="p50">-</div><div class="label">P50</div></div>
        <div class="stat"><div class="value" id="p95">-</div><div class="label">P95</div></div>
        <div class="stat"><div class="value" id="p99">-</div><div class="label">P99</div></div>
        <div class="stat"><div class="value" id="success">-</div><div class="label">Success Rate</div></div>
      </div>
    </div>

    <div class="card full-width">
      <h2>Response Time Distribution</h2>
      <div class="chart-container"><canvas id="histogramChart"></canvas></div>
    </div>

    <div class="card">
      <h2>Requests Per Node</h2>
      <div class="chart-container"><canvas id="nodeChart"></canvas></div>
    </div>

    <div class="card">
      <h2>Avg Latency Per Node</h2>
      <div class="chart-container"><canvas id="latencyChart"></canvas></div>
    </div>
  </div>

  <div class="actions">
    <button onclick="refresh()">🔄 Refresh</button>
    <button onclick="resetMetrics()" style="background:#ef4444">🗑️ Reset Metrics</button>
  </div>

  <script>
    let histogramChart, nodeChart, latencyChart;

    async function refresh() {
      const [statsRes, histRes] = await Promise.all([
        fetch('/metrics').then(r => r.json()),
        fetch('/metrics/histogram').then(r => r.json()),
      ]);

      // Overview
      document.getElementById('total').textContent = statsRes.totalRequests;
      document.getElementById('rps').textContent = statsRes.requestsPerSecond;
      document.getElementById('avgLatency').textContent = statsRes.avgLatencyMs + 'ms';
      document.getElementById('failed').textContent = statsRes.failedRequests;
      document.getElementById('p50').textContent = statsRes.p50LatencyMs + 'ms';
      document.getElementById('p95').textContent = statsRes.p95LatencyMs + 'ms';
      document.getElementById('p99').textContent = statsRes.p99LatencyMs + 'ms';

      const successRate = statsRes.totalRequests > 0
        ? ((statsRes.successfulRequests / statsRes.totalRequests) * 100).toFixed(1) + '%'
        : '-';
      document.getElementById('success').textContent = successRate;

      // Histogram
      const histLabels = histRes.map(b => b.rangeLabel);
      const histData = histRes.map(b => b.count);
      updateChart(histogramChart, histLabels, histData);

      // Per-node charts
      const nodeIds = Object.keys(statsRes.perNode);
      const nodeCounts = nodeIds.map(id => statsRes.perNode[id].count);
      const nodeLatencies = nodeIds.map(id => statsRes.perNode[id].avgLatencyMs);
      updateChart(nodeChart, nodeIds, nodeCounts);
      updateChart(latencyChart, nodeIds, nodeLatencies);
    }

    function updateChart(chart, labels, data) {
      chart.data.labels = labels;
      chart.data.datasets[0].data = data;
      chart.update();
    }

    async function resetMetrics() {
      await fetch('/metrics/reset');
      refresh();
    }

    function createChart(id, label, color) {
      return new Chart(document.getElementById(id), {
        type: 'bar',
        data: {
          labels: [],
          datasets: [{
            label,
            data: [],
            backgroundColor: color + '40',
            borderColor: color,
            borderWidth: 1.5,
            borderRadius: 4,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } },
            y: { ticks: { color: '#64748b' }, grid: { color: '#334155' }, beginAtZero: true },
          },
        },
      });
    }

    histogramChart = createChart('histogramChart', 'Requests', '#60a5fa');
    nodeChart = createChart('nodeChart', 'Requests', '#34d399');
    latencyChart = createChart('latencyChart', 'Avg Latency (ms)', '#f472b6');

    refresh();
    setInterval(refresh, 5000);
  </script>
</body>
</html>`;

    res.type('html').send(html);
  }
}
