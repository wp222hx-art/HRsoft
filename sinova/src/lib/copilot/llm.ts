// Optional LLM bridge — if OPENAI_API_KEY is set, we use it to:
//   1) phrase the final reply with the chosen AI persona's voice
//   2) keep the rule-based agent results as ground truth (so we never hallucinate
//      tax numbers etc.)
// If no key is configured, we fall back to a deterministic persona wrap.

import { PERSONA_PROFILES, Persona } from '../enums';
import type { AgentResult } from './agents';

type LlmConfig = {
  apiKey:  string;
  baseUrl: string;
  model:   string;
};

function getConfig(): LlmConfig | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return {
    apiKey,
    baseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    model:   process.env.OPENAI_MODEL    || 'gpt-4o-mini',
  };
}

const PERSONA_SYSTEM: Record<Persona, string> = {
  ALEX:    '你是 Alex,司诺 SiNova 的"稳健派"AI 合伙人。语气稳重严谨、用数据说话,不夸张、不冒进。回答用简体中文,3 句话内。',
  MAYA:    '你是 Maya,司诺 SiNova 的"创业派"AI 合伙人。语气活泼积极、配少量 emoji ✨,鼓励用户行动。回答用简体中文,3 句话内。',
  DR_CHEN: '你是 Dr. Chen,司诺 SiNova 的"专业派"AI 合伙人。语气学术深刻、引用案例或法规条款。回答用简体中文,3 句话内。',
};

export async function personaPolish(
  persona: Persona | null,
  userMsg: string,
  agentReply: string,
  agentResults: AgentResult[]
): Promise<string> {
  // Always include the agent results as the "facts" the LLM can rely on.
  const cfg = getConfig();
  if (!cfg || !persona) {
    // Local deterministic persona wrap (no LLM)
    if (!persona) return agentReply;
    return PERSONA_PROFILES[persona].voice('') + '\n\n' + agentReply;
  }

  const facts = agentResults
    .map((r) => `• [${r.agent}] ${r.summary}`)
    .join('\n');
  const system = PERSONA_SYSTEM[persona];

  try {
    const resp = await fetch(`${cfg.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cfg.apiKey}`,
      },
      body: JSON.stringify({
        model: cfg.model,
        temperature: 0.5,
        messages: [
          { role: 'system', content: system + '\n严格基于下方"已知事实"回答,不要捏造数字。' },
          { role: 'system', content: `已知事实:\n${facts}` },
          { role: 'user', content: userMsg },
        ],
      }),
    });
    if (!resp.ok) throw new Error(`LLM ${resp.status}`);
    const json = await resp.json() as { choices: { message: { content: string } }[] };
    return json.choices?.[0]?.message?.content?.trim() || agentReply;
  } catch {
    return PERSONA_PROFILES[persona].voice('') + '\n\n' + agentReply;
  }
}

export function llmEnabled(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}
