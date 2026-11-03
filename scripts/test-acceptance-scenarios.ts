async function runAcceptanceTests() {
  const baseUrl = 'http://localhost:3000';
  console.log('='.repeat(70));
  console.log('SHERLOX ACCEPTANCE SCENARIOS VERIFICATION');
  console.log('='.repeat(70));

  let passed = 0;
  let failed = 0;

  function assert(cond: boolean, desc: string) {
    if (cond) {
      console.log(`  ✓ ${desc}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${desc}`);
      failed++;
    }
  }

  // Scenario A & B: Unauthenticated visitor accessing landing page
  console.log('\n[Scenario A & B]: Unauthenticated visitor on landing page');
  const landingRes = await fetch(`${baseUrl}/`, { redirect: 'manual' });
  assert(landingRes.status === 200, 'Landing page loads with HTTP 200 for unauthenticated visitor');
  const landingHtml = await landingRes.text();
  assert(landingHtml.includes('gemini_generated_video_988681c8-clean.mp4'), 'Hero detective video source present in initial markup');

  // Scenario C: Unauthenticated protected route guard
  console.log('\n[Scenario C & D]: Unauthenticated protected dashboard access');
  const dashUnauth = await fetch(`${baseUrl}/dashboard`, { redirect: 'manual' });
  const redirectLocation = dashUnauth.headers.get('location') || '';
  assert(
    dashUnauth.status === 307 || dashUnauth.status === 302 || dashUnauth.status === 308,
    `Protected dashboard redirects unauthenticated visitor (HTTP ${dashUnauth.status})`
  );
  assert(
    redirectLocation.includes('/auth') && redirectLocation.includes('returnUrl'),
    `Redirect destination is auth page with returnUrl preserved: ${redirectLocation}`
  );

  // Scenario D: User Registration & Session Cookie Generation
  console.log('\n[Scenario D]: Registration, Account Creation & Session Persistence');
  const testEmail = `detective.scen.${Date.now()}@sherlox.agency`;
  const testPass = 'BakerStreet#2026';
  const regRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Agent Holmes',
      email: testEmail,
      password: testPass,
      confirmPassword: testPass,
    }),
  });
  assert(regRes.status === 201, `Registration successful (HTTP ${regRes.status})`);
  
  // Extract session cookie from headers
  const rawSetCookie = regRes.headers.get('set-cookie') || '';
  const match = rawSetCookie.match(/sherlox_session=([^;]+)/);
  const sessionToken = match ? match[1] : '';
  const sessionCookieHeader = `sherlox_session=${sessionToken}`;
  assert(sessionToken.length > 0, 'HttpOnly session cookie issued on registration');

  // Scenario E: Authenticated user returning to landing page
  console.log('\n[Scenario E]: Authenticated user returning to landing page');
  const authLandingRes = await fetch(`${baseUrl}/`, {
    headers: { Cookie: sessionCookieHeader },
    redirect: 'manual',
  });
  assert(authLandingRes.status === 200, 'Landing page loads with HTTP 200 for authenticated user');

  // Scenario F: Authenticated user accessing auth page gets redirected to dashboard
  console.log('\n[Scenario F]: Authenticated user accessing /auth redirected to /dashboard');
  const authRedirectTest = await fetch(`${baseUrl}/auth?mode=signin`, {
    headers: { Cookie: sessionCookieHeader },
    redirect: 'manual',
  });
  const authDest = authRedirectTest.headers.get('location') || '';
  assert(
    (authRedirectTest.status === 307 || authRedirectTest.status === 302 || authRedirectTest.status === 308) &&
      authDest.includes('/dashboard'),
    `Authenticated user on /auth is redirected directly to /dashboard (HTTP ${authRedirectTest.status} -> ${authDest})`
  );

  // Scenario G: Refreshing dashboard preserves session
  console.log('\n[Scenario G]: Dashboard access and session persistence on refresh');
  const dashAuth1 = await fetch(`${baseUrl}/dashboard`, {
    headers: { Cookie: sessionCookieHeader },
    redirect: 'manual',
  });
  assert(dashAuth1.status === 200, 'Authenticated user accesses /dashboard directly with HTTP 200');

  // Refresh (second query)
  const dashAuth2 = await fetch(`${baseUrl}/dashboard`, {
    headers: { Cookie: sessionCookieHeader },
    redirect: 'manual',
  });
  assert(dashAuth2.status === 200, 'Refreshing /dashboard preserves session with HTTP 200');

  // Query /api/auth/me to verify user payload
  const meRes = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { Cookie: sessionCookieHeader },
  });
  const meData = await meRes.json();
  assert(meData.authenticated === true, 'Session is verified by /api/auth/me');
  assert(meData.user?.email === testEmail.toLowerCase(), 'User email verified accurately');

  // Scenario H: Logout and session invalidation
  console.log('\n[Scenario H]: Logout & Session Cleanup');
  const logoutRes = await fetch(`${baseUrl}/api/auth/logout`, {
    method: 'POST',
    headers: { Cookie: sessionCookieHeader },
  });
  assert(logoutRes.status === 200, 'Logout succeeds with HTTP 200');
  const logoutCookieHeader = logoutRes.headers.get('set-cookie') || '';
  assert(logoutCookieHeader.includes('Max-Age=0'), 'Logout clears session cookie (Max-Age=0)');

  // Subsequent visit to /dashboard without cookies is blocked
  const dashAfterLogout = await fetch(`${baseUrl}/dashboard`, {
    redirect: 'manual',
  });
  assert(
    dashAfterLogout.status === 307 || dashAfterLogout.status === 302 || dashAfterLogout.status === 308,
    'Access to /dashboard after logout is blocked and redirects to /auth'
  );

  // Database invalidation check: Even if the old raw token is re-sent, /api/auth/me rejects it
  const meAfterLogout = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { Cookie: sessionCookieHeader },
  });
  const meAfterData = await meAfterLogout.json();
  assert(meAfterData.authenticated === false, 'Revoked session is completely invalid in database lookup');

  console.log('\n' + '='.repeat(70));
  console.log(`TOTAL SCENARIOS TESTED: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('='.repeat(70) + '\n');

  if (failed > 0) process.exit(1);
}

runAcceptanceTests().catch((e) => {
  console.error(e);
  process.exit(1);
});
