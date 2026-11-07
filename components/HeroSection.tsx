'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { checkCanPlayHeroVideo, markHeroVideoPlayed } from '@/lib/hero-playback-guard';

const PHRASES = [
  "the Fall of the Roman Empire?",
  "the Silicon Valley Bank collapse?",
  "the Indus Valley Civilization mystery?",
  "the 1999 Kargil strategic timeline?",
  "the OpenAI boardroom coup?",
  "the mystery of the Koh-i-Noor?"
];

const RAIN_ITEMS = [
  { char: '✦', x: '5%',  size: 'text-xs',      dur: 4.2, delay: 0,   color: 'text-amber-400/80' },
  { char: '?', size: 'text-sm font-serif font-bold', x: '12%', dur: 5.5, delay: 1.2, color: 'text-red-500/85' },
  { char: '⌕', size: 'text-xs',      dur: 6.0, delay: 0.5, color: 'text-cyan-400/75' },
  { char: '•', size: 'text-[10px]',   dur: 3.8, delay: 2.1, color: 'text-zinc-200/70' },
  { char: '✦', size: 'text-[10px]',   dur: 5.0, delay: 3.0, color: 'text-amber-300/80' },
  { char: '?', size: 'text-base font-serif font-bold', x: '26%', dur: 4.6, delay: 0.8, color: 'text-red-400/90' },
  { char: '⌕', size: 'text-xs',      dur: 6.5, delay: 2.7, color: 'text-cyan-300/80' },
  { char: '✦', size: 'text-xs',      dur: 4.8, delay: 1.5, color: 'text-amber-400/85' },
  { char: '•', size: 'text-[8px]',    dur: 3.6, delay: 0.3, color: 'text-zinc-300/80' },
  { char: '?', size: 'text-xs font-serif font-bold', x: '42%', dur: 5.8, delay: 3.4, color: 'text-red-500/80' },
  { char: '✦', size: 'text-sm',      dur: 5.2, delay: 2.0, color: 'text-amber-400/75' },
  { char: '⌕', size: 'text-[11px]',   dur: 6.2, delay: 1.1, color: 'text-cyan-400/80' },
  { char: '•', size: 'text-[10px]',   dur: 4.0, delay: 2.9, color: 'text-zinc-200/75' },
  { char: '?', size: 'text-sm font-serif font-bold', x: '55%', dur: 4.9, delay: 0.6, color: 'text-red-400/85' },
  { char: '✦', size: 'text-xs',      dur: 5.6, delay: 3.8, color: 'text-amber-300/80' },
  { char: '⌕', size: 'text-xs',      dur: 6.8, delay: 1.9, color: 'text-cyan-300/75' },
  { char: '•', size: 'text-[9px]',    dur: 3.5, delay: 0.2, color: 'text-zinc-100/70' },
  { char: '?', size: 'text-xs font-serif font-bold', x: '65%', dur: 5.1, delay: 2.4, color: 'text-red-500/80' },
  { char: '✦', size: 'text-[11px]',   dur: 4.4, delay: 3.1, color: 'text-amber-400/85' },
  { char: '•', size: 'text-[10px]',   dur: 4.1, delay: 1.7, color: 'text-zinc-300/70' },
  { char: '⌕', size: 'text-xs',      dur: 6.4, delay: 0.9, color: 'text-cyan-400/80' },
  { char: '?', size: 'text-sm font-serif font-bold', x: '78%', dur: 5.3, delay: 3.6, color: 'text-red-400/90' },
  { char: '✦', size: 'text-xs',      dur: 4.7, delay: 1.4, color: 'text-amber-300/75' },
  { char: '•', size: 'text-[8px]',    dur: 3.7, delay: 2.5, color: 'text-zinc-200/80' },
  { char: '⌕', size: 'text-[10px]',   dur: 6.1, delay: 3.3, color: 'text-cyan-300/70' },
];

const DetectiveRain: React.FC = () => (
  <div className="absolute inset-0 w-full md:w-[65%] h-full overflow-hidden pointer-events-none z-0">
    {RAIN_ITEMS.map((item, idx) => (
      <motion.span
        key={idx}
        initial={{ y: -50, opacity: 0 }}
        animate={{
          y: ['0vh', '110vh'],
          opacity: [0, 0.85, 0.75, 0],
        }}
        transition={{
          duration: item.dur,
          repeat: Infinity,
          delay: item.delay,
          ease: 'linear',
        }}
        style={{ left: item.x || `${(idx * 4.1) % 85}%` }}
        className={`absolute top-0 select-none ${item.size} ${item.color} drop-shadow-[0_0_8px_currentColor]`}
      >
        {item.char}
      </motion.span>
    ))}
  </div>
);

