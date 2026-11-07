import { createUser, updateUserProfile, createSession, findSessionByTokenHash, findUserById } from '../lib/db';
import { hashToken } from '../lib/auth';

async function testProfileUpdates() {
  console.log('='.repeat(60));
  console.log('TESTING USER PROFILE & AVATAR PERSISTENCE');
  console.log('='.repeat(60));

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

  const testEmail = `agent.test.${Date.now()}@sherlox.bureau`;
  const initialName = 'Agent Original';
  const initialUser = await createUser({
    name: initialName,
    email: testEmail,
    passwordHash: 'hashed_pw_test',
  });

  assert(initialUser.name === initialName, 'User created with initial name');
  assert(initialUser.avatar_url === null, 'Initial avatar_url is null');

  // Test updating name
  const updatedName = 'Agent Sherlock Vance';
  const afterNameUpdate = await updateUserProfile(initialUser.id, { name: updatedName });
  assert(afterNameUpdate?.name === updatedName, 'updateUserProfile updates name in DB');

  // Verify DB read returns updated name
  const rereadUser = await findUserById(initialUser.id);
  assert(rereadUser?.name === updatedName, 'findUserById reflects updated name');

  // Test updating avatar with a mock data URL
  const mockAvatar = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...';
  const afterAvatarUpdate = await updateUserProfile(initialUser.id, { avatarUrl: mockAvatar });
  assert(afterAvatarUpdate?.avatar_url === mockAvatar, 'updateUserProfile updates avatar_url in DB');

  // Verify joined session query immediately reflects updated name and avatar
  const rawToken = 'test_token_' + Date.now();
  const tokenHash = hashToken(rawToken);
  const session = await createSession({
    userId: initialUser.id,
    tokenHash,
    expiresAt: Date.now() + 86400000,
  });

  const sessionWithUser = await findSessionByTokenHash(tokenHash);
  assert(sessionWithUser !== null, 'Session resolved successfully');
  assert(sessionWithUser?.user.name === updatedName, 'Session joined query reflects updated name');
  assert(sessionWithUser?.user.avatar_url === mockAvatar, 'Session joined query reflects updated avatar_url');

  // Test removing avatar (setting to null)
  const afterRemoveAvatar = await updateUserProfile(initialUser.id, { avatarUrl: null });
  assert(afterRemoveAvatar?.avatar_url === null, 'updateUserProfile sets avatar_url back to null');

  const sessionAfterRemove = await findSessionByTokenHash(tokenHash);
  assert(sessionAfterRemove?.user.avatar_url === null, 'Session joined query reflects removed avatar');

  console.log('\n' + '='.repeat(60));
  console.log(`PROFILE TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('='.repeat(60));

  if (failed > 0) process.exit(1);
}

testProfileUpdates().catch((err) => {
  console.error(err);
  process.exit(1);
});

