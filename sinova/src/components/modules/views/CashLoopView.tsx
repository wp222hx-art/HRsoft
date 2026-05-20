'use client';
// CashLoop — AR + AP dual closed-loop. The flagship "Copi 缺口" module.
import { fmtDate, formatMoney, relativeDays } from '@/lib/utils';

const INV_COLOR: Record<string, string> = {
  DRAFT:     'bg-slate-500/20 text-slate-300',
  ISSUED:    'bg-nova-500/20 text-nova-300',
  SENT:      'bg-blue-500/20 text-blue-300',
  VIEWED:    'bg-cyan-500/20 text-cyan-300',
  OVERDUE:   'bg-red-500/20 text-red-300',
  COLLECTED: 'bg-emerald-500/20 text-emerald-300',
  BAD_DEBT:  'bg-zinc-500/20 text-zinc-300',
};

const BILL_COLOR: Record<string, string> = {
  APPROVAL_PENDING: 'bg-amber-500/20 text-amber-300',
  APPROVED:  'bg-nova-500/20 text-nova-300',
  SCHEDULED: 'bg-cyan-500/20 text-cyan-300',
  PAID:      'bg-emerald-500/20 text-emerald-300',
  REJECTED:  'bg-red-500/20 text-red-300',
};

export function CashLoopView({ invoices, bills }: any) {
  const arOpen      = invoices.filter((i: any) => !['COLLECTED','BAD_DEBT'].includes(i.status));
  const arOverdue   = invoices.filter((i: any) => i.status === 'OVERDUE');
  const arInflow    = arOpen.reduce((s: number, i: any) => s + i.amount, 0);
  const arOverdueAmt= arOverdue.reduce((s: number, i: any) => s + i.amount, 0);
  const apOpen      = bills.filter((b: any) => !['PAID','REJECTED'].includes(b.status));
  const apOutflow   = apOpen.reduce((s: number, b: any) => s + b.amount, 0);
  const net         = arInflow - apOutflow;

  return (
    <div className="space-y-5">
      {/* Cash dashboard */}
      <div className="grid gap-3 md:grid-cols-4">
        <Stat label="AR 应收开放" value={formatMoney(arInflow)} accent="text-emerald-300" hint={`${arOpen.length} 张未结`} />
        <Stat label="AR 逾期金额" value={formatMoney(arOverdueAmt)} accent="text-red-300" hint={`${arOverdue.length} 张逾期`} />
        <Stat label="AP 应付待出" value={formatMoney(apOutflow)} accent="text-amber-300" hint={`${apOpen.length} 张待审`} />
        <Stat label="净现金流"   value={formatMoney(net)}        accent={net >= 0 ? 'text-emerald-300' : 'text-red-300'} hint="本期预测" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* AR */}
        <section className="rounded-2xl border border-white/10 bg-ink-900/50">
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
            <div>
              <div className="font-semibold">📥 AR · 应收账款 (Copi 缺失)</div>
              <div className="text-[11px] text-slate-400">开票 · 多币种 · 老化 · AI 多语种催收 · 票据贴现</div>
            </div>
            <button className="nova-btn-outline text-xs">+ 新建发票</button>
          </div>
          <div className="divide-y divide-white/5">
            {invoices.map((i: any) => (
              <div key={i.id} className="px-4 py-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{i.invoiceNo}</div>
                  <span className={`nova-chip ${INV_COLOR[i.status]}`}>{i.status}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-slate-300">{i.customer}</span>
                  <span className="font-mono text-slate-200">
                    {i.currency} {i.amount.toLocaleString()}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                  <span>截止 {fmtDate(i.dueDate)} · {relativeDays(i.dueDate)}</span>
                  <span>客户信用 {i.customerRiskScore}/100 · Dunning Stage {i.dunningStage}</span>
                </div>
                {i.status === 'OVERDUE' && (
                  <div className="mt-2 flex items-center gap-2">
                    <button className="rounded-lg bg-nova-500/20 px-2 py-1 text-[11px] text-nova-200 hover:bg-nova-500/30">
                      ✉️ AI 催收 (T+{['','0','7','14','30'][i.dunningStage] || '?'})
                    </button>
                    <button className="rounded-lg bg-gold-500/20 px-2 py-1 text-[11px] text-gold-300 hover:bg-gold-500/30">
                      💰 票据贴现
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* AP */}
        <section className="rounded-2xl border border-white/10 bg-ink-900/50">
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
            <div>
              <div className="font-semibold">📤 AP · 应付账款 (永久免费)</div>
              <div className="text-[11px] text-slate-400">OCR · 智能规则 · 审批链 · Airwallex 全球支付</div>
            </div>
            <button className="nova-btn-outline text-xs">+ 上传发票</button>
          </div>
          <div className="divide-y divide-white/5">
            {bills.map((b: any) => (
              <div key={b.id} className="px-4 py-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{b.vendor}</div>
                  <span className={`nova-chip ${BILL_COLOR[b.status]}`}>{b.status}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-slate-400">截止 {fmtDate(b.dueDate)} · {relativeDays(b.dueDate)}</span>
                  <span className="font-mono text-slate-200">
                    {b.currency} {b.amount.toLocaleString()}
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-slate-500">OCR 置信度 {(b.ocrConfidence * 100).toFixed(0)}%</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="rounded-2xl border border-gold-500/30 bg-gradient-to-br from-gold-500/10 to-transparent p-5">
        <div className="font-semibold text-gold-300">🔥 核心差异化 · CashLoop AR + AP 双闭环</div>
        <div className="mt-2 text-sm text-slate-300">
          Copi 只解决"付钱"(AP),不解决"收钱"(AR),但 SME 真正死掉的原因是 <strong className="text-white">收不回钱</strong>。
          SiNova 把 AP (Odoo 模式) + AR (Invoice Ninja 模式) 整合,叠加 AI 多语种催收 (DunnerAI App)、
          票据贴现 (持牌金融机构) 和客户信用评分——直接砍掉 SME 一半的财务焦虑。
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent, hint }: { label: string; value: string; accent: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
      <div className="text-xs uppercase tracking-widest text-slate-400">{label}</div>
      <div className={`mt-2 text-2xl font-bold ${accent}`}>{value}</div>
      {hint && <div className="mt-1 text-xs text-slate-500">{hint}</div>}
    </div>
  );
}
