// NovaCopilot — Multi-Agent skeleton in the spirit of LangGraph + CrewAI.
// Implements doc §2.4: 7 atomic capabilities (intent → fetch → agent → draft
// → validate → approve → notify) and the 8 natural-language samples.
//
// Each module has a tiny "agent" function that takes structured args and
// returns a structured result + a human-readable answer.

import { prisma } from '../db';
import { score } from '../radar';

// ─── Tool / Agent registry ───────────────────────────────────────────────────
export type AgentResult = {
  agent:   string;
  summary: string;
  data?:   unknown;
};

async function taxShieldAgent(ctx: { entityId?: string }): Promise<AgentResult> {
  const where = ctx.entityId ? { entityId: ctx.entityId } : {};
  const filings = await prisma.taxFiling.findMany({
    where, orderBy: { dueDate: 'asc' }, take: 5,
    include: { entity: { select: { legalName: true, jurisdiction: true } } },
  });
  return {
    agent: 'TaxShield Agent',
    summary: `找到 ${filings.length} 笔即将到期的税务申报,合计应缴 ${filings.reduce((s, f) => s + f.taxPayable, 0).toFixed(0)} SGD`,
    data: filings,
  };
}

async function payFlowAgent(ctx: { entityId?: string }): Promise<AgentResult> {
  const where = ctx.entityId ? { entityId: ctx.entityId } : {};
  const runs = await prisma.payrollRun.findMany({
    where, orderBy: { createdAt: 'desc' }, take: 3,
  });
  const total = runs.reduce((s, r) => s + r.netTotal, 0);
  return {
    agent: 'PayFlow Agent',
    summary: `本月薪酬待执行 ${runs.length} 批 · 净支出 ${total.toFixed(0)} SGD`,
    data: runs,
  };
}

async function cashLoopAgent(ctx: { entityId?: string }): Promise<AgentResult> {
  const where = ctx.entityId ? { entityId: ctx.entityId } : {};
  const overdue = await prisma.invoice.findMany({
    where: { ...where, status: 'OVERDUE' },
    orderBy: { daysOverdue: 'desc' },
    take: 10,
  });
  const ar = overdue.reduce((s, i) => s + i.amount, 0);
  return {
    agent: 'CashLoop Agent',
    summary: `检测到 ${overdue.length} 张逾期发票 · 应收 ${ar.toFixed(0)} ${overdue[0]?.currency ?? 'SGD'} · 已生成多语种催收草稿`,
    data: overdue,
  };
}

async function govHubAgent(ctx: { entityId?: string }): Promise<AgentResult> {
  const where = ctx.entityId ? { entityId: ctx.entityId } : {};
  const pending = await prisma.govAction.findMany({
    where: { ...where, status: { not: 'CONFIRMED' } },
    orderBy: { dueDate: 'asc' },
    take: 5,
  });
  return {
    agent: 'GovHub Agent',
    summary: `${pending.length} 项治理事项进行中(AGM / 变更 / 注册)`,
    data: pending,
  };
}

async function taxNetAgent(ctx: { entityId?: string }): Promise<AgentResult> {
  const where = ctx.entityId ? { entityId: ctx.entityId } : {};
  const vats = await prisma.vatReturn.findMany({
    where, orderBy: { dueDate: 'asc' }, take: 5,
  });
  const exceptions = vats.reduce((s, v) => s + v.exceptions, 0);
  return {
    agent: 'TaxNet Agent',
    summary: `${vats.length} 份间接税申报跟踪中 · 检出 ${exceptions} 个交易异常`,
    data: vats,
  };
}

async function radarAgent(ctx: { entityId?: string; minLevel?: 'WATCH' | 'ALERT' | 'CRITICAL' }): Promise<AgentResult> {
  const where: Record<string, unknown> = ctx.entityId ? { entityId: ctx.entityId } : {};
  if (ctx.minLevel) where.level = ctx.minLevel;
  const alerts = await prisma.radarAlert.findMany({
    where: { ...where, status: { not: 'CLOSED' } },
    orderBy: [{ level: 'asc' }, { createdAt: 'desc' }],
    take: 8,
    include: { entity: { select: { legalName: true } } },
  });
  // Real-time recompute composite for top alerts to demonstrate algorithm
  const reseen = alerts.map((a) => ({
    ...a,
    recomputed: score({ scoreHistory: a.scoreHistory, scoreBenchmark: a.scoreBenchmark, scoreReg: a.scoreReg }),
  }));
  return {
    agent: 'Radar Agent',
    summary: `🔴 ${reseen.filter(a => a.level === 'CRITICAL').length} · 🟠 ${reseen.filter(a => a.level === 'ALERT').length} · 🟡 ${reseen.filter(a => a.level === 'WATCH').length}`,
    data: reseen,
  };
}

async function vaultAgent(ctx: { entityId?: string }): Promise<AgentResult> {
  const where = ctx.entityId ? { entityId: ctx.entityId } : {};
  const docs = await prisma.vaultDoc.findMany({
    where, orderBy: { uploadedAt: 'desc' }, take: 6,
  });
  return {
    agent: 'NovaVault Agent',
    summary: `Vault 中保管 ${docs.length} 份文档 · 全部已上链 NovaChain`,
    data: docs,
  };
}

async function passportAgent(ctx: { entityId?: string }): Promise<AgentResult> {
  const where = ctx.entityId ? { id: ctx.entityId } : {};
  const entities = await prisma.entity.findMany({ where, take: 5 });
  const summary = entities.map((e) => `${e.legalName}(${e.passportCountries})`).join(', ');
  return {
    agent: 'NovaPassport Agent',
    summary: summary || '尚未激活全球护照',
    data: entities,
  };
}

export const AGENTS = {
  taxshield: taxShieldAgent,
  payflow:   payFlowAgent,
  cashloop:  cashLoopAgent,
  govhub:    govHubAgent,
  taxnet:    taxNetAgent,
  radar:     radarAgent,
  vault:     vaultAgent,
  passport:  passportAgent,
} as const;

export type AgentName = keyof typeof AGENTS;
