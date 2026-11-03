'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { HeroSection } from '@/components/HeroSection';
import { ClassifiedMarquee } from '@/components/ClassifiedMarquee';
import { ParadoxSection } from '@/components/ParadoxSection';
import { UVForensicScanner } from '@/components/UVForensicScanner';
import { HorizontalFeatures } from '@/components/HorizontalFeatures';
import { CaseVault } from '@/components/CaseVault';
import { ScrollProgressHUD } from '@/components/ScrollProgressHUD';
import { PreFooterCTA } from '@/components/PreFooterCTA';
import { Footer } from '@/components/Footer';
import { checkCanPlayHeroVideo } from '@/lib/hero-playback-guard';

interface HomeClientProps {
  initialUser: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  } | null;
}

export const HomeClient: React.FC<HomeClientProps> = ({ initialUser }) => {
  const router = useRouter();
  const [authUser, setAuthUser] = useState(initialUser);

  // Synchronously evaluate whether hero video playback is permitted:
  // ONLY Condition 1 (initial site entry at '/') or Condition 2 (landing page refresh)
  const [canPlay] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return checkCanPlayHeroVideo();
  });

  const [isVideoDone, setIsVideoDone] = useState<boolean>(() => !canPlay);
  const [isIntroActive, setIsIntroActive] = useState<boolean>(() => canPlay);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Sync authUser if initialUser prop changes
  useEffect(() => {
    if (initialUser) {
      setAuthUser(initialUser);
    }
  }, [initialUser]);

  // Client-side authentication check for navbar telemetry
  useEffect(() => {
    if (!initialUser) {
      fetch('/api/auth/me')
        .then((r) => r.json())
        .then((data) => {
          if (data?.authenticated && data?.user) {
            setAuthUser(data.user);
          }
        })
        .catch(() => {});
    }
  }, [initialUser]);

  // 1. STRICT SCROLL LOCKING: while hero video is actively playing (initial intro or user replay)
  useEffect(() => {
    if (!isVideoDone) {
      if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);

      const originalOverflow = document.body.style.overflow;
      const originalHeight = document.body.style.height;

      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';

      // Intercept wheel, touch, and keyboard scroll gestures
      const preventScroll = (e: Event) => {
        e.preventDefault();
      };

      const preventKeyScroll = (e: KeyboardEvent) => {
        if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode) && e.key !== 'Escape') {
          e.preventDefault();
        }
      };

      window.addEventListener('wheel', preventScroll, { passive: false });
      window.addEventListener('touchmove', preventScroll, { passive: false });
      window.addEventListener('keydown', preventKeyScroll, { passive: false });

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.height = originalHeight;
        window.removeEventListener('wheel', preventScroll);
        window.removeEventListener('touchmove', preventScroll);
        window.removeEventListener('keydown', preventKeyScroll);
      };
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
    }
  }, [isVideoDone]);

  // Video completion callback: reveals content and unlocks scrolling
  const handleVideoComplete = useCallback(() => {
    setIsVideoDone(true);
    setIsIntroActive(false);
  }, []);

  // Replay intro callback: re-locks scroll until replay finishes
  const handleReplayIntro = useCallback(() => {
    setIsVideoDone(false);
    setIsIntroActive(true);
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, []);

  // 2. CENTRAL ACTION ROUTING: ALL ACTIONS RESPECT AUTHENTICATION
  const handleAction = useCallback(
    (query?: string) => {
      const targetQuery = query?.trim() || '';

      if (authUser) {
        const destination = targetQuery
          ? `/dashboard?query=${encodeURIComponent(targetQuery)}`
          : '/dashboard';
        router.push(destination);
      } else {
        const destination = targetQuery
          ? `/dashboard?query=${encodeURIComponent(targetQuery)}`
          : '/dashboard';
        const authUrl = `/auth?mode=signin&returnUrl=${encodeURIComponent(destination)}`;
        router.push(authUrl);
      }
    },
    [authUser, router]
  );

  const handleAuthRedirect = useCallback(
    (mode: 'signin' | 'signup') => {
      if (authUser) {
        router.push('/dashboard');
      } else {
        router.push(`/auth?mode=${mode}&returnUrl=/dashboard`);
      }
    },
    [authUser, router]
  );

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`relative min-h-screen bg-black text-white selection:bg-red-950 selection:text-red-200 ${
        !isVideoDone ? 'h-screen max-h-screen overflow-hidden' : ''
      }`}
    >
      {/* Film Grain Atmosphere */}
      <div className="fixed inset-0 film-grain pointer-events-none z-30" />

      {/* Hero Section & Fullscreen Detective Intro */}
      <HeroSection
        videoRef={videoRef}
        initialVideoDone={isVideoDone}
        authUser={authUser}
        onInvestigate={handleAction}
        onAuthRedirect={handleAuthRedirect}
        onVideoComplete={handleVideoComplete}
        onReplayIntro={handleReplayIntro}
      />

      {/* Remaining Landing Page Content: Strictly Hidden Until Detective Video Finishes (Fresh Visitors), Immediately Visible When Completed */}
      {isVideoDone && (
        <motion.div
          key="remaining-sections"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full relative"
        >
          {/* Right-Aligned Floating Navigation Rail */}
          <ScrollProgressHUD isVisible={!isIntroActive} />

          {/* Section 1: Continuous Marquee Tape */}
          <ClassifiedMarquee />

          {/* Section 2: The Intel Paradox Cards */}
          <ParadoxSection />

          {/* Section 3: The UV Forensic Lightbox (X-Ray Truth Scanner) */}
          <UVForensicScanner onSelectCase={handleAction} />

          {/* Section 4: Horizontal Sticky Features Track */}
          <HorizontalFeatures />

          {/* Section 5: The Declassified Archive (Case Vault) */}
          <CaseVault onSelectCase={handleAction} />

          {/* Pre-Footer Action Section */}
          <PreFooterCTA onStartInvestigation={() => handleAction('')} />

          {/* Archival Bureau Footer */}
          <Footer />
        </motion.div>
      )}
    </motion.main>
  );
};
