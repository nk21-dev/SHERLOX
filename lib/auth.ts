import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { connection, NextResponse } from 'next/server';
import {
  createSession,
  findSessionByTokenHash,
  deleteSessionByTokenHash,
} from './db';
import { User, Session } from './db/types';

export const SESSION_COOKIE_NAME = 'sherlox_session';
export const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

// ----------------------------------------------------
// CRYPTOGRAPHY & PASSWORDS
// ----------------------------------------------------

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateSecureToken(byteLength = 32): string {
  return crypto.randomBytes(byteLength).toString('hex');
}

// ----------------------------------------------------
// VALIDATION
// ----------------------------------------------------

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim()) && email.length <= 254;
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Clearance passcode is required.' };
  }
  if (password.length < 8) {
    return { valid: false, message: 'Passcode must be at least 8 characters in length.' };
  }
  if (!/[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return {
      valid: false,
      message: 'Passcode must contain at least one numeral or symbol.',
    };
  }
  return { valid: true };
}

// ----------------------------------------------------
// SESSION MANAGEMENT
// ----------------------------------------------------

export async function createAuthSession(
  userId: string,
  meta?: { ipAddress?: string | null; userAgent?: string | null }
): Promise<{ rawToken: string; session: Session }> {
  const rawToken = generateSecureToken(32);
  const tokenHash = hashToken(rawToken);
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;

  const session = await createSession({
    userId,
    tokenHash,
    expiresAt,
    ipAddress: meta?.ipAddress,
    userAgent: meta?.userAgent,
  });

  return { rawToken, session };
}

export async function getCurrentUser(): Promise<{ user: User; session: Session } | null> {
  try {
    try {
      await connection();
    } catch {
      // In non-Next.js or testing contexts, continue gracefully
    }
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!sessionCookie || !sessionCookie.value) return null;

    const tokenHash = hashToken(sessionCookie.value);
    const sessionWithUser = await findSessionByTokenHash(tokenHash);

    if (!sessionWithUser) return null;

    // Check expiration
    if (sessionWithUser.expires_at < Date.now()) {
      await deleteSessionByTokenHash(tokenHash);
      return null;
    }

    return {
      user: sessionWithUser.user,
      session: {
        id: sessionWithUser.id,
        user_id: sessionWithUser.user_id,
        token_hash: sessionWithUser.token_hash,
        expires_at: sessionWithUser.expires_at,
        created_at: sessionWithUser.created_at,
        ip_address: sessionWithUser.ip_address,
        user_agent: sessionWithUser.user_agent,
      },
    };
  } catch (err: unknown) {
    if (
      (err as { digest?: string })?.digest?.includes('HANGING_PROMISE_REJECTION') ||
      (err as { digest?: string })?.digest?.includes('DYNAMIC_SERVER_USAGE')
    ) {
      throw err;
    }
    console.error('[SHERLOX AUTH ERROR] Failed to get current user:', err);
    return null;
  }
}

export async function destroyCurrentSession(): Promise<void> {
  try {
    try {
      await connection();
    } catch {
      // Gracefully continue
    }
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (sessionCookie?.value) {
      const tokenHash = hashToken(sessionCookie.value);
      await deleteSessionByTokenHash(tokenHash);
    }
  } catch (err) {
    console.error('[SHERLOX AUTH ERROR] Failed to destroy session:', err);
  }
}

export function buildSessionCookieHeader(token: string): string {
  const isProd = process.env.NODE_ENV === 'production';
  return `${SESSION_COOKIE_NAME}=${token}; Path=/; Max-Age=${SESSION_MAX_AGE}; HttpOnly; SameSite=Lax${
    isProd ? '; Secure' : ''
  }`;
}

export function buildClearSessionCookieHeader(): string {
  const isProd = process.env.NODE_ENV === 'production';
  return `${SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${
    isProd ? '; Secure' : ''
  }`;
}

export function setSessionCookie(response: NextResponse, token: string): void {
  const isProd = process.env.NODE_ENV === 'production';
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

export function clearSessionCookie(response: NextResponse): void {
  const isProd = process.env.NODE_ENV === 'production';
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    maxAge: 0,
    path: '/',
  });
}

