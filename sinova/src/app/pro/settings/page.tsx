// Settings — minimal placeholder demonstrating user metadata + token ledger
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { fmtDate } from '@/lib/utils';

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const ledger = await prisma.tokenLedgerEntry.findMany({
    where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 20,
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">⚙️ 账户设置</h1>
        <p className="mt-1 text-sm text-slate-400">个人资料 · API Key · Token 流水 · NovaPassport</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-ink-900/50 p-4">
          <div className="text-sm font-semibold">👤 个人资料</div>
          <div className="mt-3 space-y-1 text-sm">
            <Row label="姓名" v={user.name} />
            <Row label="邮箱" v={user.email} />
            <Row label="角色" v={`${user.portal} · ${user.proType || user.smeType || '—'}`} />
            <Row label="$NOVA 余额" v={`${user.novaTokens.toLocaleString()} (🔥 ${user.streakDays}d)`} />
            <Row label="AI 合伙人" v={user.aiPersona || '—'} />
            <Row label="加入时间" v={fmtDate(user.createdAt)} />
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-ink-900/50 p-4">
          <div className="text-sm font-semibold">🪙 Token 流水(最近 20 笔)</div>
          <div className="mt-3 max-h-[320px] divide-y divide-white/5 overflow-y-auto text-sm">
            {ledger.map((l) => (
              <div key={l.id} className="flex items-center justify-between py-2">
                <div>
                  <div className="text-xs text-slate-300">{l.reason}</div>
                  <div className="text-[10px] text-slate-500">{fmtDate(l.createdAt)}</div>
                </div>
                <div className={`font-mono text-sm ${l.delta >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                  {l.delta >= 0 ? '+' : ''}{l.delta}
                </div>
              </div>
            ))}
            {ledger.length === 0 && <div className="py-6 text-center text-xs text-slate-500">还没有流水</div>}
          </div>
        </section>
      </div>
    </div>
  );
}

function Row({ label, v }: { label: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-white/5 py-1.5">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-200">{v}</span>
    </div>
  );
}
