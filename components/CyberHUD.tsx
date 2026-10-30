"use client";

import React from "react";
import { Search } from "lucide-react";

interface EditorialNavbarProps {
  isMuted: boolean;
  toggleAudio: () => void;
  isHeroReady?: boolean;
}

export const EditorialNavbar: React.FC<EditorialNavbarProps> = ({
  isMuted,
  toggleAudio,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 sm:px-12 md:px-16 py-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-auto backdrop-blur-[2px]">
      {/* Left: Sleek Brand Mark */}
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

      {/* Right: Audio Toggle directly bound to video native audio */}
      <div className="flex items-center gap-4 text-xs font-mono">
        <button
          onClick={toggleAudio}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[11px] font-medium tracking-wider transition-all duration-300 ${
            !isMuted
              ? "bg-emerald-950/80 border-emerald-500/80 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.35)]"
              : "bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
          }`}
          title={isMuted ? "Click to unmute native video audio" : "Click to mute audio"}
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              !isMuted ? "bg-emerald-400 animate-ping" : "bg-zinc-500"
            }`}
          />
          <span>{isMuted ? "AUDIO: MUTED 🔇" : "AUDIO: ON 🔊"}</span>
        </button>
      </div>
    </header>
  );
};

export const CyberHUD = EditorialNavbar;
