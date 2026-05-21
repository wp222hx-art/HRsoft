'use client';
// Insight — k-anonymity data products. Second growth curve.
import { useState } from 'react';
import { formatMoney } from '@/lib/utils';
import { useI18n } from '@/i18n/client';
import { HelperHint } from '../HelperHint';
import { useDemoToast } from '../useDemoToast';

type Report = {
  id: string; slug: string; title: string; tagline: string;
  category: string; pricesgd: number; sampleSize: number; updatedAt: string;
};

export function InsightView({ reports, stats }: { reports: Report[]; stats: { entityCount: number; filingCount: number } }) {
  const { t } = useI18n();
  const toast = useDemoToast();
  const [eps, setEps]   = useState(1.0);
  const [k, setK]       = useState(10);

  // simulate Laplace-noised stat
  const laplace = (mean: number, scale: number) => {
    const u = Math.random() - 0.5;
    return Math.round(mean - scale * Math.sign(u) * Math.log(1 - 2 * Math.abs(u)));
  };
  const simulatedAvg = 14233;
  const noisy = laplace(simulatedAvg, 1 / eps * 30);
  const epsStr = eps.toFixed(2);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-end">
        <HelperHint id="insight.overview" />
      </div>
      {/* Strategy banner */}
      <section className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 via-ink-900/50 to-ink-900/50 p-5">
        <div className="flex items-start gap-3">
          <span className="text-3xl">📊</span>
          <div>
            <div className="font-semibold text-cyan-300">{t('insight.banner.title2')}</div>
            <div className="mt-1 text-[12px] text-slate-300">
              <span className="text-cyan-300">{t('insight.banner.softw')}</span> + <span className="text-emerald-300">{t('insight.banner.data')}</span> ·{' '}
              {t('insight.banner.body2')}
            </div>
          </div>
        </div>
      </section>

      {/* Privacy budget controls */}
      <section className="rounded-2xl border border-white/10 bg-ink-900/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold">{t('insight.budget.title2')}</div>
            <HelperHint id="insight.budget" />
          </div>
          <span className="text-[11px] text-slate-400">
            {t('insight.budget.source2', { e: stats.entityCount, f: stats.filingCount.toLocaleString() })}
          </span>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <div className="flex justify-between text-xs">
              <span className="font-medium text-white">{t('insight.budget.kLabel')}</span>
              <span className="font-mono text-cyan-300">k = {k}</span>
            </div>
            <div className="mt-1 text-[10px] text-slate-500">{t('insight.budget.kHint2')}</div>
            <input type="range" min={2} max={50} value={k} onChange={(e) => setK(Number(e.target.value))} className="mt-2 w-full accent-cyan-500" />
          </div>
          <div>
            <div className="flex justify-between text-xs">
              <span className="font-medium text-white">{t('insight.budget.epsLabel')}</span>
              <span className="font-mono text-emerald-300">ε = {epsStr}</span>
            </div>
            <div className="mt-1 text-[10px] text-slate-500">{t('insight.budget.epsHint2')}</div>
            <input type="range" min={0.1} max={5} step={0.1} value={eps} onChange={(e) => setEps(Number(e.target.value))} className="mt-2 w-full accent-emerald-500" />
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Mini label={t('insight.budget.realLabel')} v={`SGD ${simulatedAvg.toLocaleString()}`} hint={t('insight.budget.realHint2')} gray />
          <Mini
            label={t('insight.budget.noisyLabelFmt', { eps: epsStr })}
            v={`SGD ${noisy.toLocaleString()}`}
            hint={t('insight.budget.noisyHint2')}
            accent="text-cyan-300"
          />
          <Mini
            label={t('insight.budget.releaseLabel')}
            v={k <= 10 ? t('insight.budget.passed2') : t('insight.budget.belowK2', { k })}
            hint={k <= 10 ? t('insight.budget.canPub2') : t('insight.budget.needMore2')}
            accent={k <= 10 ? 'text-emerald-300' : 'text-amber-300'}
          />
        </div>
      </section>

      {/* Report grid */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold">{t('insight.reports.titleFmt', { n: reports.length })}</div>
          <button
            className="nova-btn-outline text-xs"
            onClick={() => toast(t('insight.toast.apiApplied'), 'info')}
          >
            {t('insight.reports.applyApi')}
          </button>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((r) => (
            <div key={r.id} className="flex flex-col rounded-2xl border border-white/10 bg-ink-900/50 p-4">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 text-2xl">
                  📈
                </div>
                <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-300">
                  {r.category}
                </span>
              </div>
              <div className="mt-3 text-base font-semibold text-white">{r.title}</div>
              <div className="mt-1 flex-1 text-[12px] text-slate-400">{r.tagline}</div>
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/5 pt-3 text-[11px]">
                <div>
                  <div className="text-slate-500">{t('insight.reports.sampleLabel')}</div>
                  <div className="font-mono text-slate-200">{t('insight.reports.sampleN', { n: r.sampleSize.toLocaleString() })}</div>
                </div>
                <div>
                  <div className="text-slate-500">{t('insight.reports.priceLabel')}</div>
                  <div className="font-semibold text-gold-400">{r.pricesgd === 0 ? 'Free' : formatMoney(r.pricesgd)}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button
                  className="nova-btn-primary flex-1 text-xs"
                  onClick={() => toast(t('insight.toast.buyReport', { title: r.title }), 'success')}
                >
                  {t('insight.reports.buyPdf2')}
                </button>
                <button
                  className="nova-btn-outline text-xs"
                  onClick={() => toast(t('insight.toast.apiAccess', { title: r.title }), 'info')}
                >
                  {t('insight.api')}
                </button>
              </div>
            </div>
          ))}
        </div>
        {reports.length === 0 && (
          <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-500">
            {t('insight.reports.empty2')}
          </div>
        )}
      </section>

      {/* Token incentive */}
      <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4">
        <div className="flex items-start gap-3">
          <span className="text-3xl">🎁</span>
          <div>
            <div className="font-semibold text-emerald-300">{t('insight.reward.title2')}</div>
            <div className="mt-1 text-[12px] text-slate-300">
              {t('insight.reward.body2')}
            </div>
          </div>
          <button
            className="nova-btn-primary text-xs"
            onClick={() => toast(t('insight.toast.share'), 'success')}
          >
            {t('insight.reward.cta2')}
          </button>
        </div>
      </section>
    </div>
  );
}

function Mini({ label, v, hint, accent, gray }: { label: string; v: string; hint?: string; accent?: string; gray?: boolean }) {
  return (
    <div className={`rounded-xl border border-white/5 p-3 ${gray ? 'bg-white/5' : 'bg-ink-950/60'}`}>
      <div className="text-[11px] text-slate-400">{label}</div>
      <div className={`mt-1 text-lg font-bold ${accent || 'text-white'}`}>{v}</div>
      {hint && <div className="mt-0.5 text-[10px] text-slate-500">{hint}</div>}
    </div>
  );
}
