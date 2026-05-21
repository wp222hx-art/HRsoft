// Pro · Clients — list of managed entities
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { JURISDICTION_META } from '@/lib/enums';
import { getServerT } from '@/i18n/server';

export default async function ClientsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const { t } = getServerT();

  const entities = await prisma.entity.findMany({
    where: user.portal === 'ADMIN' ? {} : { managerId: user.id },
    include: {
      owner: { select: { name: true, email: true, smeType: true } },
      _count: { select: { filings: true, govActions: true, payrolls: true, radarAlerts: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">{t('pro.clients.titleFmt', { n: entities.length })}</h1>
        <p className="mt-1 text-sm text-slate-400">{t('pro.clients.subtitle')}</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-900/50">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.02] text-left text-[11px] uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-4 py-3">{t('pro.clients.col.entity')}</th>
              <th className="px-4 py-3">{t('pro.clients.col.owner')}</th>
              <th className="px-4 py-3">{t('pro.clients.col.type')}</th>
              <th className="px-4 py-3">{t('pro.clients.col.hcs')}</th>
              <th className="px-4 py-3">{t('pro.clients.col.radar')}</th>
              <th className="px-4 py-3">{t('pro.clients.col.filings')}</th>
              <th className="px-4 py-3 text-right">{t('pro.clients.col.action')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {entities.map((e) => {
              const j = JURISDICTION_META[e.jurisdiction as keyof typeof JURISDICTION_META];
              return (
                <tr key={e.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{e.legalName}</div>
                    <div className="text-[11px] text-slate-500">{j?.flag} {t(`juris.${e.jurisdiction}`)} · {e.kind}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    <div>{(e as any).owner?.name || '—'}</div>
                    <div className="text-[11px] text-slate-500">{(e as any).owner?.email}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{(e as any).owner?.smeType || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${
                      e.hcs >= 80 ? 'bg-emerald-500/15 text-emerald-300' :
                      e.hcs >= 60 ? 'bg-cyan-500/15 text-cyan-300' :
                      e.hcs >= 40 ? 'bg-amber-500/15 text-amber-300' :
                      'bg-red-500/15 text-red-300'
                    }`}>
                      {e.hcs} · {e.hcsState}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{(e as any)._count?.radarAlerts ?? 0}</td>
                  <td className="px-4 py-3 text-slate-300">{(e as any)._count?.filings ?? 0}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/pro/modules/radar`} className="text-xs text-nova-300 hover:text-nova-200">{t('pro.clients.view')}</Link>
                  </td>
                </tr>
              );
            })}
            {entities.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500">{t('pro.clients.empty')}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
