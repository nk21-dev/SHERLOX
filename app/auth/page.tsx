'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

function AuthContent() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 3D Parallax Mouse Tracking for Right Side Sherlock
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 100 };
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Frontend demo notification
    alert(isSignUp ? 'New recruit credentials submitted.' : 'Agent credentials authorized.');
  };

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col lg:flex-row select-none overflow-hidden">
      
      {/* ======================================================== */}
      {/* LEFT COLUMN: NOIR AUTH TERMINAL                          */}
      {/* ======================================================== */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 z-20 bg-black relative border-r border-zinc-900">
        
        {/* Top Back Link & Monogram */}
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-white transition-colors"
          >
            <span>←</span>
            <span>RETURN TO ARCHIVE</span>
          </Link>

          <span className="font-serif font-bold text-xl tracking-tight text-white">
            SHERLOX
          </span>
        </div>

        {/* Central Auth Form */}
        <div className="max-w-md w-full mx-auto my-auto py-10">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-[10px] font-mono text-zinc-400 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>LEVEL 5 CLEARANCE // ACCESS CONTROL</span>
          </div>

          <h1 className="text-4xl font-serif text-white tracking-tight mb-2">
            {isSignUp ? 'Enlist in the Bureau.' : 'Welcome back, Agent.'}
          </h1>
          <p className="text-zinc-400 text-sm font-sans mb-8">
            {isSignUp 
              ? 'Create your clearance credentials to save dossiers and decrypt classified files.'
              : 'Enter your clearance credentials to access active investigations.'}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-zinc-950 border border-zinc-900 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`py-2 text-xs font-mono rounded-lg transition-all ${
                !isSignUp 
                  ? 'bg-zinc-900 text-white font-semibold shadow' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              AGENT LOGIN
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`py-2 text-xs font-mono rounded-lg transition-all ${
                isSignUp 
                  ? 'bg-zinc-900 text-white font-semibold shadow' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              NEW RECRUIT
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                Agent Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agent@sherlox.bureau"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500/80 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                Passcode
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500/80 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-all"
              />
            </div>

            {isSignUp && (
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                  Confirm Passcode
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500/80 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-all"
                />
              </div>
            )}

            <button
              type="submit"
              className="mt-2 w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium text-sm transition-all shadow-[0_0_25px_rgba(239,68,68,0.35)] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isSignUp ? 'ENLIST IN ARCHIVE' : 'AUTHORIZE ACCESS'}</span>
              <span>→</span>
            </button>
          </form>

          {/* Social Auth Separator */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="w-full border-t border-zinc-900" />
            <span className="absolute px-3 bg-black text-[10px] font-mono text-zinc-600 uppercase">
              OR DIRECT VERIFICATION
            </span>
          </div>

          {/* Google Single Sign-On Button */}
          <button
            type="button"
            onClick={() => alert('Google authentication integration point.')}
            className="w-full py-3 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.2 8.9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.6 7.2C.6 9.2 0 11.5 0 14s.6 4.8 1.6 6.8l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.2-6.7-5.3L1.6 16c1.9 3.8 5.8 7 10.4 7z"
              />
            </svg>
            <span>CONTINUE WITH GOOGLE</span>
          </button>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-600">
          <span>ENCRYPTED // SHA-256</span>
          <span>SHERLOX BUREAU © {year}</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* RIGHT COLUMN: 3D HOLOGRAPHIC SHERLOCK CHAMBER            */}
      {/* ======================================================== */}
      <div 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="hidden lg:flex w-1/2 min-h-screen relative items-center justify-center bg-black overflow-hidden [perspective:1200px]"
      >
        {/* Holographic Ambient Wireframe Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:28px_28px] opacity-40 pointer-events-none" />

        {/* Glowing Background Radial Light */}
        <div className="absolute w-[450px] h-[450px] rounded-full bg-red-600/10 blur-[140px] pointer-events-none" />

        {/* Floating Surveillance Telemetry */}
        <div className="absolute top-12 right-12 z-20 flex flex-col items-end gap-1 font-mono text-[10px] text-zinc-500 pointer-events-none">
          <div className="flex items-center gap-2 bg-zinc-950/80 px-3 py-1 rounded-full border border-zinc-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-300">SURVEILLANCE NODE: ACTIVE</span>
          </div>
          <span className="text-zinc-600">HOLOGRAM ID: #0482</span>
        </div>

        {/* Interactive 3D Character Model with Cursor Parallax */}
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          className="relative w-full h-[85vh] flex items-center justify-center pointer-events-none"
        >
          {/* Cyber-Detective Video / Visual */}
          <video
            src="/media/gemini_generated_video_988681c8-clean.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain filter contrast-[1.12] drop-shadow-[0_0_40px_rgba(239,68,68,0.25)]"
          />

          {/* 3D Holographic Reticle Ring at Feet */}
          <div 
            style={{ transform: 'rotateX(75deg) translateZ(-60px)' }}
            className="absolute bottom-16 w-80 h-80 rounded-full border border-red-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.2)]"
          >
            <div className="w-64 h-64 rounded-full border border-dashed border-red-500/20 animate-spin-slow" />
            <div className="w-48 h-48 rounded-full border border-zinc-700/40" />
          </div>
        </motion.div>

        {/* Bottom Status */}
        <div className="absolute bottom-10 z-20 font-mono text-[10px] text-red-500/70 tracking-widest uppercase bg-black/80 px-3 py-1 rounded-full border border-red-950">
          [ ⌖ 3D HOLOGRAM ACTIVE // AWAITING CREDENTIALS ]
        </div>
      </div>

    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 font-mono">LOADING BUREAU...</div>}>
      <AuthContent />
    </Suspense>
  );
}

