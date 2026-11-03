import { NextResponse } from 'next/server';
import { destroyCurrentSession, buildClearSessionCookieHeader } from '@/lib/auth';

export async function POST() {
  try {
    await destroyCurrentSession();

    const response = NextResponse.json(
      {
        success: true,
        redirectTo: '/',
      },
      { status: 200 }
    );

    response.headers.set('Set-Cookie', buildClearSessionCookieHeader());
    return response;
  } catch (err) {
    console.error('[SHERLOX LOGOUT ERROR]:', err);
    const response = NextResponse.json({ success: true, redirectTo: '/' });
    response.headers.set('Set-Cookie', buildClearSessionCookieHeader());
    return response;
  }
}

