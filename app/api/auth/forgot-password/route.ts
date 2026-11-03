import { NextResponse } from 'next/server';
import { connection } from 'next/server';
import { isValidEmail, generateSecureToken, hashToken } from '@/lib/auth';
import { findUserByEmail, createPasswordResetToken } from '@/lib/db';
import { sendPasswordResetEmail, isEmailConfigured } from '@/lib/email';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(req: Request) {
  await connection();
  try {
    const ip = getClientIp(req);
    const body = await req.json().catch(() => null);

    if (!body || !body.email) {
      return NextResponse.json({ error: 'Agent email address is required.' }, { status: 400 });
    }

    const { email } = body;

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid agent email address.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Rate limiting: 3 reset attempts per 15 minutes per IP + email
    const rateCheck = checkRateLimit({
      key: `forgot:${ip}:${normalizedEmail}`,
      maxAttempts: 3,
      windowMs: 15 * 60 * 1000,
    });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Multiple reset requests detected. Please standby for ${rateCheck.resetInSeconds} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    const isProd = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
    if (isProd && !isEmailConfigured()) {
      return NextResponse.json(
        {
          error: 'Bureau email dispatch service is not configured on this server. Please contact administrator.',
        },
        { status: 503 }
      );
    }

    const user = await findUserByEmail(normalizedEmail);

    if (user) {
      const rawToken = generateSecureToken(32);
      const tokenHash = hashToken(rawToken);
      const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

      await createPasswordResetToken({
        userId: user.id,
        tokenHash,
        expiresAt,
      });

      const emailResult = await sendPasswordResetEmail({
        toEmail: user.email,
        userName: user.name,
        rawToken,
      });

      if (!emailResult.success) {
        return NextResponse.json(
          { error: emailResult.error || 'Failed to dispatch clearance recovery email.' },
          { status: 502 }
        );
      }
    }

    // Return generic success to prevent email enumeration
    return NextResponse.json(
      {
        success: true,
        message: 'If an operative account exists with that email address, a clearance recovery dispatch has been transmitted.',
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[SHERLOX FORGOT-PASSWORD ERROR]:', err);
    return NextResponse.json(
      { error: 'Failed to process clearance dispatch request. Please try again.' },
      { status: 500 }
    );
  }
}
