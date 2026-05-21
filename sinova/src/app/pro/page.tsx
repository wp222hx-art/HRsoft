// Pro Dashboard home — doc §2.3 A: 早安预警 + 今日待办 + Agent 流
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { RADAR_LEVEL_META } from '@/lib/enums';
import { fmtDate, formatMoney, relativeDays } from '@/lib/utils';
import { ArrowRight, AlertTriangle, Calendar, Activity, Briefcase } from 'lucide-react';
import { getServerT } from '@/i18n/server';

export default async function ProHome() {
  const user = await getCurrentUser();
  if (!user) return null;
  const { t } = getServerT();

  const [alerts, filings, payrolls, govActions, invoices, entityCount] = await Promise.all([
    prisma.radarAlert.findMany({
      where: { entity: { managerId: user.id }, status: { not: 'CLOSED' } },
      orderBy: [{ composite: 'asc' }],
      take: 6,
      include: { entity: { select: { legalName: true, jurisdiction: true } } },
    }),
    prisma.taxFiling.findMany({
      where: { entity: { managerId: user.id }, status: { in: ['DRAFT', 'PENDING_HUMAN', 'AI_REVIEWING'] } },
      orderBy: { dueDate: 'asc' }, take: 6,
      include: { entity: { select: { legalName: true } } },
    }),
    prisma.payrollRun.findMany({
      where: { entity: { managerId: user.id }, status: { in: ['DRAFT', 'APPROVED'] } },
      orderBy: { createdAt: 'desc' }, take: 4,
      include: { entity: { select: { legalName: true } } },
    }),
    prisma.govAction.findMany({
      where: { entity: { managerId: user.id }, status: { not: 'CONFIRMED' } },
      orderBy: { dueDate: 'asc' }, take: 4,
      include: { entity: { select: { legalName: true } } },
    }),
    prisma.invoice.findMany({
      where: { entity: { managerId: user.id }, status: 'OVERDUE' },
      orderBy: { daysOverdue: 'desc' }, take: 4,
    }),
    prisma.entity.count({ where: { managerId: user.id } }),
  ]);

  const stats = {
    entities: entityCount,
    radar:    alerts.length,
    overdue:  invoices.length,
    overdueAmt: invoices.reduce((s, i) => s + i.amount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {t('pro.home.greetingFmt', { name: user.name.split(' ')[0] })}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {t('pro.home.subtitleFmt', { n: filings.length })}
          </p>
        </div>
        <Link href="/pro/clients" className="nova-btn-outline text-xs">
          {t('pro.home.manageEntities', { n: entityCount })}
        </Link>
      </div>

      {/* Stat tiles */}
      <div className="grid gap-3 md:grid-cols-4">
        <StatTile icon={<Briefcase className="h-4 w-4" />}      label={t('pro.home.stat.entities')}   value={String(stats.entities)} accent="text-nova-300" />
        <StatTile icon={<AlertTriangle className="h-4 w-4" />}  label={t('pro.home.stat.radarOpen')}  value={String(stats.radar)}    accent="text-risk-orange" />
        <StatTile icon={<Activity className="h-4 w-4" />}       label={t('pro.home.stat.overdue')}    value={String(stats.overdue)}  accent="text-risk-yellow" />
        <StatTile icon={<Calendar className="h-4 w-4" />}       label={t('pro.home.stat.overdueAmt')} value={formatMoney(stats.overdueAmt)} accent="text-risk-red" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Radar 早安预警 */}
        <section className="lg:col-span-2">
          <SectionHead title={t('pro.home.section.alerts')} link="/pro/modules/radar" linkLabel={t('pro.home.section.toEnter')} />
          <div className="mt-3 space-y-2">
            {alerts.map((a) => {
              const m = RADAR_LEVEL_META[a.level as keyof typeof RADAR_LEVEL_META];
              return (
                <div key={a.id}
                  className={`flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 ring-1 ring-inset ${m.ring}`}>
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg ${m.bg}`}>
                    {m.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{a.title}</span>
                      <span className={`nova-chip ${m.bg} ${m.color} ring-white/5`}>
                        {m.label} · {a.composite}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-slate-400">
                      {a.entity.legalName} · {t(`juris.${a.entity.jurisdiction}`)} · {a.sourceModule}
                    </div>
                    <div className="mt-1 text-sm text-slate-300 line-clamp-2">{a.description}</div>
                  </div>
                  <Link href="/pro/modules/radar"
                    className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10">
                    {t('pro.home.alerts.handle')}
                  </Link>
                </div>
              );
            })}
            {alerts.length === 0 && (
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 text-center text-sm text-slate-400">
                {t('pro.home.alerts.healthy')}
              </div>
            )}
          </div>
        </section>

        {/* Today's todos */}
        <section className="space-y-4">
          <div>
            <SectionHead title={t('pro.home.section.todos')} />
            <div className="mt-3 space-y-2">
              {filings.slice(0, 4).map((f) => (
                <TaskRow key={f.id} icon="🛡" title={`${f.formType} · ${f.entity.legalName}`}
                  meta={`${relativeDays(f.dueDate)} · ${formatMoney(f.taxPayable)}`} status={f.status} />
              ))}
              {payrolls.map((p) => (
                <TaskRow key={p.id} icon="💸"
                  title={t('pro.home.payrollTitleFmt', { entity: p.entity.legalName })}
                  meta={t('pro.home.payrollMetaFmt', { n: p.headcount, money: formatMoney(p.netTotal) })}
                  status={p.status} />
              ))}
              {govActions.map((g) => (
                <TaskRow key={g.id} icon="🏛"
                  title={t('pro.home.govActionTitleFmt', { title: g.title, entity: g.entity.legalName })}
                  meta={g.dueDate ? relativeDays(g.dueDate) : t('pro.home.dashEm')} status={g.status} />
              ))}
            </div>
          </div>

          <div>
            <SectionHead title={t('pro.home.section.agentStream')} />
            <div className="mt-3 space-y-2 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-xs leading-relaxed text-slate-300">
              <AgentLine>{t('pro.home.agent.tax')}</AgentLine>
              <AgentLine done>{t('pro.home.agent.cash')}</AgentLine>
              <AgentLine done>{t('pro.home.agent.radar')}</AgentLine>
              <AgentLine>{t('pro.home.agent.payflow')}</AgentLine>
              <AgentLine done>{t('pro.home.agent.vault')}</AgentLine>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatTile({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
      <div className="flex items-center gap-2 text-xs text-slate-400">{icon}{label}</div>
      <div className={`mt-2 text-2xl font-bold ${accent}`}>{value}</div>
    </div>
  );
}

function SectionHead({ title, link, linkLabel }: { title: string; link?: string; linkLabel?: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-300">{title}</h2>
      {link && (
        <Link href={link} className="flex items-center gap-1 text-xs text-nova-300 hover:text-nova-200">
          {linkLabel} <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}

function TaskRow({ icon, title, meta, status }: { icon: string; title: string; meta: string; status: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-base">{icon}</span>
        <span className="truncate text-slate-200">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-slate-400">{meta}</span>
        <span className="nova-chip bg-white/5 text-slate-300 ring-white/10">{status}</span>
      </div>
    </div>
  );
}

function AgentLine({ children, done }: { children: React.ReactNode; done?: boolean }) {
  return (
    <div className="flex items-start gap-2">
      <span className={done ? 'text-emerald-400' : 'text-nova-300'}>·</span>
      <span className={done ? 'text-slate-400' : 'text-slate-200'}>{children}</span>
    </div>
  );
}
