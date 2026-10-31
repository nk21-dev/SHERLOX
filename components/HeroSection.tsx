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
    if (isIntroActive) return;
    setPhraseIndex((prev) => (prev + 1) % phrases.length);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isIntroActive]);

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
          1. TOP NAVBAR (WITH GEMINI & GROQ STATUS BADGES)
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

      {/* =========================================================================
          BACKGROUND DETECTIVE VIDEO
          ========================================================================= */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <video
          ref={videoRef}
          src="/media/sherlox-hero.mp4"
          autoPlay
          playsInline
          preload="auto"
          onEnded={handleVideoEnd}
          onTimeUpdate={handleTimeUpdate}
          className={`w-full h-full object-contain md:object-right select-none pointer-events-none transition-transform duration-500 ease-out ${
            isSherlockHovered && !isIntroActive ? "scale-[1.015]" : "scale-100"
          }`}
        />
      </div>

      {/* Soft gradient mask for typography legibility */}
      <div
        className={`absolute inset-0 w-full md:w-3/5 bg-gradient-to-r from-black/95 via-black/60 to-transparent pointer-events-none z-[1] transition-opacity duration-1000 ${
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
          2. LEFT CONTENT: "WANNA DETECT" SIDE-BY-SIDE & BALANCED POSITION
          ========================================================================= */}
      <AnimatePresence>
        {!isIntroActive && (
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl z-10 pl-8 md:pl-24 lg:pl-32 pt-10 md:pt-14 flex flex-col justify-center min-h-[75vh] py-12 relative"
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
        )}
      </AnimatePresence>

      {/* =========================================================================
          3. ACTIVE "DETECTING" SCAN EFFECT ON HOVER (NO "?" OR "!" SYMBOLS)
          ========================================================================= */}
      {!isIntroActive && (
        <div
          onMouseEnter={() => setIsSherlockHovered(true)}
          onMouseLeave={() => setIsSherlockHovered(false)}
          onClick={handleSherlockClick}
          className="absolute right-0 top-0 w-full md:w-[48%] h-full z-20 cursor-pointer pointer-events-auto flex items-center justify-center overflow-hidden"
          title="Click to explore next case"
        >
          <AnimatePresence>
            {isSherlockHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 pointer-events-none"
              >
                {/* Laser Scan Beam */}
                <motion.div
                  animate={{ y: ["0%", "100%", "0%"] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.9)] z-30 pointer-events-none"
                />

                {/* Magnifying Reticle Target */}
                <div className="absolute top-[42%] left-[32%] w-12 h-12 rounded-full border border-red-500/60 shadow-[0_0_12px_rgba(239,68,68,0.5)] flex items-center justify-center animate-pulse pointer-events-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                </div>

                {/* Detecting Telemetry Chip */}
                <div className="absolute bottom-16 right-12 px-3 py-1 bg-black/80 border border-red-500/40 rounded-full backdrop-blur-md pointer-events-none flex items-center gap-2 shadow-xl">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  <span className="font-mono text-[10px] text-red-400 tracking-widest uppercase font-semibold">
                    ⌖ SCANNING DOSSIER // ANALYZING EVIDENCE
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* =========================================================================
          4. BOTTOM CENTER SCROLL INDICATOR
          ========================================================================= */}
      {!isIntroActive && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 pointer-events-none opacity-70">
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
      )}
    </section>
  );
};

export default HeroSection;
