// NovaVault · Pro view — chain-anchored documents
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { fmtDate } from '@/lib/utils';

export default async function VaultPage() {
  const user = await getCurrentUser();
  if (!user) return null;

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
        <h1 className="text-2xl font-bold">NovaVault · 主权数据保险柜</h1>
        <p className="mt-1 text-sm text-slate-400">
          所有合规文件加密存档 + 上链存证(NovaChain) · OpenAttestation 标准 · 任何人不可篡改
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        {Object.entries(byKind).slice(0, 4).map(([k, c]) => (
          <div key={k} className="rounded-2xl border border-white/10 bg-ink-900/50 p-4">
            <div className="text-[11px] text-slate-400">{k}</div>
            <div className="mt-1 text-2xl font-bold text-white">{c}</div>
            <div className="mt-0.5 text-[11px] text-slate-500">已上链</div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-900/50">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.02] text-left text-[11px] uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-4 py-3">文件</th>
              <th className="px-4 py-3">主体</th>
              <th className="px-4 py-3">类型</th>
              <th className="px-4 py-3">SHA-256</th>
              <th className="px-4 py-3">链上 TX</th>
              <th className="px-4 py-3 text-right">时间</th>
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
              <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">Vault 为空</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
