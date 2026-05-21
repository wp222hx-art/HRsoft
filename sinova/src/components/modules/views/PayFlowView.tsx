'use client';
import { fmtDate, formatMoney } from '@/lib/utils';
import { JURISDICTION_META, type Jurisdiction } from '@/lib/enums';
import { useI18n } from '@/i18n/client';
import { HelperHint } from '../HelperHint';
import { useDemoToast } from '../useDemoToast';

const ESOP_COLOR: Record<string, string> = {
  GRANTED:     'bg-slate-500/20 text-slate-300',
  VESTING:     'bg-nova-500/20 text-nova-300',
  EXERCISABLE: 'bg-emerald-500/20 text-emerald-300',
  EXERCISED:   'bg-blue-500/20 text-blue-300',
  TAXED:       'bg-amber-500/20 text-amber-300',
};

export function PayFlowView({ runs, esops }: any) {
  const { t } = useI18n();
  const toast = useDemoToast();
  const totalGross = runs.reduce((s: number, r: any) => s + r.grossTotal, 0);
  const totalNet   = runs.reduce((s: number, r: any) => s + r.netTotal,   0);
  const totalCpf   = runs.reduce((s: number, r: any) => s + r.cpfTotal,   0);
  const totalHead  = runs.reduce((s: number, r: any) => s + r.headcount,  0);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <HelperHint id="payflow.overview" />
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <Stat label={t('payflow.stat.heads')} value={String(totalHead)}      accent="text-nova-300" />
        <Stat label={t('payflow.stat.gross')} value={formatMoney(totalGross)} accent="text-slate-100" />
        <Stat label={t('payflow.stat.cpf')}   value={formatMoney(totalCpf)}   accent="text-amber-300" />
        <Stat label={t('payflow.stat.net')}   value={formatMoney(totalNet)}   accent="text-emerald-300" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-ink-900/50">
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="font-semibold">{t('payflow.calendar')}</div>
              <HelperHint id="payflow.calendar" />
            </div>
          </div>
          <div className="divide-y divide-white/5">
            {runs.map((r: any) => {
              const j = JURISDICTION_META[r.jurisdiction as Jurisdiction];
              return (
                <div key={r.id}
                     onClick={() => toast(t('payflow.toast.runOpened', { name: r.entity?.legalName || '', period: r.period }))}
                     className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm hover:bg-white/[0.03]">
                  <div>
                    <div className="font-medium">{r.entity?.legalName}</div>
                    <div className="text-xs text-slate-400">
                      {t('payflow.calRowMeta', { period: r.period, flag: j?.flag || '', juris: t(`juris.${r.jurisdiction}`), n: r.headcount })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-emerald-300">{formatMoney(r.netTotal)}</div>
                    <span className="nova-chip bg-white/5 text-slate-300 ring-white/10 mt-1">{r.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-ink-900/50">
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="font-semibold">{t('payflow.esopBoard')}</div>
              <HelperHint id="payflow.esop" />
            </div>
          </div>
          <div className="divide-y divide-white/5">
            {esops.map((g: any) => (
              <div key={g.id}
                   onClick={() => toast(t('payflow.toast.esopOpened', { name: g.employee, status: g.status }))}
                   className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm hover:bg-white/[0.03]">
                <div>
                  <div className="font-medium">{g.employee}</div>
                  <div className="text-xs text-slate-400">
                    {t('payflow.esopRowMeta', { shares: g.shares.toLocaleString(), strike: g.strike, months: g.vestMonths, start: fmtDate(g.vestStart) })}
                  </div>
                </div>
                <span className={`nova-chip ${ESOP_COLOR[g.status]}`}>{g.status}</span>
              </div>
            ))}
            {esops.length === 0 && <div className="px-4 py-6 text-center text-sm text-slate-400">{t('payflow.esopEmpty')}</div>}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-200">
        <div className="font-semibold">{t('payflow.versus.title')}</div>
        <div className="mt-1 text-slate-300">
          {t('payflow.versus.body')}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
      <div className="text-xs uppercase tracking-widest text-slate-400">{label}</div>
      <div className={`mt-2 text-2xl font-bold ${accent}`}>{value}</div>
    </div>
  );
}
