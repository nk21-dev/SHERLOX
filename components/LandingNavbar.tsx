'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface LandingNavbarProps {
  isVisible: boolean;
  authUser: { name: string; email: string } | null;
  onAuthRedirect: (mode: 'signin' | 'signup') => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  isVisible,
  authUser,
  onAuthRedirect,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          key="sticky-landing-navbar"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed top-0 left-0 right-0 z-40 w-full px-6 md:px-14 py-4 md:py-5 flex items-center justify-between bg-black/85 backdrop-blur-xl border-b border-zinc-800/80 transition-all select-none"
        >
          {/* Left Side: Logo & Website Brand */}
          <Link
            href="/"
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <span className="font-serif font-bold text-xl tracking-tight text-white group-hover:text-red-100 transition-colors">
              SHERLOX
            </span>
            <span className="hidden sm:inline text-xs font-mono text-zinc-500 border-l border-zinc-800 pl-3">
              The Archive of Global Mysteries
            </span>
          </Link>

          {/* Right Side: Account Controls */}
          <div className="flex items-center gap-2">
            {authUser ? (
              <Link
                href="/dashboard"
                className="px-4 py-1.5 rounded-full text-xs font-mono font-medium text-zinc-200 hover:text-white bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-800 hover:border-red-600/60 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm group hover:shadow-[0_0_12px_rgba(220,38,38,0.25)]"
              >
                <span>Enter Chat</span>
                <span className="text-red-500 group-hover:translate-x-0.5 transition-transform font-bold">&rarr;</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => onAuthRedirect('signin')}
                  className="px-3.5 py-1.5 rounded-full text-xs font-mono text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => onAuthRedirect('signup')}
                  className="px-3.5 py-1.5 rounded-full text-xs font-mono text-white bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all font-semibold cursor-pointer"
                >
                  Join Bureau
                </button>
              </div>
            )}
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
};

export default LandingNavbar;

