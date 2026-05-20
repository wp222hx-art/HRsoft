import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, signSession, setSessionCookie } from '@/lib/auth';
import { rewardTokens } from '@/lib/token';
import {
  PORTALS, PRO_TYPES, SME_TYPES, PERSONAS, JURISDICTIONS,
  type Portal, type ProType, type SmeType, type Persona, type Jurisdiction,
} from '@/lib/enums';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const {
    email, password, name, portal, proType, smeType, aiPersona,
    companyName, jurisdiction,
  } = body as {
    email: string; password: string; name: string;
    portal: Portal; proType?: ProType; smeType?: SmeType; aiPersona?: Persona;
    companyName?: string; jurisdiction?: Jurisdiction;
  };

  if (!email || !password || !name)              return NextResponse.json({ error: '请填写完整信息' }, { status: 400 });
  if (!PORTALS.includes(portal))                  return NextResponse.json({ error: '门户类型无效' }, { status: 400 });
  if (portal === 'PRO' && !PRO_TYPES.includes(proType as ProType))
                                                  return NextResponse.json({ error: '请选择服务商类型' }, { status: 400 });
  if (portal === 'SME' && !SME_TYPES.includes(smeType as SmeType))
                                                  return NextResponse.json({ error: '请选择企业类型' }, { status: 400 });

  const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (exists) return NextResponse.json({ error: '该邮箱已注册' }, { status: 409 });

  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(), name, portal,
      passwordHash: await hashPassword(password),
      proType: portal === 'PRO' ? proType : undefined,
      smeType: portal === 'SME' ? smeType : undefined,
      aiPersona: portal === 'SME' && aiPersona && PERSONAS.includes(aiPersona) ? aiPersona : undefined,
    },
  });

  // SME signups can optionally onboard their first entity
  if (portal === 'SME' && companyName && jurisdiction && JURISDICTIONS.includes(jurisdiction)) {
    await prisma.entity.create({
      data: {
        legalName: companyName, jurisdiction,
        ownerId: user.id, passportCountries: jurisdiction,
        hcs: 85, hcsState: 'HEALTHY',
      },
    });
  }

  // Onboarding token reward (doc §1.5 Token economy)
  await rewardTokens(user.id, 100, '🎉 首次注册 SiNova');

  const token = await signSession({ uid: user.id, email: user.email, portal: user.portal as Portal, name: user.name });
  await setSessionCookie(token);

  return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name, portal: user.portal }});
}
