/**
 * SHERLOX Hero Video Playback Guard
 *
 * Strict Rules:
 * There are ONLY TWO situations where the landing page hero video is allowed to play:
 * 1. Initial website entry at the landing page (direct full-page document load of '/')
 * 2. Manual landing page refresh (manual browser reload of '/')
 *
 * In ALL other situations (internal navigation, return from chat/archive, browser back/forward,
 * auth state changes, remounts, etc.), the video MUST NOT play.
 */

declare global {
  interface Window {
    __SHERLOX_BOOT_PATH__?: string;
    __SHERLOX_HERO_PLAYED_IN_WINDOW__?: boolean;
    __SHERLOX_INTERNAL_NAVIGATION__?: boolean;
    __SHERLOX_HISTORY_PATCHED__?: boolean;
  }
}

// Initialize navigation tracking immediately upon module load on client
if (typeof window !== 'undefined') {
  if (!window.__SHERLOX_BOOT_PATH__) {
    window.__SHERLOX_BOOT_PATH__ = window.location.pathname;
  }

  // Intercept client-side routing (pushState & replaceState)
  if (!window.__SHERLOX_HISTORY_PATCHED__) {
    window.__SHERLOX_HISTORY_PATCHED__ = true;

    const origPush = window.history.pushState;
    window.history.pushState = function (...args) {
      window.__SHERLOX_INTERNAL_NAVIGATION__ = true;
      return origPush.apply(this, args);
    };

    const origReplace = window.history.replaceState;
    window.history.replaceState = function (...args) {
      const targetUrl = args[2];
      if (targetUrl && typeof targetUrl === 'string' && targetUrl !== window.location.pathname) {
        window.__SHERLOX_INTERNAL_NAVIGATION__ = true;
      }
      return origReplace.apply(this, args);
    };

    // Popstate (browser back/forward button)
    window.addEventListener('popstate', () => {
      window.__SHERLOX_INTERNAL_NAVIGATION__ = true;
    });

    // PageShow event for BFCache restoration
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) {
        window.__SHERLOX_INTERNAL_NAVIGATION__ = true;
      }
    });
  }
}

/**
 * Checks whether hero video playback is permitted according to strict rules.
 */
export function checkCanPlayHeroVideo(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  // 1. If an internal client-side navigation occurred in this window session, NEVER play
  if (window.__SHERLOX_INTERNAL_NAVIGATION__) {
    return false;
  }

  // 2. If the intro has already played in this window session, NEVER play again
  if (window.__SHERLOX_HERO_PLAYED_IN_WINDOW__) {
    return false;
  }

  // 3. Current pathname must be the landing page root '/'
  if (window.location.pathname !== '/') {
    return false;
  }

  // 4. Initial window boot pathname must also have been '/'
  if (window.__SHERLOX_BOOT_PATH__ && window.__SHERLOX_BOOT_PATH__ !== '/') {
    return false;
  }

  // 5. Check performance navigation timing
  const navEntries = window.performance?.getEntriesByType?.('navigation');
  if (navEntries && navEntries.length > 0) {
    const navTiming = navEntries[0] as PerformanceNavigationTiming;
    // Condition 1: 'navigate' (initial direct full-page entry)
    // Condition 2: 'reload' (manual browser refresh)
    // Disallowed: 'back_forward' (browser back/forward traversal)
    if (navTiming.type === 'back_forward') {
      return false;
    }
    if (navTiming.type !== 'navigate' && navTiming.type !== 'reload') {
      return false;
    }
  } else if ((window.performance as any)?.navigation) {
    // Legacy Navigation API fallback (0 = TYPE_NAVIGATE, 1 = TYPE_RELOAD, 2 = TYPE_BACK_FORWARD)
    const legacyType = (window.performance as any).navigation.type;
    if (legacyType === 2) {
      return false;
    }
  }

  return true;
}

/**
 * Marks that hero video playback has been initiated for this window session.
 */
export function markHeroVideoPlayed(): void {
  if (typeof window !== 'undefined') {
    window.__SHERLOX_HERO_PLAYED_IN_WINDOW__ = true;
  }
}

