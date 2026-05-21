// JWT-based session for SiNova. Uses `jose` (Edge-friendly) and bcryptjs.
// Sessions live in HTTP-only cookies, signed with JWT_SECRET.
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { prisma } from './db';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'sinova-dev-secret-change-me'
);
const COOKIE_NAME = 'sinova_session';
const SESSION_DAYS = 7;

export type SessionPayload = {
  uid:    string;
  email:  string;
  portal: 'PRO' | 'SME' | 'ADMIN';
  name:   string;
};

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(SECRET);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  cookies().set({
    name:     COOKIE_NAME,
    value:    token,
    httpOnly: true,
    sameSite: 'lax',
    path:     '/',
    maxAge:   SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function clearSessionCookie() {
  cookies().delete(COOKIE_NAME);
}

export async function getCurrentUser() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = await verifySession(token);
  if (!payload) return null;
  const user = await prisma.user.findUnique({ where: { id: payload.uid } });
  return user;
}

export const SESSION_COOKIE = COOKIE_NAME;
