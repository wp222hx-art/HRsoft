'use client';
// Market — Compliance App Store. 70/30 revenue share. Open API.
import { useState } from 'react';
import { useI18n } from '@/i18n/client';

type App = {
  id: string; slug: string; name: string; tagline: string;
  category: string; pricesgd: number; pricingModel: string; installs: number;
  developer?: string; verified?: boolean;
};

const CAT_META: Record<string, { color: string; emoji: string }> = {
  TAX:        { color: 'border-blue-500/30 bg-blue-500/10 text-blue-300',       emoji: '🧾' },
  PAYROLL:    { color: 'border-purple-500/30 bg-purple-500/10 text-purple-300', emoji: '💼' },
  CASH:       { color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300', emoji: '💰' },
  GOV:        { color: 'border-amber-500/30 bg-amber-500/10 text-amber-300',    emoji: '🏛' },
  WEB3:       { color: 'border-pink-500/30 bg-pink-500/10 text-pink-300',       emoji: '🪙' },
  ANALYTICS:  { color: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',       emoji: '📊' },
  INTEGRATION:{ color: 'border-slate-500/30 bg-slate-500/10 text-slate-300',    emoji: '🔌' },
  AI:         { color: 'border-rose-500/30 bg-rose-500/10 text-rose-300',       emoji: '🤖' },
};

export function MarketView({ apps }: { apps: App[] }) {
  const { t } = useI18n();
  const [filter, setFilter] = useState<string>('ALL');
  const cats = Array.from(new Set(apps.map((a) => a.category)));
  const filtered = filter === 'ALL' ? apps : apps.filter((a) => a.category === filter);

  const totalInstalls = apps.reduce((s, a) => s + (a.installs || 0), 0);
  const totalGmv      = apps.reduce((s, a) => s + (a.installs || 0) * (a.pricesgd || 0), 0);

  return (
    <div className="space-y-5">
      {/* Header stats */}
      <section className="grid gap-3 md:grid-cols-4">
        <Stat label={t('market.stat.appsLabel')}     value={String(apps.length)}                         hint={t('market.stat.appsHint2')} />
        <Stat label={t('market.stat.installsLabel')} value={totalInstalls.toLocaleString()}              hint={t('market.stat.installsHint2')} />
        <Stat label={t('market.stat.gmvLabel')}      value={`SGD ${(totalGmv / 1000).toFixed(1)}k`}      hint={t('market.stat.gmvHint2')}       accent="text-emerald-300" />
        <Stat label={t('market.stat.shareLabel')}    value="70 / 30"                                     hint={t('market.stat.shareHint2')}     accent="text-gold-400" />
      </section>

      {/* Strategy banner */}
      <section className="rounded-2xl border border-gold-500/30 bg-gradient-to-r from-gold-500/10 via-ink-900/50 to-ink-900/50 p-4">
        <div className="flex items-start gap-3">
          <span className="text-3xl">🛒</span>
          <div>
            <div className="font-semibold text-gold-400">{t('market.banner.title2')}</div>
            <div className="mt-1 text-[12px] text-slate-300">
              {t('market.banner.body2')}
              <span className="text-gold-300"> {t('market.banner.body3')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <FilterChip active={filter === 'ALL'} onClick={() => setFilter('ALL')}>
          {t('market.filter.allCount', { n: apps.length })}
        </FilterChip>
        {cats.map((c) => {
          const meta = CAT_META[c] || { color: 'border-white/10 bg-white/5 text-slate-300', emoji: '🧩' };
          const count = apps.filter((a) => a.category === c).length;
          return (
            <FilterChip key={c} active={filter === c} onClick={() => setFilter(c)}>
              {meta.emoji} {c} · {count}
            </FilterChip>
          );
        })}
      </div>

      {/* App grid */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a) => {
          const meta = CAT_META[a.category] || { color: 'border-white/10 bg-white/5 text-slate-300', emoji: '🧩' };
          return (
            <div key={a.id} className="rounded-2xl border border-white/10 bg-ink-900/50 p-4 transition hover:border-white/20">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-nova-500/20 to-nova-700/20 text-2xl">
                  {meta.emoji}
                </div>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] ${meta.color}`}>{a.category}</span>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                <div className="text-base font-semibold text-white">{a.name}</div>
                {a.verified && <span className="text-nova-400">✓</span>}
              </div>
              <div className="mt-1 text-[12px] text-slate-400 line-clamp-2">{a.tagline}</div>
              <div className="mt-2 text-[11px] text-slate-500">
                {t('market.byDevFmt', { dev: a.developer || t('market.devFallback') })}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                <div>
                  <div className="text-[10px] text-slate-500">{a.pricingModel}</div>
                  <div className="text-sm font-semibold text-gold-400">
                    {a.pricesgd === 0 ? t('market.freeLabel') : `SGD ${a.pricesgd}`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-500">{t('market.installsLabel')}</div>
                  <div className="text-sm font-mono text-slate-200">{a.installs.toLocaleString()}</div>
                </div>
                <button className="nova-btn-primary text-xs">{t('market.installLabel')}</button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-500">
            {t('market.empty2')}
          </div>
        )}
      </div>

      {/* Developer CTA */}
      <section className="rounded-2xl border border-white/10 bg-gradient-to-r from-nova-900/40 to-ink-900/50 p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="text-sm font-semibold text-white">{t('market.dev.title2')}</div>
            <div className="mt-1 text-[12px] text-slate-300">
              {t('market.dev.body2')}
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button className="nova-btn-outline text-xs">{t('market.dev.docs2')}</button>
            <button className="nova-btn-primary text-xs">{t('market.dev.submit2')}</button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, hint, accent }: { label: string; value: string; hint?: string; accent?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-ink-900/50 p-4">
      <div className="text-[11px] text-slate-400">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${accent || 'text-white'}`}>{value}</div>
      {hint && <div className="mt-0.5 text-[11px] text-slate-500">{hint}</div>}
    </div>
  );
}

function FilterChip({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs transition ${
        active ? 'border-nova-400 bg-nova-500/15 text-white' : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
      }`}
    >
      {children}
    </button>
  );
}
