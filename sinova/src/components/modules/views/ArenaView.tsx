'use client';
// Arena — gamified compliance. Badges + leaderboard + HCS.
import { BADGE_CATALOG, computeHcs, hcsState } from '@/lib/arena';
import { fmtDate } from '@/lib/utils';
import { useI18n } from '@/i18n/client';

type Badge = { id: string; code: string; name: string; emoji: string; description: string; category: string };
type UserBadge = { id: string; awardedAt: string; badge: Badge };
type ArenaEvent = { id: string; type: string; payload: string; createdAt: string; entity?: { legalName: string } };
type LeaderRow = { id: string; name: string; portal: string; novaTokens: number; streakDays: number; proType?: string | null; smeType?: string | null };

const STATE_META: Record<string, { color: string; bg: string; emoji: string }> = {
  HEALTHY:   { color: 'text-emerald-300', bg: 'bg-emerald-500/15 ring-emerald-500/40', emoji: '🟢' },
  AT_RISK:   { color: 'text-cyan-300',    bg: 'bg-cyan-500/15 ring-cyan-500/40',       emoji: '🟡' },
  WARNING:   { color: 'text-amber-300',   bg: 'bg-amber-500/15 ring-amber-500/40',     emoji: '🟠' },
  CRITICAL:  { color: 'text-red-300',     bg: 'bg-red-500/15 ring-red-500/40',         emoji: '🔴' },
  DEFAULTED: { color: 'text-rose-300',    bg: 'bg-rose-500/15 ring-rose-500/40',       emoji: '⚫' },
};

export function ArenaView({
  myBadges, allBadges, events, leaderboard,
}: {
  myBadges: UserBadge[]; allBadges: Badge[]; events: ArenaEvent[]; leaderboard: LeaderRow[];
}) {
  const { t } = useI18n();
  // Demo HCS — derive a rough number from current activity
  const hcs = computeHcs({ punctuality: 92, finance: 78, governance: 85, improvement: 70 });
  const state = hcsState(hcs);
  const meta = STATE_META[state];
  const stateLabel = t(`arena.state.${state}`);
  const earnedCodes = new Set(myBadges.map((b) => b.badge.code));
  const totalBadges = Math.max(allBadges.length, BADGE_CATALOG.length);

  return (
    <div className="space-y-5">
      {/* HCS dashboard */}
      <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-gold-500/10 via-ink-950 to-ink-950 p-5">
        <div className="grid gap-5 md:grid-cols-[260px_1fr]">
          <div className="flex flex-col items-center justify-center">
            <div className="text-[11px] text-slate-400">{t('arena.hcs.title')}</div>
            <div className={`relative mt-2 flex h-40 w-40 items-center justify-center rounded-full ${meta.bg} ring-4`}>
              <div className={`text-5xl font-black ${meta.color}`}>{hcs}</div>
            </div>
            <div className={`mt-2 rounded-full px-3 py-0.5 text-xs ${meta.bg} ${meta.color}`}>
              {meta.emoji} {stateLabel} {t('arena.stateSuffix')}
            </div>
          </div>
          <div className="space-y-3">
            <div className="text-sm font-semibold text-white">{t('arena.title2')}</div>
            <div className="text-[12px] text-slate-300">
              {t('arena.formula2')}
            </div>
            <div className="grid gap-2 md:grid-cols-4">
              <Factor label={t('arena.factor2.punctuality')} weight="40%" v={92} accent="emerald" />
              <Factor label={t('arena.factor2.finance')}     weight="30%" v={78} accent="cyan" />
              <Factor label={t('arena.factor2.governance')}  weight="20%" v={85} accent="amber" />
              <Factor label={t('arena.factor2.improvement')} weight="10%" v={70} accent="pink" />
            </div>
            <div className="rounded-xl border border-white/5 bg-ink-950/60 p-3 text-[11px] text-slate-400">
              {t('arena.tip2')}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        {/* Badges */}
        <section className="rounded-2xl border border-white/10 bg-ink-900/50">
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
            <div>
              <div className="font-semibold">
                {t('arena.badges.titleFmt', { earned: myBadges.length, total: totalBadges })}
              </div>
              <div className="text-[11px] text-slate-400">{t('arena.badges.subtitle')}</div>
            </div>
            <button className="nova-btn-outline text-xs">{t('arena.badges.viewAll2')}</button>
          </div>
          <div className="grid grid-cols-3 gap-2 p-4 md:grid-cols-4">
            {BADGE_CATALOG.map((b) => {
              const earned = earnedCodes.has(b.code);
              return (
                <div
                  key={b.code}
                  className={`rounded-xl border p-3 text-center transition ${
                    earned
                      ? 'border-gold-500/40 bg-gradient-to-br from-gold-500/15 to-amber-500/10 ring-1 ring-gold-500/30'
                      : 'border-white/5 bg-ink-950/60 grayscale opacity-60'
                  }`}
                  title={b.description}
                >
                  <div className="text-3xl">{b.emoji}</div>
                  <div className="mt-1 text-[12px] font-medium text-white">{b.name}</div>
                  <div className="mt-0.5 text-[10px] text-slate-400 line-clamp-2">{b.description}</div>
                  {earned && <div className="mt-1 text-[9px] text-gold-300">{t('arena.badges.unlocked2')}</div>}
                </div>
              );
            })}
          </div>
        </section>

        {/* Leaderboard */}
        <section className="rounded-2xl border border-white/10 bg-ink-900/50">
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
            <div className="font-semibold">{t('arena.lb.title2')}</div>
            <span className="text-[11px] text-slate-400">{t('arena.lb.tokens2')}</span>
          </div>
          <div className="divide-y divide-white/5">
            {leaderboard.map((u, i) => {
              const medal = ['🥇', '🥈', '🥉'][i] || `${i + 1}`;
              return (
                <div key={u.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                  <div className="w-6 text-center font-mono text-slate-400">{medal}</div>
                  <div className="flex-1">
                    <div className="font-medium text-white">{u.name}</div>
                    <div className="text-[10px] text-slate-500">{u.portal} · {u.proType || u.smeType || t('arena.row.fallback')}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-gold-400">{u.novaTokens.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-500">{t('arena.streakDays', { n: u.streakDays })}</div>
                  </div>
                </div>
              );
            })}
            {leaderboard.length === 0 && (
              <div className="p-6 text-center text-xs text-slate-500">{t('arena.lb.empty2')}</div>
            )}
          </div>
        </section>
      </div>

      {/* Recent arena feed */}
      <section className="rounded-2xl border border-white/10 bg-ink-900/50">
        <div className="border-b border-white/5 px-4 py-3 font-semibold">{t('arena.feed.title2')}</div>
        <div className="divide-y divide-white/5">
          {events.length === 0 && (
            <div className="px-4 py-6 text-center text-xs text-slate-500">{t('arena.feed.empty2')}</div>
          )}
          {events.map((e) => (
            <div key={e.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-slate-300">{e.type}</span>
                <span className="text-slate-200">{e.entity?.legalName || t('arena.row.fallback')}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="font-mono">{e.payload?.slice(0, 60)}</span>
                <span>{fmtDate(e.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Factor({ label, weight, v, accent }: { label: string; weight: string; v: number; accent: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-ink-950/60 p-2.5">
      <div className="flex justify-between text-[10px] text-slate-400">
        <span>{label}</span>
        <span>{weight}</span>
      </div>
      <div className={`mt-1 text-lg font-bold text-${accent}-300`}>{v}</div>
      <div className="mt-1 h-1 rounded-full bg-white/10">
        <div className={`h-1 rounded-full bg-${accent}-400`} style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}
