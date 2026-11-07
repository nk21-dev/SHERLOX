import { NextResponse } from 'next/server';
import { connection } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { updateUserProfile } from '@/lib/db';

export async function GET(req: Request) {
  await connection();
  const _ = req.url;

  try {
    const sessionData = await getCurrentUser();
    if (!sessionData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: sessionData.user.id,
        name: sessionData.user.name,
        email: sessionData.user.email,
        avatarUrl: sessionData.user.avatar_url,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  await connection();

  try {
    const sessionData = await getCurrentUser();
    if (!sessionData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, avatarUrl } = body;

    const updates: { name?: string; avatarUrl?: string | null } = {};

    if (name !== undefined) {
      if (typeof name !== 'string') {
        return NextResponse.json({ error: 'Codename must be a string' }, { status: 400 });
      }
      const trimmedName = name.trim();
      if (!trimmedName || trimmedName.length < 2) {
        return NextResponse.json(
          { error: 'Agent codename must be at least 2 characters.' },
          { status: 400 }
        );
      }
      if (trimmedName.length > 50) {
        return NextResponse.json(
          { error: 'Agent codename cannot exceed 50 characters.' },
          { status: 400 }
        );
      }
      updates.name = trimmedName;
    }

    if (avatarUrl !== undefined) {
      if (avatarUrl === null) {
        updates.avatarUrl = null;
      } else if (typeof avatarUrl === 'string') {
        // Must be data URL or http/https URL
        if (
          !avatarUrl.startsWith('data:image/') &&
          !avatarUrl.startsWith('http://') &&
          !avatarUrl.startsWith('https://')
        ) {
          return NextResponse.json(
            { error: 'Invalid avatar image format.' },
            { status: 400 }
          );
        }
        // Limit string length to ~5MB
        if (avatarUrl.length > 5 * 1024 * 1024) {
          return NextResponse.json(
            { error: 'Avatar image payload too large (max 5MB).' },
            { status: 400 }
          );
        }
        updates.avatarUrl = avatarUrl;
      } else {
        return NextResponse.json(
          { error: 'Invalid avatarUrl type.' },
          { status: 400 }
        );
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No fields provided to update.' }, { status: 400 });
    }

    const updatedUser = await updateUserProfile(sessionData.user.id, updates);
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatarUrl: updatedUser.avatar_url,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  return PATCH(req);
}

export async function PUT(req: Request) {
  return PATCH(req);
}

