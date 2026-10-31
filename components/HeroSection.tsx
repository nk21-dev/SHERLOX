"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

/**
 * Editorial rotating phrases
 */
const phrases = [
  "the Fall of the Roman Empire?",
  "the Silicon Valley Bank collapse?",
  "the Indus Valley Civilization mystery?",
  "the 1999 Kargil strategic timeline?",
  "the OpenAI boardroom coup?",
  "the mystery of the Koh-i-Noor?",
] as const;

interface HeroSectionProps {
  onOpenDossier?: (query: string) => void;
  onIntroStateChange?: (isIntroActive: boolean) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenDossier,
  onIntroStateChange,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // States
  const [isBooting, setIsBooting] = useState<boolean>(true);
  const [isIntroActive, setIsIntroActive] = useState<boolean>(true);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [phraseIndex, setPhraseIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Forensic Searchlight Hover States
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Notify parent of intro state change
  const updateIntroState = useCallback(
    (active: boolean) => {
      setIsIntroActive(active);
      onIntroStateChange?.(active);
    },
    [onIntroStateChange]
  );

  // =========================================================================
  // 1. NATIVE AUDIO & AUTOPLAY HANDLING
  // =========================================================================
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    video.volume = 1.0;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsAudioMuted(false);
        })
        .catch(() => {
          // Browser blocked unmuted autoplay: start muted and unmute on first gesture
          video.muted = true;
          setIsAudioMuted(true);
          video.play().catch(() => {});

          const enableAudio = () => {
            if (videoRef.current) {
              videoRef.current.muted = false;
              setIsAudioMuted(false);
            }
            window.removeEventListener("click", enableAudio);
            window.removeEventListener("scroll", enableAudio);
            window.removeEventListener("keydown", enableAudio);
          };

          window.addEventListener("click", enableAudio, { passive: true });
          window.addEventListener("scroll", enableAudio, { passive: true });
          window.addEventListener("keydown", enableAudio, { passive: true });
        });
    }
  }, []);

  // Top-right audio toggle button directly controls video.muted
  const toggleAudio = useCallback(() => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsAudioMuted(nextMuted);
    }
  }, []);

  // =========================================================================
  // 2. INITIALIZER BOOTLOADER: 1.4s then fade into video
  // =========================================================================
  useEffect(() => {
    const bootTimer = setTimeout(() => {
      setIsBooting(false);
    }, 1400);

    return () => clearTimeout(bootTimer);
  }, []);

  // Video End / Freeze Handler: Freeze video on final frame
  const handleVideoEnd = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    updateIntroState(false);
  }, [updateIntroState]);

  // Time update fallback safety (~8.8s)
  const handleTimeUpdate = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const video = e.currentTarget;
      if (video.currentTime >= 8.8 && isIntroActive) {
        handleVideoEnd();
      }
    },
    [isIntroActive, handleVideoEnd]
  );

  // Skip Intro Button
  const handleSkipIntro = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 8.9;
      videoRef.current.pause();
    }
    updateIntroState(false);
  }, [updateIntroState]);

  // Click Sherlock interaction: advances phrase & focuses search WITHOUT restarting video
  const handleSherlockClick = useCallback(() => {
    setPhraseIndex((prev) => (prev + 1) % phrases.length);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Rotate phrase every 3.2 seconds once intro completes
  useEffect(() => {
    if (isIntroActive) return;
    const timer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [isIntroActive]);

  // Handle ESC key to skip intro
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isIntroActive) {
        handleSkipIntro();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isIntroActive, handleSkipIntro]);

  // Mouse Tracking for Forensic Searchlight
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Explore pill selection
  const handlePillClick = (tag: string) => {
    setSearchQuery(tag);
    if (onOpenDossier) {
      onOpenDossier(tag);
    } else if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Submit dossier search
  const handleSubmitSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const queryToInspect =
      searchQuery.trim() || phrases[phraseIndex].replace("?", "");
    if (onOpenDossier) {
      onOpenDossier(queryToInspect);
    }
  };

  return (
    <section
      id="intro"
      className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col justify-between"
    >
      {/* =========================================================================
          1. TOP NAVBAR (SHERLOX, GEMINI & GROQ STATUS, AUDIO BUTTON)
          ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 sm:px-12 md:px-16 py-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-auto backdrop-blur-[2px]">
        {/* Left: Minimalist Brand Mark */}
        <div className="flex items-center gap-3.5">
          <a href="#intro" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-zinc-700/60 bg-zinc-950/80 text-zinc-300 shadow-sm group-hover:border-zinc-500 transition-colors">
              <Search className="w-3.5 h-3.5 text-zinc-300 stroke-[2.2]" />
            </div>

            <div className="flex items-center">
              <span className="font-sans tracking-[0.25em] font-medium text-sm text-zinc-100 uppercase">
                SHERLOX
              </span>
              <span className="hidden sm:inline-block text-xs text-zinc-400 font-normal tracking-wide border-l border-zinc-800 pl-3.5 ml-3.5">
                The Archive of Global Mysteries
              </span>
            </div>
          </a>
        </div>

        {/* Right: Live AI Gateway Badges + Native Audio Button */}
        <div className="flex items-center gap-3">
          {/* AI Gateway Badges (Gemini 2.0 & Groq) */}
          <div className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-950/90 border border-zinc-800 shadow-lg backdrop-blur-md">
            {/* Gemini */}
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              <span className="font-mono text-[11px] text-zinc-200 tracking-wider font-semibold">GEMINI 2.0</span>
            </div>

            <span className="text-zinc-700 text-xs font-mono">•</span>

            {/* Groq */}
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse shadow-[0_0_8px_rgba(251,146,60,0.8)]" />
              <span className="font-mono text-[11px] text-zinc-200 tracking-wider font-semibold">GROQ</span>
            </div>

            <span className="text-zinc-700 text-xs font-mono">|</span>

            <span className="font-mono text-[10px] text-emerald-400 tracking-widest uppercase font-medium">
              ACTIVE
            </span>
          </div>

          {/* Audio toggle button */}
          <button
            onClick={toggleAudio}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[11px] font-medium tracking-wider transition-all duration-300 cursor-pointer ${
              !isAudioMuted
                ? "bg-emerald-950/80 border-emerald-500/80 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.35)]"
                : "bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
            }`}
            title={isAudioMuted ? "Click to unmute native video audio" : "Click to mute audio"}
            aria-label={isAudioMuted ? "Unmute audio" : "Mute audio"}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                !isAudioMuted ? "bg-emerald-400 animate-ping" : "bg-zinc-500"
              }`}
            />
            <span>{isAudioMuted ? "AUDIO: MUTED 🔇" : "AUDIO: ON 🔊"}</span>
          </button>
        </div>
      </header>

      {/* =========================================================================
          BOOTLOADER: 1.4s with animated progress bar
          ========================================================================= */}
      <AnimatePresence>
        {isBooting && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center pointer-events-none"
          >
            <div className="border border-amber-500/40 bg-zinc-950/80 px-6 py-4 rounded-lg shadow-[0_0_30px_rgba(245,158,11,0.15)] flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <p className="font-mono text-xs md:text-sm text-amber-400 tracking-[0.25em] uppercase font-semibold">
                  INITIALIZING SHERLOX PROTOCOL...
                </p>
              </div>
              <p className="font-mono text-[10px] text-zinc-500 tracking-wider uppercase">
                DECRYPTING NEURAL ARCHIVE // SYNCING GLOBAL DOSSIERS
              </p>

              {/* Animated Progress Bar */}
              <div className="w-64 mt-3">
                <div className="flex justify-between font-mono text-[10px] text-amber-500/70 mb-1">
                  <span>DECRYPTING NEURAL REGISTRY</span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    [SYNCHRONIZING]
                  </motion.span>
                </div>
                <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden border border-amber-500/30">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.4, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-amber-500 to-red-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip Intro button during intro */}
      {isIntroActive && !isBooting && (
        <button
          onClick={handleSkipIntro}
          className="fixed bottom-10 right-8 sm:right-14 z-30 text-xs font-sans tracking-wider text-zinc-400 hover:text-zinc-100 px-4 py-2 rounded-full bg-zinc-950/70 border border-zinc-800/80 hover:border-zinc-700 backdrop-blur-md transition-all shadow-lg cursor-pointer"
        >
          Skip Intro [ESC]
        </button>
      )}

      {/* =========================================================================
          INNER HERO CONTENT (LOCKED TO 100% CONTAINER: TEXT & DETECTIVE TOGETHER)
          ========================================================================= */}
      <div className="max-w-7xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-12 items-center px-6 md:px-12 relative z-10 pt-24 pb-8">
        {/* Left Column: Headline, Dynamic Phrase, Search Bar & Pills */}
        <motion.div
          initial={{ opacity: 0, y: 25, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 flex flex-col justify-center max-w-2xl py-6"
        >
          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-white tracking-tight leading-[1.08]">
            <span className="block whitespace-nowrap">Wanna detect</span>
            <span className="block font-normal text-zinc-300 text-4xl sm:text-5xl lg:text-6xl mt-1">
              about
            </span>
          </h1>

          {/* Dynamic Cycling Phrase - Crisp, High-Contrast Red Serif Italic */}
          <div className="min-h-[95px] md:min-h-[125px] mt-2 flex items-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={phraseIndex}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-red-500 font-serif italic font-medium text-4xl sm:text-5xl lg:text-6xl leading-tight drop-shadow-[0_0_25px_rgba(239,68,68,0.4)] cursor-pointer"
                onClick={() => {
                  setSearchQuery(phrases[phraseIndex].replace("?", ""));
                  if (inputRef.current) inputRef.current.focus();
                }}
                title="Click to insert phrase into search"
              >
                {phrases[phraseIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Natural Human Subtext */}
          <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-lg mt-2 font-sans">
            Search any scandal, war, or mystery. Get the key suspects, the hidden lies, and the smoking gun in three minutes flat.
          </p>

          {/* Search Box - Premium Glass */}
          <form
            onSubmit={handleSubmitSearch}
            className="mt-8 bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 hover:border-zinc-700 transition-all rounded-2xl p-2.5 pl-6 flex items-center shadow-2xl max-w-xl gap-3 text-lg"
          >
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Describe any mystery, event, or scandal..."
              className="bg-transparent text-zinc-200 placeholder-zinc-500 outline-none text-base w-full font-sans"
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-500 text-white font-medium px-7 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-red-600/30 flex items-center gap-2 whitespace-nowrap text-sm cursor-pointer active:scale-98"
            >
              Investigate →
            </button>
          </form>

          {/* Explore Dossier Pills */}
          <div className="flex items-center gap-2 mt-5 text-xs text-zinc-500 flex-wrap">
            <span className="uppercase tracking-wider text-[11px] font-mono mr-1">
              Explore:
            </span>
            {["Indus Valley Disappearance", "Fall of SVB", "Kargil 1999", "French Revolution"].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handlePillClick(tag)}
                className="px-3 py-1.5 rounded-lg bg-zinc-950/80 hover:bg-zinc-800/80 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-all font-mono text-[11px] cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Right Column: Detective Container with Cursor-Following Searchlight */}
        <div
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleSherlockClick}
          className="lg:col-span-5 relative h-full min-h-[550px] lg:min-h-[700px] flex items-center justify-center cursor-crosshair overflow-hidden rounded-2xl select-none"
        >
          {/* Layer 1: Dynamic Crimson/Amber Spotlight */}
          {isHovered && (
            <div
              className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle 140px at ${mousePos.x}px ${mousePos.y}px, rgba(239, 68, 68, 0.22), transparent 75%)`,
              }}
            />
          )}

          {/* Layer 2: Forensic Crosshair Cursor (⌖) */}
          {isHovered && (
            <div
              className="absolute pointer-events-none z-30 flex items-center gap-1.5 transition-transform duration-75 ease-out"
              style={{
                left: `${mousePos.x}px`,
                top: `${mousePos.y}px`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="w-8 h-8 rounded-full border border-red-500/70 flex items-center justify-center shadow-[0_0_10px_rgba(239,68,68,0.8)]">
                <span className="w-1 h-1 bg-red-400 rounded-full" />
              </div>
              <span className="font-mono text-[9px] text-red-400 tracking-wider bg-black/80 px-1.5 py-0.5 rounded border border-red-500/30 whitespace-nowrap">
                ⌖ SCAN
              </span>
            </div>
          )}

          {/* Layer 3: Detective Video with Silhouette Rim-Glow */}
          <video
            ref={videoRef}
            src="/media/sherlox-hero.mp4"
            autoPlay
            playsInline
            preload="auto"
            onEnded={handleVideoEnd}
            onTimeUpdate={handleTimeUpdate}
            className={`w-full h-full object-contain transition-all duration-500 select-none pointer-events-none ${
              isHovered
                ? "drop-shadow-[0_0_30px_rgba(239,68,68,0.35)] scale-[1.01]"
                : ""
            }`}
          />
        </div>
      </div>

      {/* =========================================================================
          4. BOTTOM CENTER SCROLL INDICATOR
          ========================================================================= */}
      <div className="w-full pb-6 flex flex-col items-center gap-1.5 pointer-events-none opacity-70 hover:opacity-100 transition-opacity select-none z-20">
        <span className="font-mono text-[10px] tracking-[0.25em] text-zinc-400 uppercase">
          SCROLL TO EXPLORE
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-red-500 text-xs"
        >
          ↓
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
