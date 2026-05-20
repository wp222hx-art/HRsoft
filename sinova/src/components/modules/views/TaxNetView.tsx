'use client';
import { fmtDate, formatMoney, relativeDays } from '@/lib/utils';
import { JURISDICTION_META, type Jurisdiction } from '@/lib/enums';

const STATUS_COLORS: Record<string, string> = {
  COLLECTING: 'bg-nova-500/20 text-nova-300',
  FILING:     'bg-amber-500/20 text-amber-300',
  FILED:      'bg-emerald-500/20 text-emerald-300',
  EXCEPTION:  'bg-red-500/20 text-red-300',
};

const REGIME_LABELS: Record<string, { name: string; flag: string }> = {
  SG_GST:       { name: 'SG GST 9%',     flag: '🇸🇬' },
  HK_NONE:      { name: 'HK · 无 GST',   flag: '🇭🇰' },
  UK_VAT:       { name: 'UK VAT 20%',    flag: '🇬🇧' },
  EU_OSS:       { name: 'EU OSS',        flag: '🇪🇺' },
  US_SALES_TAX: { name: 'US Sales Tax',  flag: '🇺🇸' },
  AU_GST:       { name: 'AU GST 10%',    flag: '🇦🇺' },
  MY_SST:       { name: 'MY SST 6%',     flag: '🇲🇾' },
  AE_VAT:       { name: 'AE VAT 5%',     flag: '🇦🇪' },
  DST:          { name: 'Digital Services Tax', flag: '🌐' },
};

export function TaxNetView({ vats }: any) {
  const totalNet  = vats.reduce((s: number, v: any) => s + v.netPayable, 0);
  const exceptions = vats.reduce((s: number, v: any) => s + v.exceptions, 0);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-4">
        <Stat label="跟踪申报"    value={String(vats.length)} accent="text-nova-300" />
        <Stat label="净税款合计"  value={formatMoney(totalNet)} accent="text-amber-300" />
        <Stat label="检出异常"    value={String(exceptions)} accent="text-red-300" />
        <Stat label="覆盖税制"    value="9 种" accent="" />
      </div>

      {/* World map style strip */}
      <div className="rounded-2xl border border-white/10 bg-ink-900/50 p-4">
        <div className="mb-3 font-semibold">🌐 税务地图 · 各税制实时合规状态</div>
        <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-5">
          {Object.entries(REGIME_LABELS).map(([code, m]) => {
            const found = vats.filter((v: any) => v.regime === code);
            const exception = found.some((v: any) => v.status === 'EXCEPTION');
            const filing = found.some((v: any) => v.status === 'FILING');
            return (
              <div key={code} className={`rounded-xl border p-3 ${
                exception ? 'border-red-500/40 bg-red-500/5'
                : filing ? 'border-amber-500/40 bg-amber-500/5'
                : 'border-white/10 bg-white/[0.02]'}`}>
                <div className="flex items-center justify-between">
                  <span>{m.flag} {m.name}</span>
                  <span className="text-xs text-slate-400">{found.length}</span>
                </div>
                <div className="mt-1 text-[11px] text-slate-500">
                  {exception ? '⚠️ 检测到异常' : filing ? '📝 申报中' : '✓ 正常'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-ink-900/50">
        <div className="border-b border-white/5 px-4 py-3 font-semibold">📋 间接税申报清单</div>
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-widest text-slate-400">
            <tr>
              <th className="px-4 py-2 text-left">客户</th>
              <th className="px-4 py-2 text-left">税制</th>
              <th className="px-4 py-2 text-left">期间</th>
              <th className="px-4 py-2 text-right">销项</th>
              <th className="px-4 py-2 text-right">进项</th>
              <th className="px-4 py-2 text-right">净应缴</th>
              <th className="px-4 py-2 text-left">截止</th>
              <th className="px-4 py-2 text-left">状态</th>
            </tr>
          </thead>
          <tbody>
            {vats.map((v: any) => {
              const m = REGIME_LABELS[v.regime] || { name: v.regime, flag: '·' };
              return (
                <tr key={v.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3">{v.entity?.legalName}</td>
                  <td className="px-4 py-3">{m.flag} {m.name}</td>
                  <td className="px-4 py-3 font-mono text-slate-300">{v.period}</td>
                  <td className="px-4 py-3 text-right font-mono">{formatMoney(v.outputTax)}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-400">{formatMoney(v.inputTax)}</td>
                  <td className="px-4 py-3 text-right font-mono text-amber-300">{formatMoney(v.netPayable)}</td>
                  <td className="px-4 py-3 text-xs"><div>{fmtDate(v.dueDate)}</div><div className="text-slate-500">{relativeDays(v.dueDate)}</div></td>
                  <td className="px-4 py-3">
                    <span className={`nova-chip ${STATUS_COLORS[v.status]}`}>{v.status}</span>
                    {v.exceptions > 0 && <div className="mt-1 text-[10px] text-red-300">⚠️ {v.exceptions} 笔异常</div>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-200">
        <div className="font-semibold">💡 vs Copi 超越点</div>
        <div className="mt-1 text-slate-300">
          Copi AI.GST 仅 SG。SiNova TaxNet 是全球间接税统一引擎,覆盖 9 种税制 (SG GST/UK VAT/EU OSS/US Sales Tax/AU GST/
          MY SST/AE VAT/DST),每笔交易经过"国别识别 → 税率匹配 → 征收主体校验 → 申报排程"自动核验。跨境电商 + SaaS 出海必备。
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