interface HeroSectionProps {
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  initialVideoDone?: boolean;
  authUser?: { name: string; email: string } | null;
  onInvestigate?: (query: string) => void;
  onAuthRedirect?: (mode: 'signin' | 'signup') => void;
  onVideoComplete?: () => void;
  onReplayIntro?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  videoRef: externalVideoRef,
  initialVideoDone = false,
  authUser = null,
  onInvestigate,
  onAuthRedirect,
  onVideoComplete,
  onReplayIntro,
}) => {
  // Synchronously evaluate whether hero video playback is permitted:
  // ONLY Condition 1 (initial site entry at '/') or Condition 2 (landing page refresh)
  const [canPlay] = useState<boolean>(() => {
    if (typeof window === 'undefined') return !initialVideoDone;
    return checkCanPlayHeroVideo();
  });

  const [isVideoDone, setIsVideoDone] = useState<boolean>(() => initialVideoDone || !canPlay);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(() => canPlay);
  const [needsAudioGesture, setNeedsAudioGesture] = useState<boolean>(false);

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [globalMousePos, setGlobalMousePos] = useState({ x: 0, y: 0 });

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const videoRef = externalVideoRef || localVideoRef;

  const completedRef = useRef<boolean>(initialVideoDone || !canPlay);

  // Sync state if parent signals change
  useEffect(() => {
    if (initialVideoDone) {
      completedRef.current = true;
      setIsVideoDone(true);
      setNeedsAudioGesture(false);
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.currentTime = 8.9;
        video.muted = true;
      }
    }
  }, [initialVideoDone, videoRef]);

  // Master completion handler: stops intro, settles detective on right, unlocks content
  const completeIntro = useCallback(() => {
    if (completedRef.current && isVideoDone) return;
    completedRef.current = true;

    setNeedsAudioGesture(false);
    setIsVideoDone(true);

    if (videoRef.current) {
      videoRef.current.currentTime = 8.9;
      videoRef.current.pause();
    }

    onVideoComplete?.();
  }, [onVideoComplete, isVideoDone, videoRef]);

  // Initial playback: ONLY Condition 1 (Initial site entry at '/') or Condition 2 (Landing page refresh)
  useEffect(() => {
    // If playback is not permitted (internal navigation, return from chat, back/forward, etc.)
    if (!canPlay || completedRef.current) {
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.currentTime = 8.9;
        video.muted = true;
      }
      return;
    }

    // Condition 1 or Condition 2: mark intro as played for this window session
    markHeroVideoPlayed();

    // Jump to top of landing page
    if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const video = videoRef.current;
    if (!video) return;

    // Initialize with audio enabled
    video.currentTime = 0;
    video.muted = false;
    video.volume = 1.0;
    setIsAudioOn(true);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        // Browser blocked unmuted autoplay: prompt user to start with audio
        console.warn('[SHERLOX HERO] Unmuted autoplay blocked by browser policy:', err);
        setNeedsAudioGesture(true);
      });
    }

    // Safety timeout: 12 seconds max under all circumstances
    const fallbackTimer = setTimeout(() => {
      if (!completedRef.current) {
        console.warn('[SHERLOX HERO] Safety fallback timeout reached, completing intro.');
        completeIntro();
      }
    }, 12000);

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [canPlay, completeIntro, videoRef]);

  // Handler when visitor clicks to authorize audio playback
  const handleStartWithAudio = () => {
    setNeedsAudioGesture(false);
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.muted = false;
      video.volume = 1.0;
      setIsAudioOn(true);
      video.play().catch(() => {
        completeIntro();
      });
    }
  };

  // Dynamic phrase rotation once video is finished
  useEffect(() => {
    if (!isVideoDone) return;
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isVideoDone]);

  // Settle detective when he reaches his chair at 8.8s
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.currentTime >= 8.8 && !completedRef.current) {
      completeIntro();
    }
  };

  // User-initiated Replay Intro button click
  const handleReplayIntroClick = () => {
    completedRef.current = false;
    setNeedsAudioGesture(false);
    setIsVideoDone(false);

    if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.muted = false;
      video.volume = 1.0;
      setIsAudioOn(true);
      video.play().catch((err) => {
        console.warn('[SHERLOX HERO] Replay audio blocked:', err);
        setNeedsAudioGesture(true);
      });
    }

    onReplayIntro?.();
  };

  // ESC key to skip intro
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !completedRef.current) {
        completeIntro();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [completeIntro]);

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    video.volume = 1.0;
    setIsAudioOn(!nextMuted);
  };

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setGlobalMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const submitSearch = (queryToUse?: string) => {
    const q = queryToUse || searchQuery || PHRASES[phraseIndex].replace('?', '');
    if (!q.trim()) return;
    onInvestigate?.(q);
  };

  return (
    <section
      id="intro"
      onMouseMove={handleHeroMouseMove}
      className="relative z-10 w-full min-h-screen bg-black overflow-hidden flex flex-col justify-between select-none pt-20 md:pt-24"
    >
      {/* 1. BROWSER AUTOPLAY WITH AUDIO AUTHORIZATION PROMPT (ONLY SHOWN IF BROWSER BLOCKS UNMUTED AUTOPLAY) */}
      <AnimatePresence>
        {needsAudioGesture && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center select-none"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-md w-full bg-zinc-950/95 border border-red-500/50 rounded-2xl p-8 shadow-[0_0_60px_rgba(239,68,68,0.35)] flex flex-col items-center gap-4"
            >
              <div className="w-14 h-14 rounded-full bg-red-950/80 border border-red-500/60 flex items-center justify-center shadow-[0_0_25px_rgba(239,68,68,0.5)]">
                <span className="text-2xl">🔊</span>
              </div>
              <div>
                <h3 className="font-serif text-2xl text-white font-bold tracking-tight">
                  Enter the Bureau
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 font-sans mt-1">
                  Authorize audio transmission to experience the declassified introduction.
                </p>
              </div>
              <button
                type="button"
                onClick={handleStartWithAudio}
                className="w-full mt-2 py-3.5 px-6 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-semibold uppercase tracking-widest transition-all shadow-[0_0_25px_rgba(239,68,68,0.4)] hover:shadow-[0_0_35px_rgba(239,68,68,0.6)] cursor-pointer flex items-center justify-center gap-2"
              >
                <span>▶ PLAY INTRODUCTION WITH AUDIO</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. FULLSCREEN DETECTIVE VIDEO (NO LOOP - PLAYS EXACTLY ONCE PER PAGE LOAD) */}
      <video
        ref={videoRef}
        src={canPlay ? "/media/gemini_generated_video_988681c8-clean.mp4" : "/media/gemini_generated_video_988681c8-clean.mp4#t=8.9"}
        playsInline
        preload="auto"
        onLoadedMetadata={(e) => {
          if (!canPlay || completedRef.current) {
            e.currentTarget.currentTime = 8.9;
            e.currentTarget.pause();
          }
        }}
        onEnded={completeIntro}
        onTimeUpdate={handleTimeUpdate}
        onError={completeIntro}
        className="absolute inset-0 w-full h-full object-contain md:object-right z-0 pointer-events-none bg-black"
      />

      {/* Full-bleed unclipped forensic spotlight */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 220px at ${globalMousePos.x}px ${globalMousePos.y}px, rgba(239, 68, 68, 0.16), transparent 75%)`,
          }}
        />
      )}

      {/* Forensic Crosshair Cursor (⌖ DETECTING...) */}
      {isHovered && (
        <div
          className="absolute pointer-events-none z-30 flex items-center gap-1.5 transition-transform duration-75 ease-out"
          style={{
            left: `${globalMousePos.x}px`,
            top: `${globalMousePos.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="w-7 h-7 rounded-full border border-red-500/80 flex items-center justify-center shadow-[0_0_14px_rgba(239,68,68,0.9)] bg-black/40 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-ping" />
          </div>
          <span className="font-mono text-[9px] text-red-300 tracking-wider bg-black/90 px-2 py-0.5 rounded-full border border-red-500/40 shadow-lg whitespace-nowrap">
            ⌖ DETECTING...
          </span>
        </div>
      )}

      {/* Skip Intro button during intro */}
      {!isVideoDone && canPlay && (
        <button
          onClick={completeIntro}
          className="fixed bottom-10 right-8 sm:right-14 z-30 text-xs font-mono tracking-wider text-zinc-400 hover:text-zinc-100 px-4 py-2 rounded-full bg-zinc-950/70 border border-zinc-800/80 hover:border-zinc-700 backdrop-blur-md transition-all shadow-lg cursor-pointer"
        >
          Skip Intro [ESC]
        </button>
      )}

      {/* 4. MAIN HERO CONTENT (Revealed immediately after video finishes or when playback is not permitted) */}
      <div className="relative z-20 flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 flex items-center min-h-[70vh]">
        {/* Layer 0: The Falling Detective Rain */}
        {isVideoDone && <DetectiveRain />}

        {/* Layer 10: Left Content Column */}
        {isVideoDone && (
          <motion.div
            initial={{ opacity: 0, x: -30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl py-8 flex flex-col justify-center relative z-10"
          >
            {/* Headline with "Wanna detect" on one line */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-white tracking-tight leading-[1.08]">
              <span className="block whitespace-nowrap">Wanna detect</span>
              <span className="block font-normal text-zinc-300 text-4xl sm:text-5xl lg:text-6xl mt-1">
                about
              </span>
            </h1>

            {/* Dynamic Cycling Phrase */}
            <div className="min-h-[100px] md:min-h-[130px] mt-2 flex items-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={phraseIndex}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="text-red-500 font-serif italic font-medium text-4xl sm:text-5xl lg:text-6xl leading-tight drop-shadow-[0_0_25px_rgba(239,68,68,0.4)]"
                >
                  {PHRASES[phraseIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Human-written subtext */}
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-lg mt-2 font-sans">
              Search any scandal, war, or mystery. Get the key suspects, the hidden lies, and the smoking gun in three minutes flat.
            </p>

            {/* Search Input Bar */}
            <div className="mt-8 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 hover:border-zinc-700 focus-within:border-red-600/60 transition-all rounded-2xl p-2.5 pl-6 flex items-center shadow-2xl max-w-xl">
              <input
                id="case-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitSearch()}
                placeholder="Describe any mystery, event, or scandal..."
                className="bg-transparent text-zinc-100 placeholder-zinc-500 outline-none text-base w-full font-sans"
              />
              <button
                onClick={() => submitSearch()}
                className="bg-red-600 hover:bg-red-500 text-white font-medium px-7 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-red-600/30 flex items-center gap-2 whitespace-nowrap text-sm cursor-pointer"
              >
                Investigate →
              </button>
            </div>

            {/* Explore Case Pills */}
            <div className="flex items-center gap-2 mt-5 text-xs text-zinc-500 flex-wrap">
              <span className="uppercase tracking-wider text-[11px] font-mono mr-1">EXPLORE:</span>
              {['Indus Valley Disappearance', 'Fall of SVB', 'Kargil 1999', 'French Revolution'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => submitSearch(tag)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-950/80 hover:bg-zinc-800/80 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-all font-mono text-[11px] cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* 5. INTERACTIVE FORENSIC HOVER TRIGGER ZONE OVER SHERLOCK (RIGHT HALF) */}
      {isVideoDone && (
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => {
            setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
            const input = document.getElementById('case-search-input') as HTMLInputElement;
            if (input) input.focus();
          }}
          className="absolute right-0 top-0 w-full md:w-[50%] h-full z-20 cursor-pointer pointer-events-auto"
        />
      )}

      {/* Bottom Left: Replay Intro Button (Scrolls naturally with the hero section) */}
      {isVideoDone && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onClick={handleReplayIntroClick}
          className="absolute bottom-6 left-6 md:left-14 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-800 hover:border-red-500/40 text-zinc-400 hover:text-zinc-200 font-mono text-[11px] backdrop-blur-md transition-all shadow-lg cursor-pointer group select-none"
        >
          <span className="text-red-500 transition-transform group-hover:-rotate-90 duration-300">↺</span>
          <span className="tracking-wider uppercase">REPLAY INTRO</span>
        </motion.button>
      )}

      {/* Bottom Right: Audio Toggle (Next to Detective, scrolls away with hero, shown when video played) */}
      {isVideoDone && canPlay && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          data-audio-button="true"
          onClick={toggleAudio}
          className={`absolute bottom-6 right-6 md:right-14 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono border backdrop-blur-md transition-all cursor-pointer select-none shadow-lg ${
            isAudioOn
              ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
              : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <span>{isAudioOn ? 'AUDIO: ON 🔊' : 'AUDIO: MUTED 🔇'}</span>
        </motion.button>
      )}

      {/* 6. SCROLL TO EXPLORE INDICATOR */}
      {isVideoDone && (
        <div className="relative z-20 pb-6 w-full flex flex-col items-center justify-center gap-1.5 pointer-events-none opacity-60">
          <span className="font-mono text-[10px] tracking-[0.25em] text-zinc-400 uppercase">
            SCROLL TO EXPLORE
          </span>
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="text-red-500 text-xs"
          >
            ↓
          </motion.span>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
