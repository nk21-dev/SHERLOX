"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EditorialNavbar } from "./CyberHUD";
import { ClassifiedDossierModal } from "./ClassifiedDossierModal";

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

/**
 * Curated case exploration pills
 */
const CURATED_PILLS = [
  { label: "Indus Valley Disappearance", query: "Indus Valley Civilization mystery and decline" },
  { label: "Fall of SVB", query: "Silicon Valley Bank liquidity collapse" },
  { label: "Kargil 1999", query: "1999 Kargil strategic timeline" },
  { label: "French Revolution", query: "The French Revolution and Fall of the Bastille" },
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

  // Dossier Modal local fallback
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);
  const [currentDossierQuery, setCurrentDossierQuery] = useState<string>("");

  // Notify parent of intro state change
  const updateIntroState = useCallback(
    (active: boolean) => {
      setIsIntroActive(active);
      onIntroStateChange?.(active);
    },
    [onIntroStateChange]
  );

  // =========================================================================
  // 1. AUDIO REQUIREMENT: PLAY ONLY THE VIDEO'S NATIVE AUDIO
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

  // Top-right navbar button directly toggles videoRef.current.muted
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

  // Case pill selection
  const handlePillClick = (queryText: string) => {
    setSearchQuery(queryText);
    if (inputRef.current) {
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
    } else {
      setCurrentDossierQuery(queryToInspect);
      setIsDossierOpen(true);
    }
  };

  return (
    <section id="intro" className="relative min-h-screen w-full bg-black text-white overflow-hidden flex items-center">
      {/* Top Navbar with Native Audio Button */}
      <EditorialNavbar
        isMuted={isAudioMuted}
        toggleAudio={toggleAudio}
        isHeroReady={!isIntroActive}
      />

      {/* =========================================================================
          1. INITIALIZER BOOTLOADER: 1.4s with animated progress line
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
          - Full viewport fixed layer playing only native video audio
          - Freezes on final frame where Sherlock rests on his cane on the right
          ========================================================================= */}
      <video
        ref={videoRef}
        src="/media/sherlox-hero.mp4"
        autoPlay
        playsInline
        preload="auto"
        onEnded={handleVideoEnd}
        onTimeUpdate={handleTimeUpdate}
        className={`fixed inset-0 w-full h-full object-contain pointer-events-none z-0 bg-black select-none transition-transform duration-500 ease-out ${
          isSherlockHovered && !isIntroActive ? "scale-[1.02]" : "scale-100"
        }`}
      />

      {/* Soft gradient mask for typography legibility */}
      <div
        className={`fixed inset-0 w-full md:w-3/5 bg-gradient-to-r from-black/95 via-black/60 to-transparent pointer-events-none z-[1] transition-opacity duration-1000 ${
          isIntroActive ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Ambient Classified Telemetry Console Above Detective (Right Half) */}
      {!isIntroActive && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="absolute top-24 right-12 md:right-28 hidden lg:flex flex-col items-end gap-1.5 pointer-events-none z-10 select-none"
        >
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-950/80 border border-zinc-800 rounded-full backdrop-blur-md shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[10px] text-zinc-400 tracking-widest uppercase">
              ARCHIVE RECON // SECTOR: GLOBAL ENIGMAS
            </span>
          </div>
          <div className="flex gap-2">
            <span className="font-mono text-[9px] text-zinc-600 tracking-wider">THREAT DETECTOR: ONLINE</span>
            <span className="text-zinc-700">•</span>
            <span className="font-mono text-[9px] text-red-500/80 tracking-wider">SMOKING GUN VERIFIED</span>
          </div>
        </motion.div>
      )}

      {/* Skip Intro button during intro */}
      {isIntroActive && !isBooting && (
        <button
          onClick={handleSkipIntro}
          className="fixed bottom-10 right-8 sm:right-14 z-30 text-xs font-sans tracking-wider text-zinc-400 hover:text-zinc-100 px-4 py-2 rounded-full bg-zinc-950/70 border border-zinc-800/80 hover:border-zinc-700 backdrop-blur-md transition-all shadow-lg"
        >
          Skip Intro [ESC]
        </button>
      )}

      {/* =========================================================================
          PHASE 2: SLOW-MOTION REVEAL (LEFT UI)
          ========================================================================= */}
      <AnimatePresence>
        {!isIntroActive && (
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl z-10 pl-10 md:pl-24 lg:pl-32 relative py-20"
          >
            <p className="text-amber-500/90 text-xs md:text-sm tracking-[0.2em] uppercase font-sans mb-3 font-medium">
              Autonomous Historical & Corporate Dossiers
            </p>

            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-serif font-light text-zinc-100 tracking-tight leading-[1.05]">
              Wanna detect about
            </h1>

            {/* Cycling phrase directly beneath it in crimson italic serif */}
            <div className="min-h-[90px] md:min-h-[110px] mt-2 flex items-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={phraseIndex}
                  initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -18, filter: "blur(6px)" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-serif italic text-red-500 font-normal cursor-pointer hover:opacity-90 transition-opacity"
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

            <p className="text-zinc-400 text-base md:text-lg max-w-xl leading-relaxed mt-4 font-normal">
              From 2,000-year-old historical enigmas to modern corporate upheavals. Drop any mystery into the archive to reconstruct the undeniable sequence of events.
            </p>

            {/* Frosted Glass Search Bar */}
            <form
              onSubmit={handleSubmitSearch}
              className="mt-8 bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 hover:border-zinc-700 focus-within:border-zinc-600 transition-all rounded-2xl p-2.5 pl-6 flex items-center shadow-2xl max-w-xl gap-3 text-lg"
            >
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Describe any mystery, event, or scandal..."
                className="bg-transparent text-zinc-200 placeholder-zinc-500 outline-none text-base md:text-lg w-full font-sans"
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-500 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-red-600/30 flex items-center gap-2 whitespace-nowrap text-sm md:text-base active:scale-98"
              >
                Investigate →
              </button>
            </form>

            {/* Curated Case Exploration Pills */}
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-1">
              <span className="text-[10px] tracking-widest text-zinc-500 font-medium uppercase mr-1">
                EXPLORE DOSSIERS:
              </span>
              {CURATED_PILLS.map((pill, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePillClick(pill.query)}
                  className="text-xs px-3 py-1.5 rounded-full bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800/80 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-all duration-200"
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          PHASE 3: FORENSIC OPTICAL HUD ON SHERLOCK (RIGHT 45%)
          ========================================================================= */}
      {!isIntroActive && (
        <div
          className="group/sherlock absolute right-0 top-0 w-full md:w-[45%] h-full z-20 cursor-pointer pointer-events-auto flex items-center justify-center overflow-hidden"
          onMouseEnter={() => setIsSherlockHovered(true)}
          onMouseLeave={() => setIsSherlockHovered(false)}
          onMouseMove={() => !isSherlockHovered && setIsSherlockHovered(true)}
          onClick={handleSherlockClick}
          title="Click to explore next case"
        >
          {/* Forensic Optical HUD */}
          <AnimatePresence>
            {isSherlockHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-20"
              >
                <div className="relative w-[480px] h-[480px] flex items-center justify-center pointer-events-none">
                  {/* Outer Ring with 4 Cardinal Crosshairs */}
                  <div className="absolute w-[440px] h-[440px] rounded-full border border-red-500/20 flex items-center justify-center pointer-events-none">
                    <div className="absolute top-0 w-3 h-[2px] bg-red-500/70" />
                    <div className="absolute bottom-0 w-3 h-[2px] bg-red-500/70" />
                    <div className="absolute left-0 h-3 w-[2px] bg-red-500/70" />
                    <div className="absolute right-0 h-3 w-[2px] bg-red-500/70" />

                    <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-red-500/40" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-red-500/40" />
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-red-500/40" />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-red-500/40" />
                  </div>

                  {/* Inner Dashed Aperture Ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute w-[300px] h-[300px] rounded-full border border-dashed border-red-500/30 pointer-events-none"
                  />

                  {/* Secondary Fine Concentric Ring */}
                  <div className="absolute w-[180px] h-[180px] rounded-full border border-zinc-700/30 pointer-events-none" />

                  {/* Center Target Point */}
                  <div className="absolute w-2 h-2 rounded-full bg-red-500/70 shadow-[0_0_10px_rgba(239,68,68,0.8)] pointer-events-none" />

                  {/* Upper Forensic Target Node (Near Magnifying Glass) */}
                  <div className="absolute top-[22%] right-[16%] flex items-center gap-1.5 font-mono text-[10px] text-red-500/90 tracking-widest bg-black/75 backdrop-blur-sm px-2.5 py-1 rounded border border-red-500/40 shadow-lg pointer-events-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span>⌖ FORENSIC SCAN // 99.4% MATCH</span>
                  </div>

                  {/* Lower Coordinate Node (Near Cane) */}
                  <div className="absolute bottom-[20%] left-[14%] flex items-center gap-1.5 font-mono text-[10px] text-zinc-400 tracking-wider bg-black/75 backdrop-blur-sm px-2.5 py-1 rounded border border-zinc-800 shadow-lg pointer-events-none">
                    <span className="text-red-500 font-bold">●</span>
                    <span>CASE #0482 // DOSSIER ACTIVE</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Badge at Sherlock's feet */}
          <div
            className={`absolute bottom-16 right-12 md:right-20 px-4 py-2 rounded-full bg-zinc-950/85 border border-zinc-800 backdrop-blur-md shadow-2xl text-[11px] font-mono text-zinc-300 tracking-wider flex items-center gap-2 pointer-events-none z-30 transition-all duration-300 ${
              isSherlockHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2 group-hover/sherlock:opacity-100 group-hover/sherlock:translate-y-0"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>● SHERLOX SYSTEM ACTIVE // AWAITING QUERY</span>
          </div>
        </div>
      )}

      {/* Classified Case Dossier Modal Preview */}
      <ClassifiedDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        caseQuery={currentDossierQuery}
      />
    </section>
  );
};

export default HeroSection;
