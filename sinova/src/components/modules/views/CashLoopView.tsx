'use client';
// CashLoop — AR + AP dual closed-loop. The flagship "Copi 缺口" module.
import { fmtDate, formatMoney, relativeDays } from '@/lib/utils';
import { useI18n } from '@/i18n/client';
import { HelperHint } from '../HelperHint';
import { useDemoToast } from '../useDemoToast';

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
  const { t } = useI18n();
  const toast = useDemoToast();
  const arOpen      = invoices.filter((i: any) => !['COLLECTED','BAD_DEBT'].includes(i.status));
  const arOverdue   = invoices.filter((i: any) => i.status === 'OVERDUE');
  const arInflow    = arOpen.reduce((s: number, i: any) => s + i.amount, 0);
  const arOverdueAmt= arOverdue.reduce((s: number, i: any) => s + i.amount, 0);
  const apOpen      = bills.filter((b: any) => !['PAID','REJECTED'].includes(b.status));
  const apOutflow   = apOpen.reduce((s: number, b: any) => s + b.amount, 0);
  const net         = arInflow - apOutflow;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <HelperHint id="cashloop.overview" />
      </div>

      {/* Cash dashboard */}
      <div className="grid gap-3 md:grid-cols-4">
        <Stat label={t('cashloop.stat.arOpen')}    value={formatMoney(arInflow)}     accent="text-emerald-300" hint={`${arOpen.length} ${t('cashloop.stat.unsettled')}`} />
        <Stat label={t('cashloop.stat.arOverdue')} value={formatMoney(arOverdueAmt)} accent="text-red-300"     hint={`${arOverdue.length} ${t('cashloop.stat.overdue')}`} />
        <Stat label={t('cashloop.stat.apOpen')}    value={formatMoney(apOutflow)}    accent="text-amber-300"   hint={`${apOpen.length} ${t('cashloop.stat.toApprove')}`} />
        <Stat label={t('cashloop.stat.netCash')}   value={formatMoney(net)}          accent={net >= 0 ? 'text-emerald-300' : 'text-red-300'} hint={t('cashloop.stat.thisCycle')} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* AR */}
        <section className="rounded-2xl border border-white/10 bg-ink-900/50">
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="font-semibold">{t('cashloop.ar.titleFull')}</div>
                <HelperHint id="cashloop.ar" />
              </div>
              <div className="text-[11px] text-slate-400">{t('cashloop.ar.subtitle')}</div>
            </div>
            <button onClick={() => toast(t('cashloop.toast.invoiceCreated'))} className="nova-btn-outline text-xs">{t('cashloop.ar.create')}</button>
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
                  <span>{t('cashloop.dueLine', { date: fmtDate(i.dueDate), rel: relativeDays(i.dueDate) })}</span>
                  <span>{t('cashloop.creditLine', { score: i.customerRiskScore, stage: i.dunningStage })}</span>
                </div>
                {i.status === 'OVERDUE' && (
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => toast(t('cashloop.toast.aiDun', { customer: i.customer }), 'info')}
                      className="rounded-lg bg-nova-500/20 px-2 py-1 text-[11px] text-nova-200 hover:bg-nova-500/30">
                      {t('cashloop.btn.aiDun', { t: ['','0','7','14','30'][i.dunningStage] || '?' })}
                    </button>
                    <button
                      onClick={() => toast(t('cashloop.toast.discount', { invoiceNo: i.invoiceNo }), 'info')}
                      className="rounded-lg bg-gold-500/20 px-2 py-1 text-[11px] text-gold-300 hover:bg-gold-500/30">
                      {t('cashloop.btn.discount')}
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
              <div className="flex items-center gap-2">
                <div className="font-semibold">{t('cashloop.ap.titleFull')}</div>
                <HelperHint id="cashloop.ap" />
              </div>
              <div className="text-[11px] text-slate-400">{t('cashloop.ap.subtitle2')}</div>
            </div>
            <button onClick={() => toast(t('cashloop.toast.billUploaded'), 'info')} className="nova-btn-outline text-xs">{t('cashloop.ap.upload2')}</button>
          </div>
          <div className="divide-y divide-white/5">
            {bills.map((b: any) => (
              <div key={b.id} className="px-4 py-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{b.vendor}</div>
                  <span className={`nova-chip ${BILL_COLOR[b.status]}`}>{b.status}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{t('cashloop.dueLine', { date: fmtDate(b.dueDate), rel: relativeDays(b.dueDate) })}</span>
                  <span className="font-mono text-slate-200">
                    {b.currency} {b.amount.toLocaleString()}
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-slate-500">{t('cashloop.ocr', { n: (b.ocrConfidence * 100).toFixed(0) })}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="rounded-2xl border border-gold-500/30 bg-gradient-to-br from-gold-500/10 to-transparent p-5">
        <div className="font-semibold text-gold-300">{t('cashloop.diff.title')}</div>
        <div className="mt-2 text-sm text-slate-300">
          {t('cashloop.diff.body1')} <strong className="text-white">{t('cashloop.diff.body2')}</strong>{t('cashloop.diff.body3')}
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
