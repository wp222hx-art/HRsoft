// Generic module data endpoint — returns the data slice each of the
// 10 SiNova modules needs for its demo page.
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { MODULE_BY_SLUG } from '@/lib/enums';

function entityFilter(user: { id: string; portal: string }): any {
  if (user.portal === 'ADMIN') return undefined;
  if (user.portal === 'PRO')   return { managerId: user.id };
  return { ownerId: user.id };
}

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 });
  const meta = MODULE_BY_SLUG[params.slug];
  if (!meta) return NextResponse.json({ error: '模块不存在' }, { status: 404 });

  const eFilter = entityFilter(user as any);
  const entityWhere = eFilter ? { entity: eFilter } : {};

  switch (params.slug) {
    case 'taxshield': {
      const filings = await prisma.taxFiling.findMany({
        where: entityWhere, orderBy: { dueDate: 'asc' }, take: 50,
        include: { entity: { select: { legalName: true, jurisdiction: true } } },
      });
      return NextResponse.json({ meta, filings });
    }
    case 'payflow': {
      const runs = await prisma.payrollRun.findMany({
        where: entityWhere, orderBy: { period: 'desc' }, take: 50,
        include: { entity: { select: { legalName: true, jurisdiction: true } } },
      });
      const esops = await prisma.esopGrant.findMany({
        orderBy: { vestStart: 'desc' }, take: 50,
      });
      return NextResponse.json({ meta, runs, esops });
    }
    case 'cashloop': {
      const invoices = await prisma.invoice.findMany({
        where: entityWhere, orderBy: { dueDate: 'asc' }, take: 50,
        include: { entity: { select: { legalName: true } } },
      });
      const bills = await prisma.bill.findMany({
        where: entityWhere, orderBy: { dueDate: 'asc' }, take: 50,
        include: { entity: { select: { legalName: true } } },
      });
      return NextResponse.json({ meta, invoices, bills });
    }
    case 'govhub': {
      const actions = await prisma.govAction.findMany({
        where: entityWhere, orderBy: { dueDate: 'asc' }, take: 50,
        include: { entity: { select: { legalName: true, jurisdiction: true } } },
      });
      const entities = await prisma.entity.findMany({
        where: eFilter, orderBy: { createdAt: 'asc' }, take: 50,
      });
      return NextResponse.json({ meta, actions, entities });
    }
    case 'taxnet': {
      const vats = await prisma.vatReturn.findMany({
        where: entityWhere, orderBy: { dueDate: 'asc' }, take: 50,
        include: { entity: { select: { legalName: true, jurisdiction: true } } },
      });
      return NextResponse.json({ meta, vats });
    }
    case 'radar': {
      const alerts = await prisma.radarAlert.findMany({
        where: entityWhere,
        orderBy: [{ status: 'asc' }, { composite: 'asc' }],
        take: 50,
        include: { entity: { select: { legalName: true, jurisdiction: true } } },
      });
      return NextResponse.json({ meta, alerts });
    }
    case 'partner': {
      // Recent chats
      const chats = await prisma.copilotChat.findMany({
        where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 10,
        include: { messages: { orderBy: { createdAt: 'asc' }, take: 30 } },
      });
      return NextResponse.json({ meta, chats });
    }
    case 'market': {
      const apps = await prisma.marketApp.findMany({ orderBy: { installs: 'desc' } });
      return NextResponse.json({ meta, apps });
    }
    case 'arena': {
      // User's badges + leaderboard (top streaks)
      const myBadges = await prisma.userBadge.findMany({
        where: { userId: user.id }, include: { badge: true },
      });
      const allBadges = await prisma.badge.findMany();
      const events = await prisma.arenaEvent.findMany({
        where: entityWhere, orderBy: { createdAt: 'desc' }, take: 30,
        include: { entity: { select: { legalName: true } } },
      });
      const leaderboard = await prisma.user.findMany({
        where: { portal: { in: ['PRO', 'SME'] } },
        orderBy: [{ novaTokens: 'desc' }, { streakDays: 'desc' }],
        take: 10,
        select: { id: true, name: true, portal: true, novaTokens: true, streakDays: true, proType: true, smeType: true },
      });
      return NextResponse.json({ meta, myBadges, allBadges, events, leaderboard });
    }
    case 'insight': {
      const reports = await prisma.insightReport.findMany({ orderBy: { pricesgd: 'desc' } });
      // Aggregates demonstrating k-anonymity
      const entityCount = await prisma.entity.count();
      const filingCount = await prisma.taxFiling.count();
      return NextResponse.json({ meta, reports, stats: { entityCount, filingCount } });
    }
    default:
      return NextResponse.json({ error: '未知模块' }, { status: 404 });
  }
}
