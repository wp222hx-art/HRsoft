// NovaVault · Pro view — chain-anchored documents
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { fmtDate } from '@/lib/utils';
import { getServerT } from '@/i18n/server';

export default async function VaultPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const { t } = getServerT();

  const docs = await prisma.vaultDoc.findMany({
    where: user.portal === 'ADMIN' ? {} : { entity: { managerId: user.id } },
    orderBy: { uploadedAt: 'desc' }, take: 100,
    include: { entity: { select: { legalName: true, jurisdiction: true } } },
  }) as any[];

  const byKind: Record<string, number> = {};
  docs.forEach((d) => { byKind[d.category] = (byKind[d.category] || 0) + 1; });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">{t('pro.vault.title')}</h1>
        <p className="mt-1 text-sm text-slate-400">
          {t('pro.vault.subtitle')}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        {Object.entries(byKind).slice(0, 4).map(([k, c]) => (
          <div key={k} className="rounded-2xl border border-white/10 bg-ink-900/50 p-4">
            <div className="text-[11px] text-slate-400">{k}</div>
            <div className="mt-1 text-2xl font-bold text-white">{c}</div>
            <div className="mt-0.5 text-[11px] text-slate-500">{t('pro.vault.onChain')}</div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-900/50">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.02] text-left text-[11px] uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-4 py-3">{t('pro.vault.col.file')}</th>
              <th className="px-4 py-3">{t('pro.vault.col.entity')}</th>
              <th className="px-4 py-3">{t('pro.vault.col.kind')}</th>
              <th className="px-4 py-3">{t('pro.vault.col.hash')}</th>
              <th className="px-4 py-3">{t('pro.vault.col.tx')}</th>
              <th className="px-4 py-3 text-right">{t('pro.vault.col.time')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {docs.map((d) => (
              <tr key={d.id} className="hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-medium text-white">{d.name}</td>
                <td className="px-4 py-3 text-slate-300">{d.entity?.legalName || '—'}</td>
                <td className="px-4 py-3 text-slate-400 text-xs">{d.category}</td>
                <td className="px-4 py-3 font-mono text-[10px] text-slate-500">{d.chainHash?.slice(0, 16)}…</td>
                <td className="px-4 py-3 font-mono text-[10px] text-emerald-300">⛓ {d.chainTxId?.slice(0, 14) || '—'}…</td>
                <td className="px-4 py-3 text-right text-[11px] text-slate-400">{fmtDate(d.uploadedAt)}</td>
              </tr>
            ))}
            {docs.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">{t('pro.vault.empty')}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
