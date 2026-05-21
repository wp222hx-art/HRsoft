// Pro · Unified task center
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { fmtDate, formatMoney, relativeDays } from '@/lib/utils';
import { getServerT } from '@/i18n/server';

export default async function TasksPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const { t } = getServerT();
  const filter = user.portal === 'ADMIN' ? {} : { entity: { managerId: user.id } };

  const [filings, payrolls, govActions] = await Promise.all([
    prisma.taxFiling.findMany({
      where: { ...filter, status: { not: 'FILED' } },
      orderBy: { dueDate: 'asc' }, take: 30,
      include: { entity: { select: { legalName: true, jurisdiction: true } } },
    }),
    prisma.payrollRun.findMany({
      where: { ...filter, status: { in: ['DRAFT', 'APPROVED', 'CALCULATING'] } },
      orderBy: { createdAt: 'desc' }, take: 30,
      include: { entity: { select: { legalName: true } } },
    }),
    prisma.govAction.findMany({
      where: { ...filter, status: { not: 'CONFIRMED' } },
      orderBy: { dueDate: 'asc' }, take: 30,
      include: { entity: { select: { legalName: true } } },
    }),
  ]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">{t('pro.tasks.title')}</h1>
        <p className="mt-1 text-sm text-slate-400">{t('pro.tasks.subtitle')}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Section title={t('pro.tasks.section.tax')} count={filings.length} countLabel={t('pro.tasks.count')}>
          {filings.map((f) => (
            <Row
              key={f.id} icon="🛡"
              title={t('pro.tasks.taxRowTitle', { form: f.formType, entity: f.entity.legalName })}
              meta={t('pro.tasks.taxRowMeta', { juris: t(`juris.${f.entity.jurisdiction}`), money: formatMoney(f.taxPayable), due: relativeDays(f.dueDate) })}
              status={f.status}
              href="/pro/modules/taxshield"
            />
          ))}
        </Section>

        <Section title={t('pro.tasks.section.payroll')} count={payrolls.length} countLabel={t('pro.tasks.count')}>
          {payrolls.map((p) => (
            <Row
              key={p.id} icon="💸"
              title={t('pro.tasks.payrollRowTitle', { period: p.period, entity: p.entity.legalName })}
              meta={t('pro.tasks.payrollRowMeta', { n: p.headcount, money: formatMoney(p.netTotal) })}
              status={p.status}
              href="/pro/modules/payflow"
            />
          ))}
        </Section>

        <Section title={t('pro.tasks.section.gov')} count={govActions.length} countLabel={t('pro.tasks.count')}>
          {govActions.map((g) => (
            <Row
              key={g.id} icon="🏛"
              title={`${g.title}`}
              meta={t('pro.tasks.govRowMeta', { entity: g.entity.legalName, due: g.dueDate ? relativeDays(g.dueDate) : '—' })}
              status={g.status}
              href="/pro/modules/govhub"
            />
          ))}
        </Section>
      </div>
    </div>
  );
}

function Section({ title, count, countLabel, children }: { title: string; count: number; countLabel: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-ink-900/50">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
        <div className="font-semibold">{title}</div>
        <span className="text-xs text-slate-500">{count} {countLabel}</span>
      </div>
      <div className="divide-y divide-white/5 max-h-[520px] overflow-y-auto">{children}</div>
    </section>
  );
}

function Row({ icon, title, meta, status, href }: { icon: string; title: string; meta: string; status: string; href: string }) {
  return (
    <Link href={href} className="flex items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-white/[0.02]">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span>{icon}</span>
          <span className="truncate font-medium text-white">{title}</span>
        </div>
        <div className="mt-0.5 text-[11px] text-slate-400">{meta}</div>
      </div>
      <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-slate-300">{status}</span>
    </Link>
  );
}
