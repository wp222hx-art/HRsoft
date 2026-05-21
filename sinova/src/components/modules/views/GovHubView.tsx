'use client';
import { fmtDate, relativeDays } from '@/lib/utils';
import { JURISDICTION_META, type Jurisdiction } from '@/lib/enums';
import { useI18n } from '@/i18n/client';
import { HelperHint } from '../HelperHint';
import { useDemoToast } from '../useDemoToast';

const STATUS_COLORS: Record<string, string> = {
  INITIATED:        'bg-slate-500/20 text-slate-300',
  DRAFTED:          'bg-nova-500/20 text-nova-300',
  INTERNAL_APPROVED:'bg-amber-500/20 text-amber-300',
  CLIENT_SIGNED:    'bg-cyan-500/20 text-cyan-300',
  FILED:            'bg-blue-500/20 text-blue-300',
  CONFIRMED:        'bg-emerald-500/20 text-emerald-300',
};

export function GovHubView({ actions, entities }: any) {
  const { t } = useI18n();
  const toast = useDemoToast();
  // Group entities by jurisdiction for the world architecture map
  const byJurisdiction: Record<string, any[]> = {};
  for (const e of entities) {
    (byJurisdiction[e.jurisdiction] ||= []).push(e);
  }

  return (
    <div className="space-y-5">
      {/* Global architecture (tree) */}
      <div className="rounded-2xl border border-white/10 bg-ink-900/50 p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="font-semibold">{t('govhub.tree.title')}</div>
            <HelperHint id="govhub.overview" />
          </div>
          <div className="text-xs text-slate-400">{t('govhub.tree.entityCount', { n: entities.length })}</div>
        </div>
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
          {(['SG','HK','US','UK','AE'] as Jurisdiction[]).map((j) => {
            const meta = JURISDICTION_META[j];
            const list = byJurisdiction[j] || [];
            return (
              <div key={j} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <div className="flex items-center justify-between text-sm">
                  <span>{meta.flag} {t(`juris.${j}`)}</span>
                  <span className="text-xs text-slate-400">{list.length}</span>
                </div>
                <div className="mt-1 text-[11px] text-slate-500">{meta.regulator}</div>
                <div className="mt-3 space-y-1">
                  {list.length === 0 && <div className="text-xs text-slate-500">{t('govhub.tree.empty')}</div>}
                  {list.map((e: any) => (
                    <div key={e.id}
                         onClick={() => toast(t('govhub.toast.entityOpened', { name: e.legalName, hcs: e.hcs }))}
                         className="cursor-pointer rounded-lg bg-white/5 px-2 py-1.5 text-xs hover:bg-white/10">
                      <div className="truncate text-slate-200">{e.legalName}</div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>{e.kind}</span>
                        <span>{t('govhub.tree.hcs', { n: e.hcs })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Variation tracker (Gantt-style) */}
      <div className="rounded-2xl border border-white/10 bg-ink-900/50">
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="font-semibold">{t('govhub.gantt')}</div>
            <HelperHint id="govhub.gantt" />
          </div>
        </div>
        <div className="divide-y divide-white/5">
          {actions.map((a: any) => {
            const j = JURISDICTION_META[a.jurisdiction as Jurisdiction];
            return (
              <div key={a.id} className="px-4 py-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="nova-chip bg-white/5 text-slate-300 ring-white/10">
                      {t(`govhub.kind.${a.kind}`)}
                    </span>
                    <span className="font-medium">{a.title}</span>
                  </div>
                  <span className={`nova-chip ${STATUS_COLORS[a.status]}`}>{a.status}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                  <span>{a.entity?.legalName} · {j?.flag} {t(`juris.${a.jurisdiction}`)}</span>
                  {a.dueDate && <span>{fmtDate(a.dueDate)} · {relativeDays(a.dueDate)}</span>}
                </div>
                {/* state-machine progress bar */}
                <div className="mt-2 grid grid-cols-6 gap-1 text-[9px]">
                  {['INITIATED','DRAFTED','INTERNAL_APPROVED','CLIENT_SIGNED','FILED','CONFIRMED'].map((s, idx) => {
                    const order = ['INITIATED','DRAFTED','INTERNAL_APPROVED','CLIENT_SIGNED','FILED','CONFIRMED'].indexOf(a.status);
                    const reached = idx <= order;
                    return (
                      <div key={s} className={`h-1.5 rounded-full ${reached ? 'bg-nova-400' : 'bg-white/10'}`} />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-200">
        <div className="font-semibold">{t('govhub.versus.title')}</div>
        <div className="mt-1 text-slate-300">
          {t('govhub.versus.body')}
        </div>
      </div>
    </div>
  );
}
