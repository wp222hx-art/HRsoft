import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 });

  let where: any = {};
  if (user.portal === 'PRO')      where = { managerId: user.id };
  else if (user.portal === 'SME') where = { ownerId: user.id };

  const entities = await prisma.entity.findMany({
    where,
    orderBy: { createdAt: 'asc' },
    include: {
      _count: {
        select: { filings: true, invoices: true, bills: true, govActions: true, vatReturns: true, radarAlerts: true, vaultDocs: true },
      },
    },
  });
  return NextResponse.json({ entities });
}
