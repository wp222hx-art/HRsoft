// NovaCopilot intent router — rule-based fallback when no LLM is configured.
// Mirrors the 8 sample intents in doc §2.4.
import { AGENTS, AgentName, AgentResult } from './agents';

export type Intent = {
  name:    string;
  agents:  AgentName[];
  confidence: number;
  reply:   (results: AgentResult[]) => string;
};

const RULES: Array<{
  match: RegExp;
  intent: Omit<Intent, 'confidence'>;
}> = [
  {
    match: /(发工资|payroll|薪|发薪)/i,
    intent: {
      name: 'payroll.run',
      agents: ['payflow', 'cashloop'],
      reply: (r) =>
        `${r[0].summary}\n现金流确认:${r[1].summary}\n待您一键审批后,Airwallex 会跨 5 国出款。`,
    },
  },
  {
    match: /(税务截止|报税截止|申报截止|tax due|filing due)/i,
    intent: {
      name: 'tax.dueList',
      agents: ['taxshield', 'taxnet'],
      reply: (r) => `📅 下一季税务时间轴:\n· ${r[0].summary}\n· ${r[1].summary}`,
    },
  },
  {
    match: /(地址|公司变更|change.*address|director|股东|share allotment)/i,
    intent: {
      name: 'gov.action',
      agents: ['govhub', 'vault'],
      reply: (r) => `✅ GovHub 已生成模板并路由审批:\n${r[0].summary}\n📁 ${r[1].summary}`,
    },
  },
  {
    match: /(雷达|预警|red alert|critical|风险)/i,
    intent: {
      name: 'radar.scan',
      agents: ['radar'],
      reply: (r) => `📡 Radar 实时扫描:${r[0].summary}\n各预警均已附带补救建议,可一键启动。`,
    },
  },
  {
    match: /(开公司|注册.*香港|开.*分公司|incorpor|delaware|dmcc)/i,
    intent: {
      name: 'gov.incorporation',
      agents: ['govhub', 'passport'],
      reply: (r) =>
        `🌍 GovHub + NovaPassport 已就绪:\n· ${r[0].summary}\n· ${r[1].summary}\n下一步会引导 KYB 并匹配本地律师 App。`,
    },
  },
  {
    match: /(违约|坏账|信用|催收|催款|chase|collect|overdue)/i,
    intent: {
      name: 'cash.collect',
      agents: ['cashloop', 'radar'],
      reply: (r) => `💸 CashLoop:${r[0].summary}\n📡 客户违约预测:${r[1].summary}`,
    },
  },
  {
    match: /(归档|存证|vault|安全保管|保险柜)/i,
    intent: {
      name: 'vault.store',
      agents: ['vault'],
      reply: (r) => `🔐 ${r[0].summary}\n所有文档已 SHA-256 哈希上链,可随时查询凭证。`,
    },
  },
];

const DEFAULT_INTENT: Omit<Intent, 'confidence'> = {
  name: 'general.brief',
  agents: ['radar', 'cashloop', 'taxshield', 'govhub'],
  reply: (r) =>
    [
      '👋 我是 NovaCopilot,刚为您并行调用了 4 个 Agent:',
      `· 📡 ${r[0].summary}`,
      `· 🔁 ${r[1].summary}`,
      `· 🛡 ${r[2].summary}`,
      `· 🏛 ${r[3].summary}`,
      '',
      '想深入哪一项?直接对我说就行。',
    ].join('\n'),
};

export function classify(text: string): Intent {
  for (const rule of RULES) {
    if (rule.match.test(text)) return { ...rule.intent, confidence: 0.85 };
  }
  return { ...DEFAULT_INTENT, confidence: 0.4 };
}

export async function runIntent(text: string, ctx: { entityId?: string }) {
  const intent = classify(text);
  const results: AgentResult[] = [];
  for (const a of intent.agents) {
    try {
      const fn = AGENTS[a];
      results.push(await fn(ctx));
    } catch (err) {
      results.push({ agent: a, summary: `(${a} 暂不可用)` });
    }
  }
  return {
    intent,
    results,
    reply: intent.reply(results),
  };
}
