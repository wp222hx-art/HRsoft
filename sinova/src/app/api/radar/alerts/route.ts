import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 });

  // Pro: see alerts on managed entities. SME: see alerts on owned entities. Admin: all.
  let where: any = {};
  if (user.portal === 'PRO')      where = { entity: { managerId: user.id } };
  else if (user.portal === 'SME') where = { entity: { ownerId: user.id } };

  const alerts = await prisma.radarAlert.findMany({
    where,
    orderBy: [{ status: 'asc' }, { composite: 'asc' }, { createdAt: 'desc' }],
    include: { entity: { select: { id: true, legalName: true, jurisdiction: true } } },
    take: 50,
  });
  return NextResponse.json({ alerts });
}
