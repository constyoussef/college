import { performance } from 'perf_hooks';

/**
 * CPU-intensive computation function.
 *
 * H(n) = Σ (i=1 to n×1,000,000) √i × sin(i) / ln(i+1)
 *
 * @param n - Multiplier for the iteration count (n × 1,000,000 iterations)
 * @returns Object containing the computed result and processing time in ms
 */
export function computeH(n: number): { result: number; processingTimeMs: number } {
  const startTime = performance.now();

  const iterations = n * 1_000_000;
  let sum = 0;

  for (let i = 1; i <= iterations; i++) {
    sum += Math.sqrt(i) * Math.sin(i) / Math.log(i + 1);
  }

  const endTime = performance.now();
  const processingTimeMs = Math.round((endTime - startTime) * 100) / 100;

  return {
    result: Math.round(sum * 1e6) / 1e6, // 6 decimal places
    processingTimeMs,
  };
}
