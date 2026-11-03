import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie = req.cookies.get('sherlox_session');
  const hasSession = Boolean(sessionCookie?.value);

  // 1. Protect dashboard route from unauthenticated direct visits
  if (pathname.startsWith('/dashboard')) {
    if (!hasSession) {
      const loginUrl = new URL('/auth', req.url);
      loginUrl.searchParams.set('mode', 'signin');
      loginUrl.searchParams.set('returnUrl', '/dashboard');
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Redirect authenticated users away from auth pages to their dashboard
  if (pathname.startsWith('/auth')) {
    const mode = req.nextUrl.searchParams.get('mode') || 'signin';
    // Only redirect away from login/signup, allow forgot/reset workflows
    if (hasSession && (mode === 'signin' || mode === 'signup')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth'],
};
