// Edge middleware — light auth gate for portal pages.
// API routes do their own auth via cookies (no edge runtime needed there).
import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'sinova-dev-secret-change-me'
);

const PROTECTED_PREFIXES = ['/pro', '/sme', '/admin'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }
  const token = req.cookies.get('sinova_session')?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
  try {
    const { payload } = await jwtVerify(token, SECRET);
    const portal = (payload as Record<string, unknown>).portal as string;
    // Cross-portal access guard
    if (pathname.startsWith('/pro')   && portal !== 'PRO'   && portal !== 'ADMIN') {
      return NextResponse.redirect(new URL('/sme', req.url));
    }
    if (pathname.startsWith('/sme')   && portal !== 'SME'   && portal !== 'ADMIN') {
      return NextResponse.redirect(new URL('/pro', req.url));
    }
    return NextResponse.next();
  } catch {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/pro/:path*', '/sme/:path*', '/admin/:path*'],
};
