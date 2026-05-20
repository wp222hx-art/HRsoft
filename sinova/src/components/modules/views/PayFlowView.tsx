'use client';
import { fmtDate, formatMoney } from '@/lib/utils';
import { JURISDICTION_META, type Jurisdiction } from '@/lib/enums';

const ESOP_COLOR: Record<string, string> = {
  GRANTED:     'bg-slate-500/20 text-slate-300',
  VESTING:     'bg-nova-500/20 text-nova-300',
  EXERCISABLE: 'bg-emerald-500/20 text-emerald-300',
  EXERCISED:   'bg-blue-500/20 text-blue-300',
  TAXED:       'bg-amber-500/20 text-amber-300',
};

export function PayFlowView({ runs, esops }: any) {
  const totalGross = runs.reduce((s: number, r: any) => s + r.grossTotal, 0);
  const totalNet   = runs.reduce((s: number, r: any) => s + r.netTotal,   0);
  const totalCpf   = runs.reduce((s: number, r: any) => s + r.cpfTotal,   0);
  const totalHead  = runs.reduce((s: number, r: any) => s + r.headcount,  0);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-4">
        <Stat label="总员工"  value={String(totalHead)}      accent="text-nova-300" />
        <Stat label="本期总薪酬" value={formatMoney(totalGross)} accent="text-slate-100" />
        <Stat label="社保 / CPF" value={formatMoney(totalCpf)}   accent="text-amber-300" />
        <Stat label="净支出"   value={formatMoney(totalNet)}   accent="text-emerald-300" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-ink-900/50">
          <div className="border-b border-white/5 px-4 py-3 font-semibold">📅 发薪日历</div>
          <div className="divide-y divide-white/5">
            {runs.map((r: any) => {
              const j = JURISDICTION_META[r.jurisdiction as Jurisdiction];
              return (
                <div key={r.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div>
                    <div className="font-medium">{r.entity?.legalName}</div>
                    <div className="text-xs text-slate-400">{r.period} · {j?.flag} {j?.name} · {r.headcount} 人</div>
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
          <div className="border-b border-white/5 px-4 py-3 font-semibold">📈 期权 ESOP 时间轴 (Copi 不做)</div>
          <div className="divide-y divide-white/5">
            {esops.map((g: any) => (
              <div key={g.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <div>
                  <div className="font-medium">{g.employee}</div>
                  <div className="text-xs text-slate-400">
                    {g.shares.toLocaleString()} 股 · 行权价 ${g.strike} · {g.vestMonths}m vesting · {fmtDate(g.vestStart)}
                  </div>
                </div>
                <span className={`nova-chip ${ESOP_COLOR[g.status]}`}>{g.status}</span>
              </div>
            ))}
            {esops.length === 0 && <div className="px-4 py-6 text-center text-sm text-slate-400">暂无 ESOP 记录</div>}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-200">
        <div className="font-semibold">💡 vs Copi 超越点</div>
        <div className="mt-1 text-slate-300">
          Copi AI.Payroll 只算钱、只 SG。SiNova 叠加: 期权全生命周期 (Granted → Vesting → Exercisable → Exercised → Taxed)、
          福利点管理、工时打卡集成 (Deel/Rippling/钉钉)、5 国劳动法引擎。从"发薪工具"升级为"人力资本管理中枢"。
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
