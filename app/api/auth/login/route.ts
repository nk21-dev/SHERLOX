import { NextResponse } from 'next/server';
import {
  isValidEmail,
  verifyPassword,
  createAuthSession,
  buildSessionCookieHeader,
} from '@/lib/auth';
import { findUserByEmail } from '@/lib/db';
import { checkRateLimit, resetRateLimit, getClientIp } from '@/lib/rateLimit';

// Dummy hash for constant-time comparison when user doesn't exist
const DUMMY_HASH = '$2a$12$e8p4iT7hQ0Zg0Kj6O9b8y.uY4OaU4eK1Wq7r2s8t9u0v1w2x3y4z5';

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
    }

    const { email, password } = body;

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid agent email address.' }, { status: 400 });
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Clearance passcode is required.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check brute-force rate limit (per IP + email)
    const rateLimitKey = `login:${ip}:${normalizedEmail}`;
    const rateCheck = checkRateLimit({
      key: rateLimitKey,
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000, // 5 attempts per 15 mins
    });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Multiple invalid clearance attempts detected. Access suspended for ${rateCheck.resetInSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    // Lookup user
    const user = await findUserByEmail(normalizedEmail);

    if (!user || !user.password_hash) {
      // Execute dummy verify to protect against timing analysis
      await verifyPassword(password, DUMMY_HASH);
      return NextResponse.json(
        { error: 'Invalid agent email or clearance passcode.' },
        { status: 401 }
      );
    }

    const isMatch = await verifyPassword(password, user.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid agent email or clearance passcode.' },
        { status: 401 }
      );
    }

    // Reset rate limiter on successful authentication
    resetRateLimit(rateLimitKey);

    // Create session
    const userAgent = req.headers.get('user-agent');
    const { rawToken } = await createAuthSession(user.id, {
      ipAddress: ip,
      userAgent,
    });

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        redirectTo: '/dashboard',
      },
      { status: 200 }
    );

    response.headers.set('Set-Cookie', buildSessionCookieHeader(rawToken));
    return response;
  } catch (err) {
    console.error('[SHERLOX LOGIN ERROR]:', err);
    return NextResponse.json(
      { error: 'Bureau authorization terminal error. Please try again.' },
      { status: 500 }
    );
  }
}

