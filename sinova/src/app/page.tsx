// Landing page — server component, i18n via cookie + LangSwitch
import Link from 'next/link';
import { MODULES, JURISDICTION_META, JURISDICTIONS } from '@/lib/enums';
import { getServerT } from '@/i18n/server';
import { LangSwitch } from '@/i18n/client';

export default function LandingPage() {
  const { t } = getServerT();

  // 8-dim diff rows (key-driven)
  const diffRows: { keyDim: string; copiKey: string; novaKey: string }[] = [
    { keyDim: 'landing.diff.dim.target', copiKey: 'landing.diff.copi.target', novaKey: 'landing.diff.nova.target' },
    { keyDim: 'landing.diff.dim.geo',    copiKey: 'landing.diff.copi.geo',    novaKey: 'landing.diff.nova.geo'    },
    { keyDim: 'landing.diff.dim.mode',   copiKey: 'landing.diff.copi.mode',   novaKey: 'landing.diff.nova.mode'   },
    { keyDim: 'landing.diff.dim.cash',   copiKey: 'landing.diff.copi.cash',   novaKey: 'landing.diff.nova.cash'   },
    { keyDim: 'landing.diff.dim.risk',   copiKey: 'landing.diff.copi.risk',   novaKey: 'landing.diff.nova.risk'   },
    { keyDim: 'landing.diff.dim.bill',   copiKey: 'landing.diff.copi.bill',   novaKey: 'landing.diff.nova.bill'   },
    { keyDim: 'landing.diff.dim.eco',    copiKey: 'landing.diff.copi.eco',    novaKey: 'landing.diff.nova.eco'    },
    { keyDim: 'landing.diff.dim.vision', copiKey: 'landing.diff.copi.vision', novaKey: 'landing.diff.nova.vision' },
  ];

  // 4 Foundations (key-driven)
  const foundations = [
    { code: 'NovaVault',    emoji: '🔐', cnKey: 'landing.found.vault.cn',    descKey: 'landing.found.vault.desc',    valueKey: 'landing.found.vault.value' },
    { code: 'NovaPassport', emoji: '🛂', cnKey: 'landing.found.passport.cn', descKey: 'landing.found.passport.desc', valueKey: 'landing.found.passport.value' },
    { code: 'NovaCopilot',  emoji: '🤖', cnKey: 'landing.found.copilot.cn',  descKey: 'landing.found.copilot.desc',  valueKey: 'landing.found.copilot.value' },
    { code: 'NovaChain',    emoji: '⛓',  cnKey: 'landing.found.chain.cn',    descKey: 'landing.found.chain.desc',    valueKey: 'landing.found.chain.value' },
  ];

  // 6 Moats
  const moats = [
    { n: '①', tk: 'landing.moat.1.t', dk: 'landing.moat.1.d' },
    { n: '②', tk: 'landing.moat.2.t', dk: 'landing.moat.2.d' },
    { n: '③', tk: 'landing.moat.3.t', dk: 'landing.moat.3.d' },
    { n: '④', tk: 'landing.moat.4.t', dk: 'landing.moat.4.d' },
    { n: '⑤', tk: 'landing.moat.5.t', dk: 'landing.moat.5.d' },
    { n: '⑥', tk: 'landing.moat.6.t', dk: 'landing.moat.6.d' },
  ];

  // 10 OSS rows
  const ossRows = [
    { id: 1,  save: '60%', modKey: 'landing.oss.r1.mod',  baseKey: 'landing.oss.r1.base',  diffKey: 'landing.oss.r1.diff'  },
    { id: 2,  save: '55%', modKey: 'landing.oss.r2.mod',  baseKey: 'landing.oss.r2.base',  diffKey: 'landing.oss.r2.diff'  },
    { id: 3,  save: '70%', modKey: 'landing.oss.r3.mod',  baseKey: 'landing.oss.r3.base',  diffKey: 'landing.oss.r3.diff'  },
    { id: 4,  save: '50%', modKey: 'landing.oss.r4.mod',  baseKey: 'landing.oss.r4.base',  diffKey: 'landing.oss.r4.diff'  },
    { id: 5,  save: '40%', modKey: 'landing.oss.r5.mod',  baseKey: 'landing.oss.r5.base',  diffKey: 'landing.oss.r5.diff'  },
    { id: 6,  save: '30%', modKey: 'landing.oss.r6.mod',  baseKey: 'landing.oss.r6.base',  diffKey: 'landing.oss.r6.diff'  },
    { id: 7,  save: '50%', modKey: 'landing.oss.r7.mod',  baseKey: 'landing.oss.r7.base',  diffKey: 'landing.oss.r7.diff'  },
    { id: 8,  save: '40%', modKey: 'landing.oss.r8.mod',  baseKey: 'landing.oss.r8.base',  diffKey: 'landing.oss.r8.diff'  },
    { id: 9,  save: '30%', modKey: 'landing.oss.r9.mod',  baseKey: 'landing.oss.r9.base',  diffKey: 'landing.oss.r9.diff'  },
    { id: 10, save: '60%', modKey: 'landing.oss.r10.mod', baseKey: 'landing.oss.r10.base', diffKey: 'landing.oss.r10.diff' },
  ];

  return (
    <main className="min-h-screen bg-ink-950 text-white">
      {/* ─── Top nav ───────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-ink-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            <span className="text-2xl">📡</span>
            <span className="bg-gradient-to-r from-white via-nova-200 to-gold-400 bg-clip-text text-transparent">
              {t('app.name')}
            </span>
            <span className="ml-2 nova-chip bg-nova-500/15 text-nova-200 ring-nova-400/40">
              {t('landing.nav.brandTag')}
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a href="#manifesto"  className="text-slate-300 hover:text-white">{t('landing.nav.strategy')}</a>
            <a href="#modules"    className="text-slate-300 hover:text-white">{t('landing.nav.modules')}</a>
            <a href="#foundation" className="text-slate-300 hover:text-white">{t('landing.nav.foundation')}</a>
            <a href="#moat"       className="text-slate-300 hover:text-white">{t('landing.nav.moats')}</a>
            <a href="#opensource" className="text-slate-300 hover:text-white">{t('landing.nav.opensource')}</a>
          </nav>
          <div className="flex items-center gap-2">
            <LangSwitch />
            <Link href="/login" className="nova-btn-ghost text-slate-200">{t('common.login')}</Link>
            <Link href="/register" className="nova-btn-primary">{t('common.try')} →</Link>
          </div>
        </div>
      </header>

      {/* ─── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="nova-grid absolute inset-0 opacity-30" />
        <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-nova-600/20 blur-3xl" />
        <div className="absolute -right-40 top-40 h-[500px] w-[500px] rounded-full bg-gold-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="flex flex-col items-start">
            <span className="nova-chip bg-white/5 text-slate-200 ring-white/10">
              {t('landing.hero.kicker2')}
            </span>
            <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
              <span className="bg-gradient-to-br from-white via-nova-200 to-gold-400 bg-clip-text text-transparent">
                {t('landing.hero.h1.line1')}
              </span>
              <br />
              <span className="text-white">{t('landing.hero.h1.line2')}</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-slate-300">
              {t('landing.hero.body.lead')}
              <span className="font-semibold text-gold-400"> {t('landing.hero.body.carrier')}</span>
              {t('landing.hero.body.suffix')}
              <br className="hidden md:block" />
              <span className="text-nova-300">{t('landing.hero.token.dual')}</span> ×
              <span className="text-nova-300"> {t('landing.hero.token.passport')}</span> ×
              <span className="text-nova-300"> {t('landing.hero.token.radar')}</span> ×
              <span className="text-nova-300"> {t('landing.hero.token.flywheel')}</span> ×
              <span className="text-nova-300"> {t('landing.hero.token.token')}</span>
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/register?portal=PRO" className="nova-btn-primary text-base">
                {t('landing.hero.cta.pro')}
              </Link>
              <Link href="/register?portal=SME" className="nova-btn-outline text-base">
                {t('landing.hero.cta.sme')}
              </Link>
              <Link href="/login" className="nova-btn-ghost text-slate-300">
                {t('landing.hero.cta.demo')}
              </Link>
            </div>

            {/* 5-jurisdiction strip */}
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <span className="text-xs uppercase tracking-widest text-slate-400">
                {t('landing.hero.passportHint')}
              </span>
              {JURISDICTIONS.map((j) => {
                const meta = JURISDICTION_META[j];
                return (
                  <div key={j} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm">
                    <span className="text-base">{meta.flag}</span>
                    <span>{t(`juris.${j}`)}</span>
                    <span className="text-slate-400">· {meta.regulator}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Manifesto / vs Copi ───────────────────────────────────── */}
      <section id="manifesto" className="border-t border-white/5 bg-gradient-to-b from-ink-950 to-ink-900">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid items-start gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">
                {t('landing.manifesto.h2.line1')}<span className="text-slate-400">{t('landing.manifesto.h2.aiTool')}</span>;
                <br />
                <span className="text-gold-400">{t('landing.manifesto.h2.line2')}</span>
              </h2>
              <p className="mt-6 leading-relaxed text-slate-300">
                {t('landing.manifesto.lead')}
                <span className="font-semibold text-white">{t('landing.manifesto.lead.daring')}</span>
                {t('landing.manifesto.lead.suffix')}
              </p>
              <ul className="mt-4 space-y-2 text-slate-300">
                <li>{t('landing.manifesto.b1')}</li>
                <li>{t('landing.manifesto.b2')}</li>
                <li>{t('landing.manifesto.b3')}</li>
                <li>{t('landing.manifesto.b4')}</li>
              </ul>
              <p className="mt-6 leading-relaxed text-slate-300">
                <span className="font-semibold text-white">{t('landing.manifesto.outro1')}</span>
                {t('landing.manifesto.outro2')}
                <span className="text-gold-400">{t('landing.manifesto.outro3')}</span>
                {t('landing.manifesto.outro4')}
                <span className="text-nova-300">{t('landing.manifesto.outro5')}</span>
                {t('landing.manifesto.outro6')}
              </p>
            </div>

            {/* vs Copi dimension table */}
            <div className="nova-card-dark p-6">
              <div className="mb-4 text-sm uppercase tracking-widest text-slate-400">
                {t('landing.versus.kicker')}
              </div>
              <div className="grid gap-3 text-sm">
                {diffRows.map((row) => (
                  <div key={row.keyDim} className="grid grid-cols-[100px_1fr_1fr] gap-3 border-b border-white/5 pb-2.5">
                    <div className="font-medium text-slate-300">{t(row.keyDim)}</div>
                    <div className="text-slate-400">{t(row.copiKey)}</div>
                    <div className="text-nova-300">{t(row.novaKey)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 10 modules ────────────────────────────────────────────── */}
      <section id="modules" className="border-t border-white/5 bg-ink-950">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <span className="nova-chip bg-nova-500/15 text-nova-200 ring-nova-400/40">
                {t('landing.modules.kicker')}
              </span>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">{t('landing.modules.h2')}</h2>
              <p className="mt-2 text-slate-400">{t('landing.modules.lead')}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {MODULES.map((m) => (
              <div key={m.slug}
                   className={`group nova-card-dark relative overflow-hidden p-5 transition hover:-translate-y-1 hover:nova-glow ${m.killer ? 'ring-1 ring-gold-500/30' : ''}`}>
                {m.killer && (
                  <div className="absolute right-3 top-3 nova-chip bg-gold-500/15 text-gold-400 ring-gold-500/40">
                    {t('landing.modules.killerChip')}
                  </div>
                )}
                <div className="text-3xl">{m.emoji}</div>
                <div className="mt-2 text-sm font-mono text-nova-300">{m.code}</div>
                <div className="text-lg font-semibold">{t(`mod.${m.slug}.cn`)}</div>
                <p className="mt-2 line-clamp-2 text-sm text-slate-400">{t(`mod.${m.slug}.tagline`)}</p>
                <div className="mt-3 text-xs text-slate-500">{t('landing.modules.vsLabel')} {m.copi}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Foundation 4 ──────────────────────────────────────────── */}
      <section id="foundation" className="border-t border-white/5 bg-gradient-to-b from-ink-950 to-ink-900">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10">
            <span className="nova-chip bg-gold-500/15 text-gold-400 ring-gold-500/40">
              {t('landing.foundations.kicker')}
            </span>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">{t('landing.foundations.h2')}</h2>
            <p className="mt-2 text-slate-400">{t('landing.foundations.lead')}</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {foundations.map((x) => (
              <div key={x.code} className="nova-card-dark p-6">
                <div className="text-3xl">{x.emoji}</div>
                <div className="mt-3 font-mono text-sm text-nova-300">{x.code}</div>
                <div className="text-lg font-semibold">{t(x.cnKey)}</div>
                <p className="mt-3 text-sm text-slate-400">{t(x.descKey)}</p>
                <div className="mt-4 border-t border-white/5 pt-3 text-xs text-gold-400">
                  💡 {t(x.valueKey)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6 moats ───────────────────────────────────────────────── */}
      <section id="moat" className="border-t border-white/5 bg-ink-950">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10">
            <span className="nova-chip bg-nova-500/15 text-nova-200 ring-nova-400/40">
              {t('landing.moats.kicker')}
            </span>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">{t('landing.moats.h2')}</h2>
            <p className="mt-2 text-slate-400">{t('landing.moats.lead')}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {moats.map((x) => (
              <div key={x.n} className="nova-card-dark p-6">
                <div className="text-4xl font-bold text-gold-400">{x.n}</div>
                <div className="mt-2 text-lg font-semibold">{t(x.tk)}</div>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">{t(x.dk)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Open source stack ─────────────────────────────────────── */}
      <section id="opensource" className="border-t border-white/5 bg-gradient-to-b from-ink-900 to-ink-950">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10">
            <span className="nova-chip bg-emerald-500/15 text-emerald-300 ring-emerald-500/40">
              {t('landing.oss.kicker')}
            </span>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">{t('landing.oss.h2')}</h2>
            <p className="mt-2 max-w-3xl text-slate-400">{t('landing.oss.lead')}</p>
          </div>

          <div className="grid gap-3 text-sm md:grid-cols-2 lg:grid-cols-3">
            {ossRows.map((row) => (
              <div key={row.id} className="nova-card-dark p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{t(row.modKey)}</div>
                  <span className="nova-chip bg-emerald-500/15 text-emerald-300 ring-emerald-500/40">
                    {t('landing.oss.savePrefix')} {row.save}
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-500">{t('landing.oss.col.basis')}</div>
                <div className="text-sm text-slate-300">{t(row.baseKey)}</div>
                <div className="mt-2 text-xs text-slate-500">{t('landing.oss.col.diff')}</div>
                <div className="text-sm text-gold-400">{t(row.diffKey)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────────────── */}
      <section className="border-t border-white/5 bg-gradient-to-br from-nova-900/40 via-ink-950 to-ink-900">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center">
          <h2 className="text-3xl font-bold md:text-5xl">
            <span className="bg-gradient-to-r from-white via-nova-200 to-gold-400 bg-clip-text text-transparent">
              {t('landing.cta.h2')}
            </span>
          </h2>
          <p className="mt-5 mx-auto max-w-2xl text-slate-300">{t('landing.cta.body')}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/login" className="nova-btn-primary text-base">{t('landing.cta.btnLogin')}</Link>
            <Link href="/register" className="nova-btn-outline text-base">{t('landing.cta.btnCreate')}</Link>
          </div>
          <div className="mt-6 text-xs text-slate-500">
            {t('landing.cta.demoPassword')}<code className="rounded bg-white/10 px-1.5 py-0.5">demo1234</code>
            &nbsp;{t('landing.cta.demoNote')}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 bg-ink-950 py-8 text-center text-xs text-slate-500">
        {t('landing.footer.copy')}
        <span className="mx-2">·</span>
        {t('landing.footer.basedOn')}
      </footer>
    </main>
  );
}
