// SiNova.Insight — k-anonymity + differential-privacy noise (demo).
// Doc §3.5: k-匿名脱敏(k≥10) + 差分隐私(ε=1.0)

const DEFAULT_K = 10;
const DEFAULT_EPSILON = 1.0;

/** Drop groups whose size < k (k-anonymity). */
export function kAnonymize<T>(rows: T[], groupKey: (r: T) => string, k = DEFAULT_K): T[] {
  const groups: Record<string, T[]> = {};
  for (const r of rows) {
    const key = groupKey(r);
    (groups[key] ||= []).push(r);
  }
  return Object.values(groups)
    .filter((g) => g.length >= k)
    .flat();
}

/** Add Laplace-distributed noise for differential privacy on numeric aggregates. */
export function addLaplaceNoise(value: number, sensitivity = 1, epsilon = DEFAULT_EPSILON): number {
  const u = Math.random() - 0.5;
  const scale = sensitivity / epsilon;
  const noise = -scale * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
  return value + noise;
}

export function privateMean(values: number[], sensitivity = 1, epsilon = DEFAULT_EPSILON): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  return addLaplaceNoise(mean, sensitivity, epsilon);
}
