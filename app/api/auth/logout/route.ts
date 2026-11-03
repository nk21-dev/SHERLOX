import { NextResponse } from 'next/server';
import { destroyCurrentSession, clearSessionCookie } from '@/lib/auth';

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

    clearSessionCookie(response);
    return response;
  } catch (err) {
    console.error('[SHERLOX LOGOUT ERROR]:', err);
    const response = NextResponse.json({ success: true, redirectTo: '/' });
    clearSessionCookie(response);
    return response;
  }
}

