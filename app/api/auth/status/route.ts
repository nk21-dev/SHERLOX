import { NextResponse } from 'next/server';
import { connection } from 'next/server';
import { verifyDatabaseHealth, isProductionEnvironment } from '@/lib/db';
import { isEmailConfigured } from '@/lib/email';

export async function GET() {
  await connection();

  try {
    const isProd = isProductionEnvironment();

    // 1. Database Status
    let databaseStatus: 'working locally' | 'connected in production' | 'not configured';
    try {
      const dbHealth = await verifyDatabaseHealth();
      if (dbHealth.healthy) {
        if (dbHealth.engine === 'postgresql') {
          databaseStatus = 'connected in production';
        } else {
          databaseStatus = isProd ? 'not configured' : 'working locally';
        }
      } else {
        databaseStatus = 'not configured';
      }
    } catch {
      databaseStatus = 'not configured';
    }

    // 2. Password Recovery Status
    let passwordRecoveryStatus: 'working locally' | 'Resend configured' | 'not configured';
    if (isEmailConfigured()) {
      passwordRecoveryStatus = 'Resend configured';
    } else if (!isProd) {
      passwordRecoveryStatus = 'working locally';
    } else {
      passwordRecoveryStatus = 'not configured';
    }

    return NextResponse.json(
      {
        database: databaseStatus,
        passwordRecovery: passwordRecoveryStatus,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error('[/api/auth/status error]:', err);
    return NextResponse.json(
      {
        error: 'Failed to inspect integration health.',
      },
      { status: 500 }
    );
  }
}
