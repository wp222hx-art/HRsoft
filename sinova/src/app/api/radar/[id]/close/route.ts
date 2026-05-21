// Close a Radar alert → award $NOVA tokens + log Arena event (the doc §3.5
// loop: handle alert → reward → data feeds Insight).
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { rewardTokens } from '@/lib/token';

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 });

  const alert = await prisma.radarAlert.findUnique({
    where: { id: params.id }, include: { entity: true },
  });
  if (!alert) return NextResponse.json({ error: 'alert not found' }, { status: 404 });

  // Permission: PRO managing entity OR SME owning entity OR admin.
  const okPro = user.portal === 'PRO'   && alert.entity.managerId === user.id;
  const okSme = user.portal === 'SME'   && alert.entity.ownerId   === user.id;
  const okAdm = user.portal === 'ADMIN';
  if (!(okPro || okSme || okAdm)) return NextResponse.json({ error: '无权操作' }, { status: 403 });

  // Reward proportional to severity
  const reward = { CRITICAL: 200, ALERT: 100, WATCH: 50, HEALTHY: 10 }[alert.level as 'CRITICAL'|'ALERT'|'WATCH'|'HEALTHY'] ?? 30;

  await prisma.radarAlert.update({ where: { id: alert.id }, data: { status: 'CLOSED' } });
  const balance = await rewardTokens(user.id, reward, `关闭 Radar 预警 · ${alert.title}`);
  // Arena event + small HCS uptick
  await prisma.arenaEvent.create({
    data: {
      entityId: alert.entityId,
      kind: 'RADAR_RESOLVED',
      hcsDelta: 3,
      tokenDelta: reward,
      message: `${user.name} 关闭了预警:${alert.title}`,
    },
  });
  await prisma.entity.update({
    where: { id: alert.entityId },
    data: { hcs: Math.min(100, alert.entity.hcs + 3) },
  });

  return NextResponse.json({ ok: true, reward, balance });
}
