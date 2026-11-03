import { NextResponse } from 'next/server';
import {
  isValidEmail,
  validatePassword,
  hashPassword,
  createAuthSession,
  buildSessionCookieHeader,
  setSessionCookie,
} from '@/lib/auth';
import { findUserByEmail, createUser } from '@/lib/db';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit({
      key: `register:${ip}`,
      maxAttempts: 10,
      windowMs: 60 * 60 * 1000, // 10 attempts per hour
    });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many registration attempts from this terminal. Please standby for ${rateCheck.resetInSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
    }

    const { name, email, password, confirmPassword } = body;

    // Field presence checks
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Agent call-sign or name is required.' }, { status: 400 });
    }

    if (name.trim().length < 2) {
      return NextResponse.json({ error: 'Call-sign must contain at least 2 characters.' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid agent email address.' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passcodes do not match. Please verify both entries.' }, { status: 400 });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json({ error: passwordValidation.message }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check existing account
    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) {
      return NextResponse.json(
        {
          error: 'An operative account with this email address already exists in the Bureau records.',
        },
        { status: 409 }
      );
    }

    // Hash password & save user
    const passwordHash = await hashPassword(password);
    const newUser = await createUser({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    // Establish authenticated session
    const userAgent = req.headers.get('user-agent');
    const { rawToken } = await createAuthSession(newUser.id, {
      ipAddress: ip,
      userAgent,
    });

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
        redirectTo: '/dashboard',
      },
      { status: 201 }
    );

    setSessionCookie(response, rawToken);
    return response;
  } catch (err) {
    console.error('[SHERLOX REGISTER ERROR]:', err);
    return NextResponse.json(
      { error: 'Bureau database could not register credentials. Please try again.' },
      { status: 500 }
    );
  }
}

