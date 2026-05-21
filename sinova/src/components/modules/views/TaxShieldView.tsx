'use client';
import { JURISDICTION_META, type Jurisdiction } from '@/lib/enums';
import { fmtDate, formatMoney, relativeDays } from '@/lib/utils';
import { useI18n } from '@/i18n/client';
import { HelperHint } from '../HelperHint';
import { useDemoToast } from '../useDemoToast';

const STATUS_COLORS: Record<string, string> = {
  DRAFT:         'bg-slate-500/20 text-slate-300',
  AI_REVIEWING:  'bg-nova-500/20 text-nova-300',
  PENDING_HUMAN: 'bg-amber-500/20 text-amber-300',
  APPROVED:      'bg-emerald-500/20 text-emerald-300',
  SUBMITTED:     'bg-blue-500/20 text-blue-300',
  FILED:         'bg-emerald-500/20 text-emerald-300',
  AUDITED:       'bg-red-500/20 text-red-300',
};

export function TaxShieldView({ filings }: any) {
  const { t } = useI18n();
  const toast = useDemoToast();
  const totalTax = filings.reduce((s: number, f: any) => s + f.taxPayable, 0);
  const totalSaving = filings.filter((f: any) => f.aiSavingHint).reduce((s: number, f: any) => {
    const m = f.aiSavingHint?.match(/(\d{1,3}(?:[,_]?\d{3})+|\d+)/);
    return s + (m ? Number(m[1].replace(/[,_]/g, '')) : 0);
  }, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <HelperHint id="taxshield.overview" />
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <Stat label={t('taxshield.stat.tracking')}    value={String(filings.length)} accent="text-nova-300" />
        <Stat label={t('taxshield.stat.totalTax')}    value={formatMoney(totalTax)}   accent="text-slate-100" />
        <Stat label={t('taxshield.stat.totalSaving')} value={formatMoney(totalSaving)} accent="text-emerald-300" />
        <Stat label={t('taxshield.stat.coverage')}    value="🇸🇬🇭🇰🇺🇸🇬🇧🇦🇪" accent="" />
      </div>

      <div className="rounded-2xl border border-white/10 bg-ink-900/50 overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="font-semibold">{t('taxshield.workbench')}</div>
            <HelperHint id="taxshield.workbench" />
          </div>
          <div className="text-xs text-slate-400">{t('taxshield.workbenchHint')}</div>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-widest text-slate-400">
            <tr>
              <th className="px-4 py-2 text-left">{t('taxshield.col.client')}</th>
              <th className="px-4 py-2 text-left">{t('taxshield.col.juris2')}</th>
              <th className="px-4 py-2 text-right">{t('taxshield.col.taxableIncome')}</th>
              <th className="px-4 py-2 text-right">{t('taxshield.col.tax')}</th>
              <th className="px-4 py-2 text-left">{t('taxshield.col.due')}</th>
              <th className="px-4 py-2 text-left">{t('taxshield.col.status')}</th>
              <th className="px-4 py-2 text-left">{t('taxshield.col.aiHint2')}</th>
            </tr>
          </thead>
          <tbody>
            {filings.map((f: any) => {
              const j = JURISDICTION_META[f.jurisdiction as Jurisdiction];
              return (
                <tr key={f.id}
                    onClick={() => toast(t('taxshield.toast.opened', { name: f.entity?.legalName || '' }))}
                    className="cursor-pointer border-t border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="font-medium">{f.entity?.legalName}</div>
                    <div className="text-xs text-slate-400">{f.formType} · FY{f.taxYear}</div>
                  </td>
                  <td className="px-4 py-3">{j?.flag} {t(`juris.${f.jurisdiction}`)}</td>
                  <td className="px-4 py-3 text-right font-mono">{formatMoney(f.taxableIncome)}</td>
                  <td className="px-4 py-3 text-right font-mono text-amber-300">{formatMoney(f.taxPayable)}</td>
                  <td className="px-4 py-3 text-xs">
                    <div>{fmtDate(f.dueDate)}</div>
                    <div className="text-slate-500">{relativeDays(f.dueDate)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`nova-chip ${STATUS_COLORS[f.status] || ''}`}>{f.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-emerald-300 max-w-xs">
                    {f.aiSavingHint || <span className="text-slate-500">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-200">
        <div className="font-semibold">{t('taxshield.versus.title')}</div>
        <div className="mt-1 text-slate-300">
          {t('taxshield.versus.body')}
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
