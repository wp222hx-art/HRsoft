'use client';
// Partner — humanized AI Partner with 3 personas. Pay-by-result.
import { useState } from 'react';
import { PERSONA_PROFILES, type Persona } from '@/lib/enums';
import { fmtDate } from '@/lib/utils';

type Chat = { id: string; createdAt: string; title?: string | null; persona?: string | null; messages: { id: string; role: string; content: string }[] };

const SUGGESTIONS = [
  '我的 SG 公司今年要交多少税?',
  '帮我把这张 PDF 发票录入并催收',
  '员工 ESOP vested 了,怎么计税?',
  '阿联酋开 VAT 注册需要什么材料?',
  '帮我看看 30 天内有什么合规风险',
  '我要拓展到香港,该怎么开始?',
];

export function PartnerView({ chats: initial }: { chats: Chat[] }) {
  const [persona, setPersona] = useState<Persona>('MAYA');
  const [input, setInput]     = useState('');
  const [busy, setBusy]       = useState(false);
  const [history, setHistory] = useState<{ role: 'user' | 'assistant'; content: string; agent?: string }[]>([]);
  const profile = PERSONA_PROFILES[persona];

  async function send(text?: string) {
    const q = (text ?? input).trim();
    if (!q) return;
    setHistory((h) => [...h, { role: 'user', content: q }]);
    setInput('');
    setBusy(true);
    try {
      const r = await fetch('/api/copilot/chat', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: q, persona }),
      });
      const j = await r.json();
      setHistory((h) => [...h, { role: 'assistant', content: j.reply || '(空回复)', agent: j.intent }]);
    } catch (e: any) {
      setHistory((h) => [...h, { role: 'assistant', content: `出错: ${e?.message || e}` }]);
    } finally { setBusy(false); }
  }

  return (
    <div className="space-y-5">
      {/* ── Persona switcher ── */}
      <section className="rounded-2xl border border-white/10 bg-ink-900/50 p-4">
        <div className="text-sm font-semibold">🤝 选择你的 AI 合伙人</div>
        <div className="mt-1 text-[11px] text-slate-400">
          三套人格 · 风格不同 · 同一套数据底层 · 按结果付费(成功省下 1 万,我才收 1000)· NovaShield 责任险兜底
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {(['ALEX', 'MAYA', 'DR_CHEN'] as Persona[]).map((p) => {
            const pp = PERSONA_PROFILES[p];
            const active = persona === p;
            return (
              <button
                key={p}
                onClick={() => setPersona(p)}
                className={`text-left rounded-xl border p-4 transition ${
                  active
                    ? 'border-nova-400 bg-nova-500/10 ring-2 ring-nova-500/40'
                    : 'border-white/10 bg-ink-950/60 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{pp.emoji}</span>
                  <div>
                    <div className="font-semibold text-white">{pp.name}</div>
                    <div className="text-[11px] text-slate-400">{pp.tagline}</div>
                  </div>
                </div>
                <div className="mt-2 text-[11px] text-slate-300">{pp.style}</div>
                <div className="mt-1 text-[10px] text-slate-500">适配:{pp.audience}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Chat ── */}
      <section className="rounded-2xl border border-white/10 bg-ink-900/50">
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{profile.emoji}</span>
            <div>
              <div className="font-semibold">与 {profile.name} 对话</div>
              <div className="text-[11px] text-slate-400">{profile.tagline}</div>
            </div>
          </div>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-300">
            ● 已通过 NovaShield 责任险担保
          </span>
        </div>

        <div className="max-h-[440px] space-y-3 overflow-y-auto p-4">
          {history.length === 0 && (
            <div className="rounded-xl border border-white/5 bg-ink-950/60 p-4">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{profile.emoji}</span>
                <div className="text-sm text-slate-300">
                  <span className="font-medium text-white">{profile.name}: </span>
                  你好👋 我可以帮你处理税务、薪酬、合规、应收应付的任何问题。试试下面的快捷提问 ↓
                </div>
              </div>
            </div>
          )}
          {history.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm ${
                  m.role === 'user'
                    ? 'bg-nova-500/20 text-white'
                    : 'border border-white/10 bg-ink-950/60 text-slate-200'
                }`}
              >
                {m.role === 'assistant' && (
                  <div className="mb-1 flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{profile.emoji} {profile.name}</span>
                    {m.agent && <span className="rounded-full bg-white/5 px-1.5 py-0.5">agent: {m.agent}</span>}
                  </div>
                )}
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            </div>
          ))}
          {busy && (
            <div className="flex">
              <div className="rounded-2xl border border-white/10 bg-ink-950/60 px-3 py-2 text-sm text-slate-400">
                {profile.emoji} {profile.name} 正在思考…
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div className="border-t border-white/5 px-4 pt-3">
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                disabled={busy}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-300 hover:bg-white/10"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 border-t border-white/5 p-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder={`和 ${profile.name} 聊点什么…`}
            className="nova-input flex-1"
          />
          <button onClick={() => send()} disabled={busy || !input.trim()} className="nova-btn-primary text-xs">
            发送
          </button>
        </div>
      </section>

      {/* Recent threads */}
      {initial.length > 0 && (
        <section className="rounded-2xl border border-white/10 bg-ink-900/50 p-4">
          <div className="mb-2 text-sm font-semibold">📂 最近对话</div>
          <div className="grid gap-2 md:grid-cols-2">
            {initial.slice(0, 6).map((c) => (
              <div key={c.id} className="rounded-xl border border-white/5 bg-ink-950/60 p-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">{c.title || '未命名对话'}</span>
                  <span className="text-slate-500">{fmtDate(c.createdAt)}</span>
                </div>
                <div className="mt-1 text-[11px] text-slate-400">
                  {c.messages.length} 条消息 · persona: {c.persona || '—'}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
