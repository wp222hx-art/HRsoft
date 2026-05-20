// NovaCopilot streaming-style endpoint (returns once with full reply for demo).
// Calls the agent router and optionally polishes via persona LLM.
import { NextRequest, NextResponse } from 'next/server';
import { runIntent } from '@/lib/copilot/router';
import { personaPolish, llmEnabled } from '@/lib/copilot/llm';
import { getCurrentUser } from '@/lib/auth';
import type { Persona } from '@/lib/enums';
import { PERSONAS } from '@/lib/enums';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 });

  const { message, entityId, persona } = await req.json().catch(() => ({} as Record<string, unknown>));
  const userText = String(message ?? '').trim();
  if (!userText) return NextResponse.json({ error: '请输入消息' }, { status: 400 });

  const personaToUse = (persona && PERSONAS.includes(persona as Persona))
    ? (persona as Persona)
    : (user.aiPersona && PERSONAS.includes(user.aiPersona as Persona) ? user.aiPersona as Persona : null);

  const t0 = Date.now();
  const result = await runIntent(userText, { entityId: entityId as string | undefined });
  const polished = await personaPolish(personaToUse, userText, result.reply, result.results);
  const ms = Date.now() - t0;

  return NextResponse.json({
    intent:  result.intent.name,
    confidence: result.intent.confidence,
    agents:  result.results.map((r) => ({ agent: r.agent, summary: r.summary })),
    reply:   polished,
    persona: personaToUse,
    llm:     llmEnabled(),
    elapsedMs: ms,
  });
}
