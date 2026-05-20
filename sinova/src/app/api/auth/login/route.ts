import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword, signSession, setSessionCookie } from '@/lib/auth';
import type { Portal } from '@/lib/enums';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json().catch(() => ({}));
  if (!email || !password) {
    return NextResponse.json({ error: 'email & password required' }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { email: String(email).toLowerCase() } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 });
  }
  const token = await signSession({
    uid: user.id, email: user.email, portal: user.portal as Portal, name: user.name,
  });
  await setSessionCookie(token);
  return NextResponse.json({
    ok: true,
    user: { id: user.id, email: user.email, name: user.name, portal: user.portal },
  });
}
