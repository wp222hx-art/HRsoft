'use client';
// Help / Documentation page — shared by Pro & SME portals.
// Searchable TOC + sections covering everything a user needs to know.
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n/client';

type Portal = 'pro' | 'sme';

const MODULES = [
  'taxshield', 'payflow', 'cashloop', 'govhub', 'taxnet',
  'radar', 'partner', 'market', 'arena', 'insight',
] as const;

const SECTIONS = [
  { id: 'welcome',  emoji: '👋' },
  { id: 'start',    emoji: '🚀' },
  { id: 'modules',  emoji: '🧩' },
  { id: 'copilot',  emoji: '✨' },
  { id: 'token',    emoji: '🚀' },
  { id: 'security', emoji: '🔒' },
  { id: 'faq',      emoji: '❓' },
  { id: 'support',  emoji: '🆘' },
] as const;

export function HelpView({ portal }: { portal: Portal }) {
  const { t, lang } = useI18n();
  const [query, setQuery] = useState('');
  const isPro = portal === 'pro';
  const moduleBase = isPro ? '/pro/modules' : '/sme/modules';

  // Search filter — flatten all relevant strings per section
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    const hits = new Set<string>();
    // Search section titles + bodies
    for (const s of SECTIONS) {
      const candidates = [
        t(`help.s.${s.id}.title`),
        t(`help.s.${s.id}.body`),
        t(`help.s.${s.id}.subtitle`),
      ].filter(Boolean).join(' ').toLowerCase();
      if (candidates.includes(q)) hits.add(s.id);
    }
    // Search module entries
    for (const m of MODULES) {
      const candidates = [
        t(`help.mod.${m}.title`),
        t(`help.mod.${m}.what`),
        t(`help.mod.${m}.who`),
        t(`help.mod.${m}.tip`),
      ].filter(Boolean).join(' ').toLowerCase();
      if (candidates.includes(q)) hits.add('modules');
    }
    return hits;
  }, [query, t]);

  const isVisible = (id: string) => !filtered || filtered.has(id);

  // Light wrappers — works under both ProShell (dark) & SmeShell (dark inner card)
  const cardCls    = 'rounded-2xl border border-white/10 bg-ink-900/50 p-5';
  const subCardCls = 'rounded-xl border border-white/5 bg-ink-950/60 p-4';
  const linkCls    = 'text-nova-300 hover:text-nova-200 underline-offset-2 hover:underline';

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="rounded-2xl border border-nova-500/30 bg-gradient-to-br from-nova-500/10 via-ink-950 to-ink-950 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">{t('help.title')}</h1>
            <p className="mt-1 text-sm text-slate-400">{t('help.subtitle')}</p>
            <p className="mt-2 text-[11px] text-slate-500">{t('help.lastUpdated')}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => typeof window !== 'undefined' && window.print()}
              className="nova-btn-outline text-xs"
            >
              {t('help.printBtn')}
            </button>
          </div>
        </div>
        {/* Search */}
        <div className="mt-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('help.searchPlaceholder')}
            className="w-full rounded-xl border border-white/10 bg-ink-950/80 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-nova-400/60 focus:ring-1 focus:ring-nova-400/40"
          />
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[200px_1fr]">
        {/* TOC sidebar */}
        <aside className="hidden lg:block">
          <nav className="sticky top-[88px] space-y-1 rounded-2xl border border-white/10 bg-ink-900/40 p-3 text-sm">
            <div className="px-2 pb-2 text-[11px] uppercase tracking-widest text-slate-500">
              {t('help.toc')}
            </div>
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#sec-${s.id}`}
                className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-slate-300 hover:bg-white/5 hover:text-white ${
                  filtered && !filtered.has(s.id) ? 'opacity-30' : ''
                }`}
              >
                <span>{s.emoji}</span>
                <span className="truncate">{t(`help.s.${s.id}.title`)}</span>
              </a>
            ))}
            <div className="my-2 border-t border-white/5" />
            <a href="#top" className="block rounded-lg px-2 py-1.5 text-[11px] text-slate-500 hover:text-slate-300">
              {t('help.cta.backTop')}
            </a>
          </nav>
        </aside>

        {/* Main content */}
        <main className="space-y-5">
          {/* Welcome */}
          {isVisible('welcome') && (
            <section id="sec-welcome" className={cardCls}>
              <h2 className="text-lg font-semibold text-white">{t('help.s.welcome.title')}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{t('help.s.welcome.body')}</p>
              <div className="mt-4">
                <div className="text-sm font-semibold text-white">{t('help.s.welcome.audience.title')}</div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className={subCardCls}>
                    <div className="font-medium text-nova-300">{t('help.s.welcome.audience.pro')}</div>
                    <div className="mt-1 text-[12px] leading-relaxed text-slate-400">
                      {t('help.s.welcome.audience.proBody')}
                    </div>
                  </div>
                  <div className={subCardCls}>
                    <div className="font-medium text-emerald-300">{t('help.s.welcome.audience.sme')}</div>
                    <div className="mt-1 text-[12px] leading-relaxed text-slate-400">
                      {t('help.s.welcome.audience.smeBody')}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Quick Start */}
          {isVisible('start') && (
            <section id="sec-start" className={cardCls}>
              <h2 className="text-lg font-semibold text-white">{t('help.s.start.title')}</h2>
              <ol className="mt-3 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <li key={i} className={subCardCls}>
                    <div className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-nova-500/20 text-xs font-bold text-nova-300">
                        {i}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-white">{t(`help.s.start.step${i}.title`)}</div>
                        <div className="mt-1 text-[12px] leading-relaxed text-slate-400">
                          {t(`help.s.start.step${i}.body`)}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* 10 Modules */}
          {isVisible('modules') && (
            <section id="sec-modules" className={cardCls}>
              <h2 className="text-lg font-semibold text-white">{t('help.s.modules.title')}</h2>
              <p className="mt-1 text-[12px] text-slate-400">{t('help.s.modules.subtitle')}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {MODULES.map((m) => (
                  <div key={m} className={`${subCardCls} flex flex-col`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-white">{t(`help.mod.${m}.title`)}</div>
                      <Link
                        href={`${moduleBase}/${m}`}
                        className="shrink-0 rounded-full bg-nova-500/15 px-2 py-0.5 text-[10px] text-nova-300 ring-1 ring-nova-400/40 hover:bg-nova-500/25"
                      >
                        {t('help.cta.tryModule')}
                      </Link>
                    </div>
                    <div className="mt-2 space-y-1.5 text-[12px] text-slate-300">
                      <div>{t(`help.mod.${m}.what`)}</div>
                      <div className="text-slate-400">{t(`help.mod.${m}.who`)}</div>
                      <div className="rounded-md bg-white/5 px-2 py-1 text-[11px] text-amber-200">
                        💡 {t(`help.mod.${m}.tip`)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* AI Copilot */}
          {isVisible('copilot') && (
            <section id="sec-copilot" className={cardCls}>
              <h2 className="text-lg font-semibold text-white">{t('help.s.copilot.title')}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{t('help.s.copilot.body')}</p>
              <div className="mt-4">
                <div className="text-sm font-semibold text-white">{t('help.s.copilot.examples.title')}</div>
                <ul className="mt-2 space-y-2 text-[12px]">
                  {[1, 2, 3, 4].map((i) => (
                    <li key={i} className={subCardCls + ' text-slate-300'}>
                      {t(`help.s.copilot.example${i}`)}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* $NOVA Tokens */}
          {isVisible('token') && (
            <section id="sec-token" className={cardCls}>
              <h2 className="text-lg font-semibold text-white">{t('help.s.token.title')}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{t('help.s.token.what')}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className={subCardCls}>
                  <div className="font-medium text-emerald-300">{t('help.s.token.earn.title')}</div>
                  <ul className="mt-2 space-y-1 text-[12px] text-slate-300">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <li key={i}>{t(`help.s.token.earn.${i}`)}</li>
                    ))}
                  </ul>
                </div>
                <div className={subCardCls}>
                  <div className="font-medium text-gold-400">{t('help.s.token.spend.title')}</div>
                  <ul className="mt-2 space-y-1 text-[12px] text-slate-300">
                    {[1, 2, 3].map((i) => (
                      <li key={i}>{t(`help.s.token.spend.${i}`)}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* Security */}
          {isVisible('security') && (
            <section id="sec-security" className={cardCls}>
              <h2 className="text-lg font-semibold text-white">{t('help.s.security.title')}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{t('help.s.security.body')}</p>
            </section>
          )}

          {/* FAQ */}
          {isVisible('faq') && (
            <section id="sec-faq" className={cardCls}>
              <h2 className="text-lg font-semibold text-white">{t('help.s.faq.title')}</h2>
              <div className="mt-4 space-y-3">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <details key={i} className={subCardCls + ' group'}>
                    <summary className="cursor-pointer list-none font-medium text-white">
                      <span className="mr-2 text-slate-500 group-open:hidden">▸</span>
                      <span className="mr-2 hidden text-nova-400 group-open:inline">▾</span>
                      {t(`help.s.faq.q${i}`)}
                    </summary>
                    <div className="mt-2 text-[12px] leading-relaxed text-slate-400">
                      {t(`help.s.faq.a${i}`)}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Support */}
          {isVisible('support') && (
            <section id="sec-support" className={cardCls}>
              <h2 className="text-lg font-semibold text-white">{t('help.s.support.title')}</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>{t('help.s.support.email')}</li>
                <li>{t('help.s.support.chat')}</li>
                <li>{t('help.s.support.community')}</li>
                <li>{t('help.s.support.status')}</li>
                <li className="text-amber-200">{t('help.s.support.feedback')}</li>
              </ul>
            </section>
          )}

          {/* No matches */}
          {filtered && filtered.size === 0 && (
            <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm text-slate-500">
              {lang === 'en'
                ? `No results for "${query}". Try another keyword.`
                : `没有找到 "${query}" 相关内容。试试别的关键词。`}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
