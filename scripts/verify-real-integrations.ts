import fs from 'fs';
import path from 'path';

// Parse .env.local if present without external dependencies
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

import { verifyDatabaseHealth, getDatabaseEngine, isProductionEnvironment } from '../lib/db';
import { isEmailConfigured, getAppUrl } from '../lib/email';

async function main() {
  console.log('='.repeat(70));
  console.log('SHERLOX SIMPLIFIED INTEGRATION VERIFICATION REPORT');
  console.log('='.repeat(70));
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Environment: ${isProductionEnvironment() ? 'production' : 'development'}`);
  console.log(`App Base URL: ${getAppUrl()}`);
  console.log('');

  // 1. Database Engine & Connectivity
  console.log('[1/2] DATABASE ENGINE & HEALTH CHECK');
  const engine = getDatabaseEngine();
  console.log(`Active Engine: ${engine.toUpperCase()}`);
  if (process.env.DATABASE_URL) {
    const maskedUrl = process.env.DATABASE_URL.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:****@');
    console.log(`DATABASE_URL: ${maskedUrl}`);
  } else {
    console.log('DATABASE_URL is not set (using local SQLite storage in dev mode).');
  }

  try {
    const health = await verifyDatabaseHealth();
    console.log(`Database Health: ${health.healthy ? 'HEALTHY (OK)' : 'UNHEALTHY'}`);
    if (health.error) {
      console.log(`Health Error: ${health.error}`);
    }
  } catch (err: any) {
    console.log(`Health Probe Failed: ${err.message}`);
  }
  console.log('');

  // 2. Resend Email Dispatch Check
  console.log('[2/2] RESEND PASSWORD-RESET EMAIL CONFIGURATION');
  const resendApiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM;

  console.log(`RESEND_API_KEY: ${resendApiKey ? `Configured (${resendApiKey.slice(0, 6)}...)` : 'MISSING'}`);
  console.log(`EMAIL_FROM: ${emailFrom || 'Not configured (defaults to onboarding@resend.dev)'}`);
  console.log(`Email Service Active: ${isEmailConfigured() ? 'YES (Live API mode)' : 'NO (Dev terminal fallback)'}`);

  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/api-keys', {
        headers: { Authorization: `Bearer ${resendApiKey}` },
      });
      if (res.ok) {
        console.log('Resend API Connectivity: VERIFIED & AUTHENTICATED (200 OK)');
      } else {
        const body = await res.json().catch(() => ({}));
        console.log(`Resend API Connectivity: Key rejected with HTTP ${res.status}: ${JSON.stringify(body)}`);
      }
    } catch (e: any) {
      console.log(`Resend API Network Error: ${e.message}`);
    }
  } else {
    console.log('Status: RESEND_API_KEY not set. Password reset will log secure links locally in dev.');
  }
  console.log('');

  console.log('='.repeat(70));
  console.log('STATUS SUMMARY FOR /api/auth/status');
  console.log(`Database: ${engine === 'postgresql' ? 'connected in production' : (isProductionEnvironment() ? 'not configured' : 'working locally')}`);
  console.log(`Password Recovery: ${isEmailConfigured() ? 'Resend configured' : (isProductionEnvironment() ? 'not configured' : 'working locally')}`);
  console.log('='.repeat(70));
}

main().catch(console.error);
