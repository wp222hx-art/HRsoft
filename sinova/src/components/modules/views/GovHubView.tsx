'use client';
import { fmtDate, relativeDays } from '@/lib/utils';
import { JURISDICTION_META, type Jurisdiction } from '@/lib/enums';

const STATUS_COLORS: Record<string, string> = {
  INITIATED:        'bg-slate-500/20 text-slate-300',
  DRAFTED:          'bg-nova-500/20 text-nova-300',
  INTERNAL_APPROVED:'bg-amber-500/20 text-amber-300',
  CLIENT_SIGNED:    'bg-cyan-500/20 text-cyan-300',
  FILED:            'bg-blue-500/20 text-blue-300',
  CONFIRMED:        'bg-emerald-500/20 text-emerald-300',
};

const KIND_LABELS: Record<string, string> = {
  INCORPORATION:   '公司注册',
  ADDRESS_CHANGE:  '地址变更',
  DIRECTOR_CHANGE: '董事变更',
  SHARE_ALLOTMENT: '股权分配',
  AGM:             '股东大会',
  ARTICLES_AMEND:  '章程修订',
  DAO_RESOLUTION:  'DAO 决议',
};

export function GovHubView({ actions, entities }: any) {
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
          <div className="font-semibold">🌍 公司全球架构图 (跨 5 国 + DAO)</div>
          <div className="text-xs text-slate-400">{entities.length} 个 entity</div>
        </div>
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
          {(['SG','HK','US','UK','AE'] as Jurisdiction[]).map((j) => {
            const meta = JURISDICTION_META[j];
            const list = byJurisdiction[j] || [];
            return (
              <div key={j} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <div className="flex items-center justify-between text-sm">
                  <span>{meta.flag} {meta.name}</span>
                  <span className="text-xs text-slate-400">{list.length}</span>
                </div>
                <div className="mt-1 text-[11px] text-slate-500">{meta.regulator}</div>
                <div className="mt-3 space-y-1">
                  {list.length === 0 && <div className="text-xs text-slate-500">— 暂无 entity —</div>}
                  {list.map((e: any) => (
                    <div key={e.id} className="rounded-lg bg-white/5 px-2 py-1.5 text-xs">
                      <div className="truncate text-slate-200">{e.legalName}</div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>{e.kind}</span>
                        <span>HCS {e.hcs}</span>
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
        <div className="border-b border-white/5 px-4 py-3 font-semibold">📋 变更追踪甘特</div>
        <div className="divide-y divide-white/5">
          {actions.map((a: any) => {
            const j = JURISDICTION_META[a.jurisdiction as Jurisdiction];
            return (
              <div key={a.id} className="px-4 py-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="nova-chip bg-white/5 text-slate-300 ring-white/10">
                      {KIND_LABELS[a.kind] || a.kind}
                    </span>
                    <span className="font-medium">{a.title}</span>
                  </div>
                  <span className={`nova-chip ${STATUS_COLORS[a.status]}`}>{a.status}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                  <span>{a.entity?.legalName} · {j?.flag} {j?.name}</span>
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
        <div className="font-semibold">💡 vs Copi 超越点</div>
        <div className="mt-1 text-slate-300">
          Copi AI.CorpSec 仅 SG。SiNova 支持 5 国主体注册 (HK CR / US Delaware / UK Companies House / AE DMCC) +
          AGM 全自动决议 + DAO 实体支持 (Marshall Islands DAO LLC / Cayman Foundation)。专为出海企业和 Web3 公司设计。
        </div>
      </div>
    </div>
  );
}
