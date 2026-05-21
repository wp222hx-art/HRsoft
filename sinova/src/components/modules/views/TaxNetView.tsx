'use client';
import { fmtDate, formatMoney, relativeDays } from '@/lib/utils';
import { useI18n } from '@/i18n/client';

const STATUS_COLORS: Record<string, string> = {
  COLLECTING: 'bg-nova-500/20 text-nova-300',
  FILING:     'bg-amber-500/20 text-amber-300',
  FILED:      'bg-emerald-500/20 text-emerald-300',
  EXCEPTION:  'bg-red-500/20 text-red-300',
};

const REGIME_FLAGS: Record<string, string> = {
  SG_GST: '🇸🇬', HK_NONE: '🇭🇰', UK_VAT: '🇬🇧', EU_OSS: '🇪🇺',
  US_SALES_TAX: '🇺🇸', AU_GST: '🇦🇺', MY_SST: '🇲🇾', AE_VAT: '🇦🇪', DST: '🌐',
};
const REGIME_CODES = Object.keys(REGIME_FLAGS);

export function TaxNetView({ vats }: any) {
  const { t } = useI18n();
  const totalNet  = vats.reduce((s: number, v: any) => s + v.netPayable, 0);
  const exceptions = vats.reduce((s: number, v: any) => s + v.exceptions, 0);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-4">
        <Stat label={t('taxnet.stat.tracking')}   value={String(vats.length)}      accent="text-nova-300" />
        <Stat label={t('taxnet.stat.netTax')}     value={formatMoney(totalNet)}    accent="text-amber-300" />
        <Stat label={t('taxnet.stat.exceptions')} value={String(exceptions)}       accent="text-red-300" />
        <Stat label={t('taxnet.stat.regimes')}    value={t('taxnet.stat.regimeCount')} accent="" />
      </div>

      {/* World map style strip */}
      <div className="rounded-2xl border border-white/10 bg-ink-900/50 p-4">
        <div className="mb-3 font-semibold">{t('taxnet.map.title2')}</div>
        <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-5">
          {REGIME_CODES.map((code) => {
            const flag = REGIME_FLAGS[code];
            const found = vats.filter((v: any) => v.regime === code);
            const exception = found.some((v: any) => v.status === 'EXCEPTION');
            const filing = found.some((v: any) => v.status === 'FILING');
            return (
              <div key={code} className={`rounded-xl border p-3 ${
                exception ? 'border-red-500/40 bg-red-500/5'
                : filing ? 'border-amber-500/40 bg-amber-500/5'
                : 'border-white/10 bg-white/[0.02]'}`}>
                <div className="flex items-center justify-between">
                  <span>{flag} {t(`taxnet.regime.${code}`)}</span>
                  <span className="text-xs text-slate-400">{found.length}</span>
                </div>
                <div className="mt-1 text-[11px] text-slate-500">
                  {exception ? t('taxnet.regime.exception') : filing ? t('taxnet.regime.filing') : t('taxnet.regime.normal')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-ink-900/50">
        <div className="border-b border-white/5 px-4 py-3 font-semibold">{t('taxnet.list.title')}</div>
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-widest text-slate-400">
            <tr>
              <th className="px-4 py-2 text-left">{t('taxnet.col.client')}</th>
              <th className="px-4 py-2 text-left">{t('taxnet.col.regime')}</th>
              <th className="px-4 py-2 text-left">{t('taxnet.col.period')}</th>
              <th className="px-4 py-2 text-right">{t('taxnet.col.output')}</th>
              <th className="px-4 py-2 text-right">{t('taxnet.col.input')}</th>
              <th className="px-4 py-2 text-right">{t('taxnet.col.netDue')}</th>
              <th className="px-4 py-2 text-left">{t('taxshield.col.due')}</th>
              <th className="px-4 py-2 text-left">{t('taxshield.col.status')}</th>
            </tr>
          </thead>
          <tbody>
            {vats.map((v: any) => {
              const flag = REGIME_FLAGS[v.regime] || '·';
              return (
                <tr key={v.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3">{v.entity?.legalName}</td>
                  <td className="px-4 py-3">{flag} {t(`taxnet.regime.${v.regime}`)}</td>
                  <td className="px-4 py-3 font-mono text-slate-300">{v.period}</td>
                  <td className="px-4 py-3 text-right font-mono">{formatMoney(v.outputTax)}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-400">{formatMoney(v.inputTax)}</td>
                  <td className="px-4 py-3 text-right font-mono text-amber-300">{formatMoney(v.netPayable)}</td>
                  <td className="px-4 py-3 text-xs"><div>{fmtDate(v.dueDate)}</div><div className="text-slate-500">{relativeDays(v.dueDate)}</div></td>
                  <td className="px-4 py-3">
                    <span className={`nova-chip ${STATUS_COLORS[v.status]}`}>{v.status}</span>
                    {v.exceptions > 0 && <div className="mt-1 text-[10px] text-red-300">{t('taxnet.col.exceptionsN', { n: v.exceptions })}</div>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-200">
        <div className="font-semibold">{t('taxnet.versus.title')}</div>
        <div className="mt-1 text-slate-300">
          {t('taxnet.versus.body')}
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
