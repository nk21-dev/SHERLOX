import { NextResponse } from 'next/server';
import { connection } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  await connection();
  // Accessing request URL ensures Next.js treats this as a dynamic request handler
  const _ = req.url;

  try {
    const sessionData = await getCurrentUser();
    if (!sessionData) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: sessionData.user.id,
          name: sessionData.user.name,
          email: sessionData.user.email,
          avatarUrl: sessionData.user.avatar_url,
        },
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    // If during build-time static evaluation cookies() rejects, return unauthenticated
    return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
  }
}
