'use client';
// Radar — #1 killer module. Live 3-slider scoring demo + alert list with token-reward close loop.
import { useState } from 'react';
import { RADAR_LEVEL_META } from '@/lib/enums';
import { fmtDate } from '@/lib/utils';
import { useI18n } from '@/i18n/client';
import { HelperHint } from '../HelperHint';

type Alert = {
  id: string; title: string; status: string; level: string;
  composite: number; scoreHistory: number; scoreBenchmark: number; scoreReg: number;
  daysAhead: number; createdAt: string;
  entity?: { legalName: string; jurisdiction: string };
};

export function RadarView({ alerts: initial }: { alerts: Alert[] }) {
  const { t } = useI18n();
  const [alerts, setAlerts] = useState<Alert[]>(initial);
  // ── Live scoring demo state ──
  const [hist, setHist] = useState(72);
  const [bench, setBench] = useState(65);
  const [reg, setReg] = useState(58);
  const [scored, setScored] = useState<{ composite: number; level: string; daysAhead: number; actions: string[] } | null>(null);
  const [scoring, setScoring] = useState(false);
  const [closing, setClosing] = useState<string | null>(null);

  async function recompute() {
    setScoring(true);
    try {
      const r = await fetch('/api/radar/score', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ scoreHistory: hist, scoreBenchmark: bench, scoreReg: reg }),
      });
      setScored(await r.json());
    } finally { setScoring(false); }
  }

  async function closeAlert(id: string) {
    setClosing(id);
    try {
      const r = await fetch(`/api/radar/${id}/close`, { method: 'POST' });
      if (r.ok) {
        const j = await r.json();
        setAlerts((cur) => cur.map((a) => a.id === id ? { ...a, status: 'CLOSED' } : a));
        if (typeof window !== 'undefined') {
          (window as any).__novaToast?.(t('radar.toastFmt', { n: j.tokens || 0 }));
          alert(t('radar.alertFmt', { n: j.tokens || 0 }));
        }
      }
    } finally { setClosing(null); }
  }

  // Group by level
  const byLevel: Record<string, Alert[]> = { CRITICAL: [], ALERT: [], WATCH: [], HEALTHY: [] };
  alerts.filter((a) => a.status !== 'CLOSED').forEach((a) => {
    (byLevel[a.level] ||= []).push(a);
  });

  const levelMeta = RADAR_LEVEL_META[(scored?.level as any) || 'HEALTHY'];
  const levelLabel = (lv: string) => t(`radar.level.${lv}`);

  return (
    <div className="space-y-5">
      {/* ── Live 3-dimension scoring demo ── */}
      <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-nova-900/40 via-ink-950 to-ink-950 p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="text-sm font-semibold">{t('radar.section.score')}</div>
              <HelperHint id="radar.score" />
            </div>
            <div className="text-[11px] text-slate-400">
              {t('radar.section.scoreFormula')}<span className="font-mono text-slate-300">composite = history × 0.4 + benchmark × 0.3 + regulatory × 0.3</span>
            </div>
          </div>
          <button onClick={recompute} disabled={scoring} className="nova-btn-primary text-xs">
            {scoring ? t('common.scoring') : t('radar.btn.recompute')}
          </button>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {/* Sliders */}
          <div className="space-y-4">
            <Slider label={t('radar.dim.history')}   weight={t('radar.weight40')} hint={t('radar.dim.history.hint')}   value={hist} setValue={setHist} accent="emerald" />
            <Slider label={t('radar.dim.benchmark')} weight={t('radar.weight30')} hint={t('radar.dim.benchmark.hint')} value={bench} setValue={setBench} accent="cyan" />
            <Slider label={t('radar.dim.reg')}       weight={t('radar.weight30')} hint={t('radar.dim.reg.hint')}       value={reg} setValue={setReg} accent="amber" />
          </div>

          {/* Radar visual + result */}
          <div className="relative rounded-xl border border-white/5 bg-ink-950 p-4">
            <div className="relative flex h-56 items-center justify-center">
              <div className={`radar-ring h-44 w-44 rounded-full border-2 ${levelMeta.ring}`} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-[11px] text-slate-500">{t('radar.composite2')}</div>
                <div className={`text-5xl font-black ${levelMeta.color}`}>
                  {scored?.composite ?? '—'}
                </div>
                <div className={`mt-1 rounded-full px-3 py-0.5 text-xs ${levelMeta.bg} ${levelMeta.color}`}>
                  {levelMeta.emoji} {levelLabel(scored?.level || 'HEALTHY')} · {t('radar.aheadDays2', { n: scored?.daysAhead ?? 0 })}
                </div>
              </div>
            </div>
            {scored?.actions && scored.actions.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {scored.actions.map((a, i) => (
                  <span key={i} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-slate-300">{a}</span>
                ))}
              </div>
            )}
            {!scored && (
              <div className="mt-3 text-center text-[11px] text-slate-500">{t('radar.dragHint')}</div>
            )}
          </div>
        </div>
      </section>

      {/* ── Active alerts grouped by level ── */}
      <section className="rounded-2xl border border-white/10 bg-ink-900/50">
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="font-semibold">{t('radar.alerts.title')}</div>
              <HelperHint id="radar.alerts" />
            </div>
            <div className="text-[11px] text-slate-400">{t('radar.alerts.hint')}</div>
          </div>
          <div className="text-xs text-slate-500">
            {t('radar.alerts.totalOpen', { n: alerts.filter((a) => a.status !== 'CLOSED').length })}
          </div>
        </div>

        <div className="space-y-4 p-4">
          {(['CRITICAL', 'ALERT', 'WATCH', 'HEALTHY'] as const).map((lv) => {
            const list = byLevel[lv] || [];
            if (list.length === 0) return null;
            const meta = RADAR_LEVEL_META[lv];
            return (
              <div key={lv}>
                <div className="mb-2 flex items-center gap-2 text-xs">
                  <span className={`rounded-full px-2 py-0.5 ${meta.bg} ${meta.color}`}>{meta.emoji} {levelLabel(lv)}</span>
                  <span className="text-slate-500">{t('radar.alerts.aheadOf')} {meta.ahead} · {t('radar.alerts.count', { n: list.length })}</span>
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  {list.map((a) => (
                    <div key={a.id} className={`rounded-xl border p-3 text-sm ${meta.bg} border-white/5 ring-1 ${meta.ring}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-3">
                          <div className="font-medium text-white">{a.title}</div>
                          <div className="mt-0.5 text-[11px] text-slate-400">
                            {t('radar.alertCardLine', { entity: a.entity?.legalName || '—', juris: a.entity?.jurisdiction ? t(`juris.${a.entity.jurisdiction}`) : '—', date: fmtDate(a.createdAt) })}
                          </div>
                        </div>
                        <div className={`text-2xl font-black ${meta.color}`}>{a.composite}</div>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-1 text-[10px] text-slate-400">
                        <Bar label={t('radar.dim.short.history')}   v={a.scoreHistory} />
                        <Bar label={t('radar.dim.short.benchmark')} v={a.scoreBenchmark} />
                        <Bar label={t('radar.dim.short.reg')}       v={a.scoreReg} />
                      </div>
                      <div className="mt-2 flex justify-end">
                        <button
                          onClick={() => closeAlert(a.id)}
                          disabled={closing === a.id}
                          className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white hover:bg-white/10 disabled:opacity-50"
                        >
                          {closing === a.id ? t('common.closing') : t('radar.alerts.close')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {alerts.filter((a) => a.status !== 'CLOSED').length === 0 && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 text-center text-sm text-emerald-300">
              {t('radar.alerts.allClear')}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Slider({ label, weight, hint, value, setValue, accent }: {
  label: string; weight: string; hint: string; value: number; setValue: (n: number) => void; accent: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <div>
          <span className="font-medium text-white">{label}</span>
          <span className="ml-2 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-slate-400">{weight}</span>
        </div>
        <span className={`font-mono text-${accent}-300`}>{value}</span>
      </div>
      <div className="mt-1 text-[10px] text-slate-500">{hint}</div>
      <input
        type="range" min={0} max={100} value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="mt-2 w-full accent-nova-500"
      />
    </div>
  );
}

function Bar({ label, v }: { label: string; v: number }) {
  return (
    <div>
      <div className="flex justify-between"><span>{label}</span><span>{v}</span></div>
      <div className="mt-0.5 h-1 rounded-full bg-white/10 overflow-hidden">
        <div className="h-1 bg-white/40" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}
