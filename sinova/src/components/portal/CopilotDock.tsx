// NovaCopilot floating chat dock — calls /api/copilot/chat
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { X, Sparkles, Send, Cpu } from 'lucide-react';
import { useI18n } from '@/i18n/client';

type Msg = {
  role:    'user' | 'assistant';
  content: string;
  agents?: { agent: string; summary: string }[];
  intent?: string;
  ms?:     number;
};

const SUGGESTION_KEYS = [
  'sugg.radarRed',
  'sugg.payroll',
  'sugg.taxDeadline',
  'sugg.willDefault',
  'sugg.openHK',
  'sugg.dunning',
];

export function CopilotDock({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: t('copilot.welcome2') },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  // Translated suggestion list
  const suggestions = useMemo(() => SUGGESTION_KEYS.map((k) => t(k)), [t]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  async function send(text: string) {
    if (!text.trim() || busy) return;
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setInput('');
    setBusy(true);
    try {
      const r = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const j = await r.json();
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: j.reply || t('copilot.empty.reply'),
          agents: j.agents,
          intent: j.intent,
          ms: j.elapsedMs,
        },
      ]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: t('copilot.callError') }]);
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end bg-black/40 p-4 sm:items-end">
      <div className="flex h-[85vh] w-full max-w-md flex-col rounded-2xl border border-white/10 bg-ink-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-nova-300" />
            <span className="font-semibold text-white">NovaCopilot</span>
            <span className="nova-chip bg-nova-500/15 text-nova-200 ring-nova-400/40">
              Multi-Agent
            </span>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-white/10 text-slate-300">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scroller} className="flex-1 overflow-y-auto nova-scroll px-4 py-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-nova-600 text-white'
                  : 'bg-white/5 text-slate-100 ring-1 ring-white/5'
              }`}>
                {m.role === 'assistant' && m.agents && m.agents.length > 0 && (
                  <div className="mb-2 space-y-1 border-b border-white/10 pb-2">
                    {m.agents.map((a, k) => (
                      <div key={k} className="flex items-start gap-2 text-xs text-slate-300">
                        <Cpu className="mt-0.5 h-3 w-3 shrink-0 text-nova-300" />
                        <span><span className="font-mono text-nova-300">{a.agent}</span> · {a.summary}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="whitespace-pre-wrap">{m.content}</div>
                {m.role === 'assistant' && m.ms != null && (
                  <div className="mt-1 text-[10px] text-slate-500">
                    intent: {m.intent} · {m.ms}ms
                  </div>
                )}
              </div>
            </div>
          ))}
          {busy && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-white/5 px-4 py-2.5 text-xs text-slate-400 ring-1 ring-white/5">
                {t('copilot.thinking2')}
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="border-t border-white/5 px-4 py-3">
            <div className="text-[11px] uppercase tracking-widest text-slate-500">
              {t('copilot.tryThese')}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button key={s} onClick={() => send(s)} disabled={busy}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 hover:bg-white/10 disabled:opacity-50">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-white/10 p-3">
          <form onSubmit={(e) => { e.preventDefault(); send(input); }}
                className="flex items-center gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)}
              placeholder={t('copilot.placeholder2')}
              className="nova-input-dark flex-1" />
            <button type="submit" disabled={busy || !input.trim()}
              className="rounded-xl bg-nova-600 p-2.5 text-white hover:bg-nova-700 disabled:opacity-40">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
