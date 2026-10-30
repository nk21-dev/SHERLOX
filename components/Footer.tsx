"use client";

import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-800/80 bg-black text-zinc-400 py-16 px-6 md:px-16 relative overflow-hidden z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        {/* Brand & Mission */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-red-500 font-serif font-bold text-xl">SHERLOX</span>
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded">
              LEVEL 5 INTELLIGENCE BUREAU
            </span>
          </div>
          <p className="text-zinc-500 text-sm max-w-sm">
            Autonomous forensic reconstruction engine for historical, corporate, and geopolitical enigmas.
          </p>
          <span className="font-mono text-[11px] text-zinc-600">
            © 2026 SHERLOX ARCHIVES. ALL DECLASSIFIED RIGHTS RESERVED.
          </span>
        </div>

        {/* Architect Dossier Card (Nithish Kumar) */}
        <div className="bg-zinc-950 border border-zinc-800 hover:border-red-500/40 transition-all rounded-xl p-5 flex flex-col gap-3 shadow-xl max-w-md w-full md:w-auto">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="font-mono text-[10px] text-red-500 tracking-widest uppercase font-semibold">
                LEAD ARCHITECT DOSSIER
              </span>
            </div>
            <span className="font-mono text-[9px] text-zinc-600 uppercase">SYS-AUTHOR // NK21</span>
          </div>

          <div className="flex flex-col">
            <span className="font-serif text-lg text-zinc-100 font-medium">Nithish Kumar Chirukuripati</span>
            <span className="font-mono text-xs text-zinc-500">Developer & Systems Architect</span>
          </div>

          {/* Social Dispatch Links */}
          <div className="flex items-center gap-3 pt-2">
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/nithish-kumar-chirukuripati-1a0358338"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono transition-all"
            >
              <svg className="w-3.5 h-3.5 fill-current text-[#0A66C2]" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.2a1.62 1.62 0 0 0-1.62 1.63c0 .9.72 1.63 1.62 1.63s1.62-.73 1.62-1.63c0-.9-.72-1.63-1.62-1.63Z" />
              </svg>
              <span>LinkedIn</span>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/nk21-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono transition-all"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
              </svg>
              <span>GitHub</span>
            </a>

            {/* Email Dispatch */}
            <a
              href="mailto:nithishkumarchirukuripati21@gmail.com"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-300 hover:text-red-200 text-xs font-mono transition-all"
            >
              <span>✉ Dispatch</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
