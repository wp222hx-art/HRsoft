// SiNova.Arena — Health Compliance Score (HCS) + badges.
// Implements doc §2.2.9: HCS = (合规及时性 × 40%) + (财务健康 × 30%)
//                            + (治理完整 × 20%)   + (主动改进 × 10%)

import type { HealthState } from './enums';

export type HcsInput = {
  punctuality:  number; // 0-100, on-time filings rate
  finance:      number; // 0-100, AR/AP / cash health
  governance:   number; // 0-100, gov actions completed on time
  improvement:  number; // 0-100, alerts proactively closed
};

export function computeHcs(i: HcsInput): number {
  const v =
    i.punctuality * 0.4 +
    i.finance     * 0.3 +
    i.governance  * 0.2 +
    i.improvement * 0.1;
  return Math.round(Math.max(0, Math.min(100, v)));
}

export function hcsState(hcs: number): HealthState {
  if (hcs >= 80) return 'HEALTHY';
  if (hcs >= 60) return 'AT_RISK';
  if (hcs >= 40) return 'WARNING';
  if (hcs >= 20) return 'CRITICAL';
  return 'DEFAULTED';
}

// 30+ badge catalog (subset — doc §2.2.9 examples)
export const BADGE_CATALOG = [
  { code: 'ON_TIME_100',  name: '准时星',     emoji: '🏆', category: 'PUNCTUAL', description: '连续 100 单按时申报' },
  { code: 'ACCURATE_100', name: '神枪手',     emoji: '🎯', category: 'ACCURATE', description: '单季 100% 一次性通过 IRAS' },
  { code: 'GLOBAL_5',     name: '环球客',     emoji: '🌍', category: 'GLOBAL',   description: '完成 5 国合规申报' },
  { code: 'SPEED_DEMON',  name: '闪电侠',     emoji: '⚡', category: 'SPEED',    description: '单笔申报 < 1 分钟完成' },
  { code: 'GOALIE',       name: '守门员',     emoji: '🛡', category: 'DEFENSE',  description: '整年客户无罚款' },
  { code: 'STREAK_30',    name: '连胜王',     emoji: '🔥', category: 'STREAK',   description: '连续 30 天每天处理任务' },
  { code: 'DIAMOND',      name: '钻石用户',   emoji: '💎', category: 'DIAMOND',  description: '服务超 1000 个 entity' },
  { code: 'RADAR_TAMER',  name: '雷达克星',   emoji: '📡', category: 'DEFENSE',  description: '关闭 50 个 Radar 预警' },
  { code: 'CASH_HERO',    name: '现金英雄',   emoji: '💰', category: 'PUNCTUAL', description: '帮客户回收 100 万 SGD 应收' },
  { code: 'ESOP_MASTER',  name: '期权大师',   emoji: '📈', category: 'ACCURATE', description: '管理 1000 份 ESOP grants' },
  { code: 'WEB3_PIONEER', name: 'Web3 先锋',  emoji: '🪙', category: 'GLOBAL',   description: '完成首个 DAO 实体注册' },
  { code: 'TOKEN_HOLDER', name: '$NOVA 持有', emoji: '🚀', category: 'DIAMOND',  description: '获得 1000+ $NOVA Tokens' },
] as const;
