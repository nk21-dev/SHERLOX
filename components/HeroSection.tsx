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
  const [isSherlockHovered, setIsSherlockHovered] = useState<boolean>(false);

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

  // Smooth scroll to sections
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

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
    <section id="intro" className="relative min-h-screen w-full bg-black text-white overflow-hidden flex items-center">
      {/* =========================================================================
          1. TOP NAVBAR (Minimalist Brand + Section Quick-Jumps + Audio Toggle)
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

        {/* Right: Section Links + Native Audio Button */}
        <div className="flex items-center gap-3">
          {/* Sleek section quick-jump links beside audio */}
          <nav className="hidden md:flex items-center gap-1 border border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md rounded-full px-2 py-1 shadow-lg">
            <button
              onClick={() => scrollToSection("paradox")}
              className="px-2.5 py-1 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer rounded-full hover:bg-zinc-900"
            >
              [ 02 PARADOX ]
            </button>
            <button
              onClick={() => scrollToSection("scanner")}
              className="px-2.5 py-1 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer rounded-full hover:bg-zinc-900"
            >
              [ 03 SCANNER ]
            </button>
            <button
              onClick={() => scrollToSection("vault")}
              className="px-2.5 py-1 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer rounded-full hover:bg-zinc-900"
            >
              [ 04 VAULT ]
            </button>
          </nav>

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

      {/* =========================================================================
          FULLSCREEN VIDEO PLAYBACK (Phase 1)
          - Subtle 1.025x zoom shift on Sherlock hover
          ========================================================================= */}
      <video
        ref={videoRef}
        src="/media/sherlox-hero.mp4"
        autoPlay
        playsInline
        preload="auto"
        onEnded={handleVideoEnd}
        onTimeUpdate={handleTimeUpdate}
        className={`fixed inset-0 w-full h-full object-contain pointer-events-none z-0 bg-black select-none transition-transform duration-400 ease-out ${
          isSherlockHovered && !isIntroActive ? "scale-[1.025]" : "scale-100"
        }`}
      />

      {/* Soft gradient mask for typography legibility */}
      <div
        className={`fixed inset-0 w-full md:w-3/5 bg-gradient-to-r from-black/95 via-black/60 to-transparent pointer-events-none z-[1] transition-opacity duration-1000 ${
          isIntroActive ? "opacity-0" : "opacity-100"
        }`}
      />

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
          PHASE 2: HUMAN-DESIGNED HEADLINE & SEARCH (LEFT UI)
          ========================================================================= */}
      <AnimatePresence>
        {!isIntroActive && (
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl z-10 pl-6 md:pl-16 flex flex-col justify-center min-h-[75vh] py-12 relative"
          >
            {/* Headline */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-serif font-bold text-white tracking-tight leading-[1.05]">
              Wanna detect
              <span className="block font-normal text-zinc-300">about</span>
            </h1>

            {/* Dynamic Cycling Phrase - Razor Sharp Red Serif */}
            <div className="min-h-[110px] md:min-h-[140px] mt-2 flex items-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={phraseIndex}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="text-red-500 font-serif italic font-medium text-4xl sm:text-5xl lg:text-6xl leading-tight drop-shadow-[0_0_25px_rgba(239,68,68,0.35)] cursor-pointer"
                  onClick={() => {
                    setSearchQuery(phrases[phraseIndex].replace("?", ""));
                    if (inputRef.current) inputRef.current.focus();
                  }}
                  title="Click to insert phrase into search"
                >
                  {phrases[phraseIndex] || phrases[0]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Human Subtitle */}
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-lg mt-2 font-sans font-light">
              Drop any historic catastrophe, corporate heist, or viral drama into the archive. Reconstruct the undeniable sequence of events in three minutes.
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
        )}
      </AnimatePresence>

      {/* =========================================================================
          PHASE 3: DETECTIVE INTERACTION & OPTICAL MONOCLE GLINT
          - Faint ambient red edge-glow outlines silhouette
          - Golden-white monocle flare flashes on hover
          - Subtle figure zoom (1.025x)
          - NO clutter, NO tech boxes, NO 99.4% match boxes
          ========================================================================= */}
      {!isIntroActive && (
        <div
          className="absolute right-0 top-0 w-full md:w-[45%] h-full z-20 cursor-pointer pointer-events-auto flex items-center justify-center overflow-hidden"
          onMouseEnter={() => setIsSherlockHovered(true)}
          onMouseLeave={() => setIsSherlockHovered(false)}
          onClick={handleSherlockClick}
          title="Click to explore next case"
        >
          {/* Faint ambient red edge-glow outlining silhouette on hover */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
              isSherlockHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="w-full h-full bg-[radial-gradient(ellipse_at_65%_48%,rgba(239,68,68,0.14)_0%,transparent_68%)]" />
          </div>

          {/* Optical Monocle Glint (Golden-white flare overlay) */}
          <AnimatePresence>
            {isSherlockHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: [0, 1, 0.75],
                  scale: [0.8, 1.35, 1],
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="absolute top-[32%] right-[28%] pointer-events-none z-30"
              >
                <div className="relative flex items-center justify-center">
                  {/* Radial burst glow */}
                  <div className="w-20 h-20 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.95)_0%,rgba(251,191,36,0.65)_35%,rgba(239,68,68,0.25)_65%,transparent_100%)] blur-[2px]" />

                  {/* Horizontal lens beam spike */}
                  <div className="absolute w-32 h-[1px] bg-gradient-to-r from-transparent via-amber-200 to-transparent shadow-[0_0_10px_#fbbf24]" />

                  {/* Vertical lens beam spike */}
                  <div className="absolute h-32 w-[1px] bg-gradient-to-b from-transparent via-amber-200 to-transparent shadow-[0_0_10px_#fbbf24]" />

                  {/* Diagonal refraction rays */}
                  <div className="absolute w-20 h-[1px] rotate-45 bg-gradient-to-r from-transparent via-white to-transparent" />
                  <div className="absolute w-20 h-[1px] -rotate-45 bg-gradient-to-r from-transparent via-white to-transparent" />

                  {/* Center pinpoint glint */}
                  <div className="absolute w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_14px_#ffffff]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
