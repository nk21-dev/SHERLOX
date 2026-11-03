/**
 * Comprehensive Unit & Integration Test for SHERLOX Strict Hero Video Playback Rules
 *
 * Scenarios tested against checkCanPlayHeroVideo:
 * 1. Open website directly at '/' -> CAN PLAY (Condition 1)
 * 2. Manual refresh on '/' -> CAN PLAY (Condition 2)
 * 3. Sign in & enter chat -> NO VIDEO
 * 4. Return to Archive from chat (internal navigation) -> NO VIDEO
 * 5. Navigate internally from /auth to '/' -> NO VIDEO
 * 6. Browser back / forward to '/' -> NO VIDEO
 * 7. React re-render / remount in same window -> NO VIDEO
 * 8. Auth state changes in same window -> NO VIDEO
 */

import { checkCanPlayHeroVideo, markHeroVideoPlayed } from '../lib/hero-playback-guard';

let passed = 0;
let failed = 0;

function assert(condition: boolean, desc: string) {
  if (condition) {
    console.log(`  ✓ ${desc}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${desc}`);
    failed++;
  }
}

function resetWindowMock(options: {
  pathname: string;
  bootPath?: string;
  navType?: string;
  heroPlayed?: boolean;
  internalNav?: boolean;
}) {
  (global as any).window = {
    location: { pathname: options.pathname },
    __SHERLOX_BOOT_PATH__: options.bootPath ?? options.pathname,
    __SHERLOX_HERO_PLAYED_IN_WINDOW__: options.heroPlayed ?? false,
    __SHERLOX_INTERNAL_NAVIGATION__: options.internalNav ?? false,
    performance: {
      getEntriesByType: (type: string) => {
        if (type === 'navigation') {
          return [{ type: options.navType ?? 'navigate' }];
        }
        return [];
      },
    },
  };
}

console.log('='.repeat(70));
console.log('SHERLOX HERO VIDEO STRICT PLAYBACK RULES VERIFICATION');
console.log('='.repeat(70));

// Scenario 1: Initial website entry directly at '/'
console.log('\n[Scenario 1]: Direct entry at landing page (Condition 1)');
resetWindowMock({ pathname: '/', navType: 'navigate' });
assert(checkCanPlayHeroVideo() === true, 'Hero video is permitted to play on initial website entry');
markHeroVideoPlayed();
assert(checkCanPlayHeroVideo() === false, 'Hero video is blocked after initial playback in same window');

// Scenario 2: Manual refresh on '/'
console.log('\n[Scenario 2]: Manual refresh of landing page (Condition 2)');
resetWindowMock({ pathname: '/', navType: 'reload' });
assert(checkCanPlayHeroVideo() === true, 'Hero video is permitted to play on manual landing page refresh');
markHeroVideoPlayed();
assert(checkCanPlayHeroVideo() === false, 'Hero video does not replay after refresh playback in same window');

// Scenario 3: Initial entry was on /auth or /dashboard, then navigated internally to '/'
console.log('\n[Scenario 3]: Direct entry on /auth, then internal navigation to /');
resetWindowMock({ pathname: '/', bootPath: '/auth', navType: 'navigate' });
assert(checkCanPlayHeroVideo() === false, 'Hero video is strictly BLOCKED when initial window boot was not at /');

console.log('\n[Scenario 4]: Direct entry on /dashboard, then internal navigation to /');
resetWindowMock({ pathname: '/', bootPath: '/dashboard', navType: 'navigate' });
assert(checkCanPlayHeroVideo() === false, 'Hero video is strictly BLOCKED when returning from dashboard');

// Scenario 5: User clicks Return to Archive (client-side router navigation)
console.log('\n[Scenario 5]: Return to Archive from chat (internal navigation flag)');
resetWindowMock({ pathname: '/', bootPath: '/', heroPlayed: true, internalNav: true });
assert(checkCanPlayHeroVideo() === false, 'Hero video is strictly BLOCKED on Return to Archive navigation');

// Scenario 6: Browser back / forward navigation
console.log('\n[Scenario 6]: Browser back/forward navigation (navType = back_forward)');
resetWindowMock({ pathname: '/', bootPath: '/', navType: 'back_forward' });
assert(checkCanPlayHeroVideo() === false, 'Hero video is strictly BLOCKED on back_forward navigation');

// Scenario 7: React re-renders or component remounts
console.log('\n[Scenario 7]: React re-render / remount in existing window');
resetWindowMock({ pathname: '/', bootPath: '/', heroPlayed: true });
assert(checkCanPlayHeroVideo() === false, 'Hero video is strictly BLOCKED on component remount or re-render');

// Scenario 8: Auth state changes
console.log('\n[Scenario 8]: Auth state changes while user is on page');
resetWindowMock({ pathname: '/', bootPath: '/', heroPlayed: true });
assert(checkCanPlayHeroVideo() === false, 'Hero video is strictly BLOCKED when auth state changes');

console.log('\n' + '='.repeat(70));
console.log(`TOTAL RULE TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log('='.repeat(70) + '\n');

if (failed > 0) process.exit(1);

