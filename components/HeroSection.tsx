'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PHRASES = [
  "the Fall of the Roman Empire?",
  "the Silicon Valley Bank collapse?",
  "the Indus Valley Civilization mystery?",
  "the 1999 Kargil strategic timeline?",
  "the OpenAI boardroom coup?",
  "the mystery of the Koh-i-Noor?"
];

interface HeroSectionProps {
  onSearch?: (query: string) => void;
  onOpenDossier?: (query: string) => void;
  onIntroStateChange?: (isIntroActive: boolean) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onOpenDossier,
  onIntroStateChange,
}) => {
  const [isBooting, setIsBooting] = useState(true);
  const [isVideoDone, setIsVideoDone] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const videoRef = useRef<HTMLVideoElement>(null);

  // Bootloader timer: 1.4s then starts video
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBooting(false);
      if (videoRef.current) {
        videoRef.current.muted = !isAudioOn;
        videoRef.current.play().catch(() => {
          // Autoplay fallback
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play();
          }
        });
      }
    }, 1400);
    return () => clearTimeout(timer);
  }, [isAudioOn]);

  // Audio unmute listener on first user interaction
  useEffect(() => {
    const unlockAudio = () => {
      if (videoRef.current) {
        videoRef.current.muted = false;
        setIsAudioOn(true);
      }
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('scroll', unlockAudio);
    };
    window.addEventListener('click', unlockAudio, { passive: true });
    window.addEventListener('scroll', unlockAudio, { passive: true });
    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('scroll', unlockAudio);
    };
  }, []);

  // Dynamic phrase rotation only when video is finished
  useEffect(() => {
    if (!isVideoDone) return;
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isVideoDone]);

  const handleVideoEnded = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsVideoDone(true);
    onIntroStateChange?.(false);
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.currentTime >= 8.8 && !isVideoDone) {
      handleVideoEnded();
    }
  };

  // ESC key to skip intro
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isVideoDone) {
        if (videoRef.current) {
          videoRef.current.currentTime = 8.9;
          videoRef.current.pause();
        }
        handleVideoEnded();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVideoDone]);

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsAudioOn(!videoRef.current.muted);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const submitSearch = (queryToUse?: string) => {
    const q = queryToUse || searchQuery || PHRASES[phraseIndex].replace('?', '');
    if (!q.trim()) return;
    if (onOpenDossier) {
      onOpenDossier(q);
    } else if (onSearch) {
      onSearch(q);
    } else {
      const input = document.getElementById('case-search-input') as HTMLInputElement;
      if (input) input.value = q;
    }
  };

  return (
    <section id="intro" className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col justify-between select-none">
      
      {/* 1. INITIALIZING BOOTLOADER */}
      <AnimatePresence>
        {isBooting && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center pointer-events-none"
          >
            <div className="border border-amber-500/40 bg-zinc-950/90 px-8 py-5 rounded-xl shadow-[0_0_35px_rgba(245,158,11,0.15)] flex flex-col items-center gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <p className="font-mono text-xs md:text-sm text-amber-400 tracking-[0.25em] uppercase font-semibold">
                  INITIALIZING SHERLOX PROTOCOL...
                </p>
              </div>
              <div className="w-56 h-1 bg-zinc-900 rounded-full overflow-hidden border border-amber-500/20">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.3, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-amber-500 to-red-500"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. FULLSCREEN DETECTIVE VIDEO (Always full width background) */}
      <video
        ref={videoRef}
        src="/media/gemini_generated_video_988681c8-clean.mp4"
        playsInline
        preload="auto"
        onEnded={handleVideoEnded}
        onTimeUpdate={handleTimeUpdate}
        className="fixed inset-0 w-full h-full object-contain md:object-right z-0 pointer-events-none bg-black"
      />

      {/* Skip Intro button during intro */}
      {!isVideoDone && !isBooting && (
        <button
          onClick={() => {
            if (videoRef.current) {
              videoRef.current.currentTime = 8.9;
              videoRef.current.pause();
            }
            handleVideoEnded();
          }}
          className="fixed bottom-10 right-8 sm:right-14 z-30 text-xs font-mono tracking-wider text-zinc-400 hover:text-zinc-100 px-4 py-2 rounded-full bg-zinc-950/70 border border-zinc-800/80 hover:border-zinc-700 backdrop-blur-md transition-all shadow-lg cursor-pointer"
        >
          Skip Intro [ESC]
        </button>
      )}

      {/* 3. TOP NAVBAR */}
      <header className="relative z-30 w-full px-6 md:px-14 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-serif font-bold text-xl tracking-tight text-white">SHERLOX</span>
          <span className="hidden sm:inline text-xs font-mono text-zinc-500 border-l border-zinc-800 pl-3">
            The Archive of Global Mysteries
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Dual AI Engine Badge */}
          <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-950/90 border border-zinc-800 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-mono text-[11px] text-zinc-200 font-semibold">GEMINI 2.0</span>
            </div>
            <span className="text-zinc-700 text-xs font-mono">•</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              <span className="font-mono text-[11px] text-zinc-200 font-semibold">GROQ</span>
            </div>
            <span className="text-zinc-700 text-xs font-mono">|</span>
            <span className="font-mono text-[10px] text-emerald-400 uppercase font-medium">ACTIVE</span>
          </div>

          {/* Audio Button */}
          <button
            onClick={toggleAudio}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono border backdrop-blur-md transition-all cursor-pointer ${
              isAudioOn
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : 'bg-zinc-900 border-zinc-800 text-zinc-500'
            }`}
          >
            {isAudioOn ? 'AUDIO: ON 🔊' : 'AUDIO: MUTED 🔇'}
          </button>
        </div>
      </header>

      {/* 4. MAIN HERO CONTENT (Only visible AFTER video finishes) */}
      <div className="relative z-20 flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 flex items-center">
        {isVideoDone && (
          <motion.div
            initial={{ opacity: 0, x: -30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl py-8 flex flex-col justify-center"
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
                  transition={{ duration: 0.4, ease: "easeOut" }}
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

      {/* 5. INTERACTIVE FORENSIC SEARCHLIGHT HOVER ON DETECTIVE (RIGHT HALF) */}
      {isVideoDone && (
        <div
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="absolute right-0 top-0 w-full md:w-[45%] h-full z-20 cursor-pointer pointer-events-auto"
        >
          {/* Dynamic Radial Spotlight */}
          {isHovered && (
            <div
              className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-200"
              style={{
                background: `radial-gradient(circle 160px at ${mousePos.x}px ${mousePos.y}px, rgba(239, 68, 68, 0.18), transparent 75%)`,
              }}
            />
          )}

          {/* Cursor Reticle */}
          {isHovered && (
            <div
              className="absolute pointer-events-none z-20 flex items-center gap-1.5 transition-transform duration-75 ease-out"
              style={{
                left: `${mousePos.x}px`,
                top: `${mousePos.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="w-7 h-7 rounded-full border border-red-500/80 flex items-center justify-center shadow-[0_0_12px_rgba(239,68,68,0.9)]">
                <span className="w-1 h-1 bg-red-400 rounded-full" />
              </div>
              <span className="font-mono text-[9px] text-red-400 tracking-wider bg-black/80 px-1.5 py-0.5 rounded border border-red-500/30 whitespace-nowrap">
                ⌖ SCAN
              </span>
            </div>
          )}
        </div>
      )}

      {/* 6. SCROLL TO EXPLORE INDICATOR */}
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

    </section>
  );
};

export default HeroSection;
