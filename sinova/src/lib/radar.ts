// SiNova.Radar — 3-dimension weighted risk scoring engine.
// Implements doc §2.2.6: 客户历史 40% + 行业基准 30% + 监管风向 30%.
//
// Higher composite = healthier. Lower = more risky.
//   80-100 → HEALTHY  (no action)
//   60-79  → WATCH    (90-day lead, email)
//   40-59  → ALERT    (60-day lead, SMS + Pro highlight)
//   0-39   → CRITICAL (30-day lead, phone + AI Partner takeover)

import type { RadarLevel } from './enums';

export type RadarInput = {
  scoreHistory:   number; // 0-100, customer's own historical compliance
  scoreBenchmark: number; // 0-100, peer-industry comparison
  scoreReg:       number; // 0-100, regulatory exposure
};

export function compositeScore(i: RadarInput): number {
  const v =
    i.scoreHistory   * 0.4 +
    i.scoreBenchmark * 0.3 +
    i.scoreReg       * 0.3;
  return Math.round(Math.max(0, Math.min(100, v)));
}

export function levelOf(composite: number): RadarLevel {
  if (composite >= 80) return 'HEALTHY';
  if (composite >= 60) return 'WATCH';
  if (composite >= 40) return 'ALERT';
  return 'CRITICAL';
}

export function leadDays(level: RadarLevel): number {
  switch (level) {
    case 'HEALTHY':  return 0;
    case 'WATCH':    return 90;
    case 'ALERT':    return 60;
    case 'CRITICAL': return 30;
  }
}

// Recommended remediation channel
export function actionFor(level: RadarLevel): string[] {
  switch (level) {
    case 'HEALTHY':  return [];
    case 'WATCH':    return ['📧 邮件提醒', '🤖 AI 自动补救建议'];
    case 'ALERT':    return ['📱 SMS 通知', '🖥 Pro 工作台高亮', '🤖 AI 补救方案'];
    case 'CRITICAL': return ['📞 电话外呼', '🤝 AI Partner 接管', '⚠️ 强制审核'];
  }
}

export function score(i: RadarInput) {
  const composite = compositeScore(i);
  const level     = levelOf(composite);
  return {
    ...i,
    composite,
    level,
    daysAhead: leadDays(level),
    actions:   actionFor(level),
  };
}
