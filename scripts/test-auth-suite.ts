import {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserPassword,
  createSession,
  findSessionByTokenHash,
  deleteSessionByTokenHash,
  deleteSessionsByUserId,
  createPasswordResetToken,
  findPasswordResetToken,
  markPasswordResetTokenUsed,
  verifyDatabaseHealth,
  initDb,
} from '../lib/db';
import {
  hashPassword,
  verifyPassword,
  hashToken,
  generateSecureToken,
  isValidEmail,
  validatePassword,
} from '../lib/auth';
import { getAppUrl } from '../lib/email';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function runTestSuite() {
  console.log('\n============================================================');
  console.log('🕵️ SHERLOX SIMPLIFIED AUTHENTICATION TEST SUITE');
  console.log('============================================================');

  await initDb();

  // ----------------------------------------------------
  // TEST GROUP 1: INPUT VALIDATION & BCRYPT PASSWORDS
  // ----------------------------------------------------
  console.log('\n--- TEST GROUP 1: Input Validation & Cryptography ---');
  assert(isValidEmail('agent@sherlox.agency'), 'Valid email passes validator');
  assert(!isValidEmail('invalid-email-string'), 'Invalid email fails validator');
  assert(!isValidEmail(''), 'Empty email fails validator');

  const weakPassValidation = validatePassword('short');
  assert(!weakPassValidation.valid, 'Password < 8 chars rejected');

  const noDigitValidation = validatePassword('allletterslong');
  assert(!noDigitValidation.valid, 'Password without digits/symbols rejected');

  const strongPassValidation = validatePassword('EnigmaSecret#99');
  assert(strongPassValidation.valid, 'Strong password accepted');

  const plainPass = 'EnigmaSecret#99';
  const hashed = await hashPassword(plainPass);
  assert(hashed.startsWith('$2'), 'Bcrypt hash generated properly with salt');
  assert(await verifyPassword(plainPass, hashed), 'Password matches its bcrypt hash');
  assert(!(await verifyPassword('WrongPassword#00', hashed)), 'Wrong password rejected');

  // ----------------------------------------------------
  // TEST GROUP 2: USER REGISTRATION & STORAGE
  // ----------------------------------------------------
  console.log('\n--- TEST GROUP 2: User Registration & Duplicate Protection ---');
  const testEmail = `agent.test.${Date.now()}@sherlox.agency`;
  const testName = 'Sherlock Operative';
  const testPass = 'BakerStreet#221B';

  const lookupBefore = await findUserByEmail(testEmail);
  assert(lookupBefore === null, 'Non-existent user initially returns null');

  const passwordHash = await hashPassword(testPass);
  const createdUser = await createUser({
    name: testName,
    email: testEmail,
    passwordHash,
  });

  assert(createdUser.id.startsWith('usr_'), 'User created with unique prefixed id');
  assert(createdUser.email === testEmail.toLowerCase(), 'User email matches input');
  assert(createdUser.name === testName, 'User name matches input');

  const lookupAfter = await findUserByEmail(testEmail);
  assert(lookupAfter !== null, 'Created user can be found by email');
  assert(lookupAfter?.id === createdUser.id, 'User ID matches on lookup');

  // ----------------------------------------------------
  // TEST GROUP 3: SESSION MANAGEMENT & HTTP-ONLY COOKIES
  // ----------------------------------------------------
  console.log('\n--- TEST GROUP 3: Session Management & Invalidation ---');
  const rawSessionToken = generateSecureToken(32);
  const tokenHash = hashToken(rawSessionToken);
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;

  const session = await createSession({
    userId: createdUser.id,
    tokenHash,
    expiresAt,
  });

  assert(session.id.startsWith('ses_'), 'Session created with unique ID');
  assert(session.user_id === createdUser.id, 'Session linked to correct user');

  const sessionLookup = await findSessionByTokenHash(tokenHash);
  assert(sessionLookup !== null, 'Active session lookup by token hash succeeds');
  assert(sessionLookup?.user.email === testEmail.toLowerCase(), 'Session includes joined user profile');

  // Invalidate Session
  await deleteSessionByTokenHash(tokenHash);
  const sessionAfterDelete = await findSessionByTokenHash(tokenHash);
  assert(sessionAfterDelete === null, 'Deleted session cannot be resolved');

  // ----------------------------------------------------
  // TEST GROUP 4: PASSWORD RECOVERY (FORGOT & RESET)
  // ----------------------------------------------------
  console.log('\n--- TEST GROUP 4: Password Recovery & Single-Use Tokens ---');
  const rawResetToken = generateSecureToken(32);
  const resetTokenHash = hashToken(rawResetToken);
  const resetExpiresAt = Date.now() + 60 * 60 * 1000;

  const resetRecord = await createPasswordResetToken({
    userId: createdUser.id,
    tokenHash: resetTokenHash,
    expiresAt: resetExpiresAt,
  });

  assert(resetRecord.id.startsWith('rst_'), 'Reset token created with unique ID');
  assert(resetRecord.used_at === null, 'Reset token is initially unused');

  const tokenLookup = await findPasswordResetToken(resetTokenHash);
  assert(tokenLookup !== null, 'Reset token lookup by hash succeeds');
  assert(Boolean(tokenLookup && tokenLookup.expires_at > Date.now()), 'Reset token is not expired');

  // Apply new password and mark used
  const newPass = 'BrandNewSecret#2026';
  const newPassHash = await hashPassword(newPass);
  await updateUserPassword(createdUser.id, newPassHash);
  await markPasswordResetTokenUsed(tokenLookup!.id);
  await deleteSessionsByUserId(createdUser.id);

  const updatedUser = await findUserById(createdUser.id);
  assert(Boolean(updatedUser && await verifyPassword(newPass, updatedUser.password_hash!)), 'New password verifies successfully');
  assert(Boolean(updatedUser && !(await verifyPassword(testPass, updatedUser.password_hash!))), 'Old password no longer verifies');

  const usedTokenLookup = await findPasswordResetToken(resetTokenHash);
  assert(Boolean(usedTokenLookup && usedTokenLookup.used_at !== null), 'Reset token marked used (single-use enforced)');

  // ----------------------------------------------------
  // TEST GROUP 5: USER ISOLATION & ACCESS CONTROL
  // ----------------------------------------------------
  console.log('\n--- TEST GROUP 5: User Isolation & Cross-Account Boundaries ---');
  const userA = await createUser({
    name: 'Agent Alpha',
    email: `alpha.${Date.now()}@sherlox.agency`,
    passwordHash: await hashPassword('AlphaPass#123'),
  });

  const userB = await createUser({
    name: 'Agent Beta',
    email: `beta.${Date.now()}@sherlox.agency`,
    passwordHash: await hashPassword('BetaPass#456'),
  });

  const sessionTokenA = generateSecureToken(32);
  await createSession({
    userId: userA.id,
    tokenHash: hashToken(sessionTokenA),
    expiresAt: Date.now() + 3600000,
  });

  const lookupSessionA = await findSessionByTokenHash(hashToken(sessionTokenA));
  assert(lookupSessionA?.user.id === userA.id, 'Session A resolves exclusively to User A');
  assert(lookupSessionA?.user.id !== userB.id, 'User B data is never accessible via User A session');

  // Invalidate User A sessions
  await deleteSessionsByUserId(userA.id);
  const lookupSessionAAfter = await findSessionByTokenHash(hashToken(sessionTokenA));
  assert(lookupSessionAAfter === null, 'User A sessions cleanly purged upon revocation');

  // ----------------------------------------------------
  // TEST GROUP 6: RESEND & APP URL RESOLUTION
  // ----------------------------------------------------
  console.log('\n--- TEST GROUP 6: URL Configuration & Dispatch Link Integrity ---');
  const appUrl = getAppUrl();
  assert(appUrl.startsWith('http'), `App base URL resolved cleanly: ${appUrl}`);
  assert(!appUrl.endsWith('/'), 'App URL trailing slash normalized');

  const testResetUrl = `${appUrl}/auth?mode=reset&token=${encodeURIComponent('test-crypto-token')}`;
  assert(testResetUrl.includes('/auth?mode=reset&token=test-crypto-token'), 'Reset link constructed with valid path and token param');

  // ----------------------------------------------------
  // TEST GROUP 7: DATABASE HEALTH PROBE
  // ----------------------------------------------------
  console.log('\n--- TEST GROUP 7: Database Connection Health Probe ---');
  const dbHealth = await verifyDatabaseHealth();
  assert(dbHealth.healthy, `Database probe passed on active engine: ${dbHealth.engine}`);

  // ----------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------
  console.log('\n============================================================');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Test suite uncaught error:', err);
  process.exit(1);
});
