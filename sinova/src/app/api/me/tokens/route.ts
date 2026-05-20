import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getBalance, getLedger } from '@/lib/token';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 });
  const balance = await getBalance(user.id);
  const ledger = await getLedger(user.id, 30);
  return NextResponse.json({ balance, ledger });
}
