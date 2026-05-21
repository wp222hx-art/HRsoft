// SME Smart Hub home — "👋 早安, 王老板! 你的 ABC Pte Ltd 健康度: 87 ✨"
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { PERSONA_PROFILES, RADAR_LEVEL_META, JURISDICTION_META, type Persona } from '@/lib/enums';
import { computeHcs, hcsState } from '@/lib/arena';
import { fmtDate, formatMoney, relativeDays } from '@/lib/utils';
import { getServerT } from '@/i18n/server';

export default async function SmeHome() {
  const user = await getCurrentUser();
  if (!user) return null;
  const { t } = getServerT();

  const [entities, alerts, filings, invoices, bills, badges] = await Promise.all([
    prisma.entity.findMany({ where: { ownerId: user.id }, take: 5 }),
    prisma.radarAlert.findMany({
      where: { entity: { ownerId: user.id }, status: { not: 'CLOSED' } },
      orderBy: { composite: 'asc' }, take: 4,
      include: { entity: { select: { legalName: true, jurisdiction: true } } },
    }),
    prisma.taxFiling.findMany({
      where: { entity: { ownerId: user.id }, status: { in: ['DRAFT', 'PENDING_HUMAN', 'AI_REVIEWING'] } },
      orderBy: { dueDate: 'asc' }, take: 4,
    }),
    prisma.invoice.findMany({
      where: { entity: { ownerId: user.id }, status: 'OVERDUE' },
      orderBy: { daysOverdue: 'desc' }, take: 4,
    }),
    prisma.bill.findMany({
      where: { entity: { ownerId: user.id }, status: { in: ['APPROVAL_PENDING', 'APPROVED'] } },
      orderBy: { dueDate: 'asc' }, take: 4,
    }),
    prisma.userBadge.findMany({ where: { userId: user.id }, include: { badge: true }, take: 6 }),
  ]);

  const persona = PERSONA_PROFILES[(user.aiPersona as Persona) || 'MAYA'];

  // HCS for the SME (single primary entity)
  const primary = entities[0];
  const hcs = primary?.hcs ?? computeHcs({ punctuality: 88, finance: 75, governance: 82, improvement: 68 });
  const hcsLabel = hcsState(hcs);

  const overdueAmt = invoices.reduce((s, i) => s + i.amount, 0);
  const upcomingAp = bills.reduce((s, b) => s + b.amount, 0);

  const firstName = user.name.split(' ')[0];
  const greeting = t('sme.home.greetingFmt', { emoji: persona.emoji, name: firstName });

  return (
    <div className="space-y-5">
      {/* Big personalized greeting */}
      <section className="rounded-2xl border border-white/10 bg-gradient-to-r from-nova-900/40 via-pink-900/20 to-ink-950 p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-2xl font-bold text-white">{greeting}</div>
            <div className="mt-1 text-sm text-slate-300">
              {t('sme.home.entityIs')} <span className="font-semibold text-white">{primary?.legalName || t('sme.home.entityFallback')}</span>
              {primary && (
                <span className="ml-1 text-slate-400">
                  ({JURISDICTION_META[primary.jurisdiction as keyof typeof JURISDICTION_META]?.flag} {t(`juris.${primary.jurisdiction}`)})
                </span>
              )} {t('sme.home.healthIs2')}
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-300">
                {hcs} ✨
              </span>
            </div>
            <div className="mt-2 max-w-2xl text-[12px] text-slate-400">
              {persona.voice(t('sme.home.partnerIntro'))}
            </div>
          </div>
          <Link href="/sme/modules/partner" className="nova-btn-primary text-xs">
            {t('sme.home.chatWith2', { name: persona.name })}
          </Link>
        </div>
      </section>

      {/* Stat tiles */}
      <div className="grid gap-3 md:grid-cols-4">
        <Stat label={t('sme.home.stat.entities')}
              value={String(entities.length)}
              hint={t('sme.home.stat.entitiesHint')}
              accent="text-nova-300" />
        <Stat label={t('sme.home.stat.alerts')}
              value={String(alerts.length)}
              hint={alerts.length === 0 ? t('sme.home.stat.alertsOk') : t('sme.home.stat.alertsBad')}
              accent="text-amber-300" />
        <Stat label={t('sme.home.stat.overdue')}
              value={formatMoney(overdueAmt)}
              hint={`${invoices.length} ${t('sme.home.stat.overdueHint')}`}
              accent="text-red-300" />
        <Stat label={t('sme.home.stat.upcoming')}
              value={formatMoney(upcomingAp)}
              hint={`${bills.length} ${t('sme.home.stat.upcomingHint')}`}
              accent="text-cyan-300" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Today's care list (Partner-led) */}
        <section className="lg:col-span-2 rounded-2xl border border-white/10 bg-ink-900/50">
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
            <div className="font-semibold">{t('sme.home.todo.title', { name: persona.name })}</div>
            <Link href="/sme/modules/partner" className="text-xs text-nova-300 hover:text-nova-200">{t('sme.home.viewAll')}</Link>
          </div>
          <div className="divide-y divide-white/5">
            {alerts.map((a) => {
              const m = RADAR_LEVEL_META[a.level as keyof typeof RADAR_LEVEL_META];
              return (
                <div key={a.id} className="flex items-start gap-3 px-4 py-3 text-sm">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${m.bg} ${m.color}`}>{m.emoji}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{a.title}</span>
                      <span className={`rounded-full ${m.bg} ${m.color} px-2 py-0.5 text-[10px]`}>{m.label}</span>
                    </div>
                    <div className="mt-0.5 text-[11px] text-slate-400">{a.entity.legalName} · {m.ahead}</div>
                  </div>
                  <Link href="/sme/modules/radar" className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-200 hover:bg-white/10">
                    {t('sme.home.handleByPersona', { name: persona.name })}
                  </Link>
                </div>
              );
            })}
            {filings.map((f) => (
              <div key={f.id} className="flex items-start gap-3 px-4 py-3 text-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/15 text-blue-300">🛡</div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-white">{t('sme.home.taxFormTitle', { form: f.formType })}</div>
                  <div className="mt-0.5 text-[11px] text-slate-400">{t('sme.home.taxFormMeta', { money: formatMoney(f.taxPayable), due: relativeDays(f.dueDate) })}</div>
                </div>
                <Link href="/sme/modules/taxshield" className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-200 hover:bg-white/10">
                  {t('sme.home.act.review')}
                </Link>
              </div>
            ))}
            {invoices.slice(0, 2).map((i) => (
              <div key={i.id} className="flex items-start gap-3 px-4 py-3 text-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/15 text-red-300">💰</div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-white">{t('sme.home.invoiceTitle', { customer: i.customer, days: i.daysOverdue })}</div>
                  <div className="mt-0.5 text-[11px] text-slate-400">{t('sme.home.invoiceMeta', { money: formatMoney(i.amount), currency: i.currency, stage: i.dunningStage })}</div>
                </div>
                <Link href="/sme/modules/cashloop" className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-200 hover:bg-white/10">
                  {t('sme.home.act.collect')}
                </Link>
              </div>
            ))}
            {alerts.length === 0 && filings.length === 0 && invoices.length === 0 && (
              <div className="px-4 py-10 text-center text-sm text-slate-400">
                {t('sme.home.allClearTitle')}
              </div>
            )}
          </div>
        </section>

        {/* Sidebar: HCS + badges */}
        <section className="space-y-5">
          {/* HCS */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-900/40 to-ink-950 p-4 text-center">
            <div className="text-[11px] text-slate-400">{t('sme.home.hcsLabel')}</div>
            <div className="mt-1 text-5xl font-black text-emerald-300">{hcs}</div>
            <div className="mt-1 text-xs text-slate-300">{hcsLabel}</div>
            <Link href="/sme/modules/arena" className="mt-3 inline-block text-[11px] text-nova-300 hover:text-nova-200">
              {t('sme.home.viewArena')}
            </Link>
          </div>

          {/* Badges */}
          <div className="rounded-2xl border border-white/10 bg-ink-900/50 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">{t('sme.home.myBadges')}</div>
              <span className="text-[10px] text-slate-500">{t('sme.home.myBadgesCount', { n: badges.length })}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {badges.map((b) => (
                <div key={b.id} title={b.badge.description} className="rounded-lg border border-gold-500/30 bg-gold-500/10 px-2 py-1 text-xs text-gold-300">
                  {b.badge.emoji} {b.badge.name}
                </div>
              ))}
              {badges.length === 0 && <div className="text-[11px] text-slate-500">{t('sme.home.firstFiling')}</div>}
            </div>
          </div>

          {/* Token */}
          <div className="rounded-2xl border border-gold-500/30 bg-gradient-to-br from-gold-500/15 to-amber-500/5 p-4">
            <div className="text-[11px] text-slate-400">{t('sme.home.balance')}</div>
            <div className="mt-1 text-3xl font-bold text-gold-300">{user.novaTokens.toLocaleString()}</div>
            <div className="mt-1 text-[11px] text-slate-400">{t('sme.home.streakFmt', { n: user.streakDays })}</div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value, hint, accent }: { label: string; value: string; hint?: string; accent?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-ink-900/50 p-4">
      <div className="text-[11px] text-slate-400">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${accent || 'text-white'}`}>{value}</div>
      {hint && <div className="mt-0.5 text-[11px] text-slate-500">{hint}</div>}
    </div>
  );
}
