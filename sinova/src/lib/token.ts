// $NOVA Token — off-chain ledger for the demo.
// Real product would deploy ERC-20 on Polygon (doc §1.4 NovaChain).
import { prisma } from './db';

export async function rewardTokens(userId: string, delta: number, reason: string) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: userId },
      data:  { novaTokens: { increment: delta } },
    });
    await tx.tokenLedgerEntry.create({
      data: { userId, delta, reason },
    });
    return user.novaTokens;
  });
}

export async function getBalance(userId: string): Promise<number> {
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { novaTokens: true },
  });
  return u?.novaTokens ?? 0;
}

export async function getLedger(userId: string, take = 20) {
  return prisma.tokenLedgerEntry.findMany({
    where:   { userId },
    orderBy: { createdAt: 'desc' },
    take,
  });
}
