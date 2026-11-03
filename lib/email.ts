export function getAppUrl(): string {
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/$/, '');
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`;
  }
  return 'http://localhost:3000';
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY || process.env.EMAIL_PROVIDER_API_KEY);
}

export async function sendPasswordResetEmail(params: {
  toEmail: string;
  userName: string;
  rawToken: string;
}): Promise<{ success: boolean; error?: string }> {
  const { toEmail, userName, rawToken } = params;
  const baseUrl = getAppUrl();
  const resetUrl = `${baseUrl}/auth?mode=reset&token=${encodeURIComponent(rawToken)}`;

  const isProd = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
  const apiKey = process.env.RESEND_API_KEY || process.env.EMAIL_PROVIDER_API_KEY;
  const fromEmail =
    process.env.EMAIL_FROM || 'SHERLOX Bureau <onboarding@resend.dev>';

  // In production, real email delivery via Resend is strictly required
  if (isProd && !apiKey) {
    console.error(
      '[SHERLOX EMAIL ERROR] Production deployment lacks RESEND_API_KEY. Refusing to fake dispatch.'
    );
    return {
      success: false,
      error: 'Bureau email service is not configured on this server. Please contact administrator.',
    };
  }

  // HTML Noir Template matching SHERLOX Aesthetic
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SHERLOX Clearance Recovery</title>
</head>
<body style="background-color: #000000; color: #e4e4e7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 20px; margin: 0;">
  <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #09090b; border: 1px solid #27272a; border-radius: 16px; padding: 32px;">
    <tr>
      <td>
        <div style="font-size: 22px; font-weight: bold; color: #ffffff; letter-spacing: -0.5px; margin-bottom: 4px;">
          SHERLOX
        </div>
        <div style="font-size: 11px; font-family: monospace; color: #ef4444; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 24px;">
          CLASSIFIED // CLEARANCE DISPATCH
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #d4d4d8; margin: 0 0 16px 0;">
          Agent <strong>${escapeHtml(userName)}</strong>,
        </p>

        <p style="font-size: 13px; line-height: 1.6; color: #a1a1aa; margin: 0 0 24px 0;">
          A clearance passcode reset request was initiated for your operative account. To re-establish your secure access to the Bureau dossiers, authorize your identity using the encrypted link below:
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="display: inline-block; background-color: #dc2626; color: #ffffff; font-size: 13px; font-weight: 600; text-decoration: none; padding: 12px 28px; border-radius: 10px; letter-spacing: 0.5px; box-shadow: 0 0 20px rgba(220, 38, 38, 0.4);">
            RE-ESTABLISH CLEARANCE &rarr;
          </a>
        </div>

        <p style="font-size: 11px; font-family: monospace; color: #71717a; line-height: 1.5; margin: 0 0 16px 0;">
          This link will expire in 60 minutes and can only be utilized once. If you did not initiate this request, discard this dispatch immediately. Your current credentials remain intact.
        </p>

        <hr style="border: none; border-top: 1px solid #27272a; margin: 24px 0;" />

        <div style="font-size: 10px; font-family: monospace; color: #52525b; text-align: center;">
          SHERLOX INTELLIGENCE BUREAU &bull; DIRECT CONSOLE ACCESS
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  // If Resend API Key is provided, dispatch via Resend REST API
  if (apiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          subject: '[SHERLOX] Clearance Passcode Recovery Dispatch',
          html: htmlContent,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        console.error('[SHERLOX EMAIL ERROR] Provider failed:', errorData?.message || res.status);
        return {
          success: false,
          error: errorData?.message || 'Email provider rejected dispatch transmission.',
        };
      }

      return { success: true };
    } catch (err: unknown) {
      console.error('[SHERLOX EMAIL EXCEPTION]: Network error communicating with email provider');
      return { success: false, error: 'Network communication failure with email dispatch provider.' };
    }
  }

  // Development Only: Log simulation link to terminal for local developer testing
  if (!isProd) {
    console.log('\n============================================================');
    console.log('🕵️ [SHERLOX DISPATCH CONSOLE SIMULATOR — LOCAL DEV ONLY]');
    console.log(`To: ${toEmail} (Agent ${userName})`);
    console.log(`Action: Password Reset Requested`);
    console.log(`Clearance Link:`);
    console.log(resetUrl);
    console.log('============================================================\n');
  }

  return { success: true };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
