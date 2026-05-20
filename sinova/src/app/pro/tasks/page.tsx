// Pro · Unified task center
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { fmtDate, formatMoney, relativeDays } from '@/lib/utils';

export default async function TasksPage() {
  const user = await getCurrentUser();
  if (!user) return null;
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
        <h1 className="text-2xl font-bold">📅 我的任务台</h1>
        <p className="mt-1 text-sm text-slate-400">所有跨模块的待办事项 · 由 NovaCopilot Multi-Agent 自动归集</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Section title="🛡 税务申报" count={filings.length}>
          {filings.map((f) => (
            <Row
              key={f.id} icon="🛡"
              title={`${f.formType} · ${f.entity.legalName}`}
              meta={`${f.entity.jurisdiction} · ${formatMoney(f.taxPayable)} · ${relativeDays(f.dueDate)}`}
              status={f.status}
              href="/pro/modules/taxshield"
            />
          ))}
        </Section>

        <Section title="💸 薪酬运行" count={payrolls.length}>
          {payrolls.map((p) => (
            <Row
              key={p.id} icon="💸"
              title={`${p.period} · ${p.entity.legalName}`}
              meta={`${p.headcount} 人 · 净额 ${formatMoney(p.netTotal)}`}
              status={p.status}
              href="/pro/modules/payflow"
            />
          ))}
        </Section>

        <Section title="🏛 公司治理" count={govActions.length}>
          {govActions.map((g) => (
            <Row
              key={g.id} icon="🏛"
              title={`${g.title}`}
              meta={`${g.entity.legalName} · ${g.dueDate ? relativeDays(g.dueDate) : '—'}`}
              status={g.status}
              href="/pro/modules/govhub"
            />
          ))}
        </Section>
      </div>
    </div>
  );
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-ink-900/50">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
        <div className="font-semibold">{title}</div>
        <span className="text-xs text-slate-500">{count} 项</span>
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
