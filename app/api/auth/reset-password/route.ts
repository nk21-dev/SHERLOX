import { NextResponse } from 'next/server';
import { hashToken, validatePassword, hashPassword } from '@/lib/auth';
import {
  findPasswordResetToken,
  markPasswordResetTokenUsed,
  updateUserPassword,
  deleteSessionsByUserId,
} from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
    }

    const { token, password, confirmPassword } = body;

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Missing recovery token.' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passcodes do not match. Please re-enter.' }, { status: 400 });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json({ error: passwordValidation.message }, { status: 400 });
    }

    const tokenHash = hashToken(token.trim());
    const resetRecord = await findPasswordResetToken(tokenHash);

    if (!resetRecord) {
      return NextResponse.json(
        { error: 'Clearance recovery link is invalid or unrecognized.' },
        { status: 400 }
      );
    }

    if (resetRecord.used_at !== null) {
      return NextResponse.json(
        { error: 'Clearance recovery link has already been used. Please request a new link.' },
        { status: 400 }
      );
    }

    if (resetRecord.expires_at < Date.now()) {
      return NextResponse.json(
        { error: 'Clearance recovery link has expired. Please request a new recovery dispatch.' },
        { status: 400 }
      );
    }

    // Update password
    const newPasswordHash = await hashPassword(password);
    await updateUserPassword(resetRecord.user_id, newPasswordHash);

    // Mark token as used
    await markPasswordResetTokenUsed(resetRecord.id);

    // Invalidate existing sessions for security
    await deleteSessionsByUserId(resetRecord.user_id);

    return NextResponse.json(
      {
        success: true,
        message: 'Passcode successfully updated. Please sign in with your new credentials.',
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[SHERLOX RESET-PASSWORD ERROR]:', err);
    return NextResponse.json(
      { error: 'Failed to update clearance passcode. Please try again.' },
      { status: 500 }
    );
  }
}

