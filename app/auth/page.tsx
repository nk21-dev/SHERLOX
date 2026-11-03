'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Lock, Mail, User, CheckCircle2, AlertCircle, Shield } from 'lucide-react';

type AuthMode = 'signin' | 'signup' | 'forgot' | 'reset';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Mode resolution
  const queryMode = searchParams.get('mode') as AuthMode | null;
  const [mode, setMode] = useState<AuthMode>(() => {
    if (queryMode === 'signup' || queryMode === 'forgot' || queryMode === 'reset') {
      return queryMode;
    }
    return 'signin';
  });

  // Sync mode with query params if they change externally
  useEffect(() => {
    if (queryMode && ['signin', 'signup', 'forgot', 'reset'].includes(queryMode)) {
      setMode(queryMode);
    }
  }, [queryMode]);

  // Check if session already active; if so, redirect directly to dashboard
  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data?.authenticated) {
          const returnUrl = searchParams.get('returnUrl') || '/dashboard';
          router.replace(returnUrl);
        }
      })
      .catch(() => {});
  }, [router, searchParams]);

  // Check query errors
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setErrorMsg(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  // Form Fields - strictly empty defaults for all visitors
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & Validation States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  // Hydration-safe year
  const [year, setYear] = useState(2026);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  // Ensure continuous muted playback of the detective office background video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        const handleUnlock = () => {
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
          window.removeEventListener('click', handleUnlock);
          window.removeEventListener('touchstart', handleUnlock);
        };
        window.addEventListener('click', handleUnlock, { once: true });
        window.addEventListener('touchstart', handleUnlock, { once: true });
      });
    }
  }, []);

  const switchMode = (newMode: AuthMode) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setMode(newMode);
    router.replace(`/auth?mode=${newMode}`, { scroll: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Frontend validation
    if (mode === 'signup' || mode === 'reset') {
      if (password.length < 8) {
        setErrorMsg('Clearance passcode must contain at least 8 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Clearance passcodes do not match. Please re-enter.');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === 'signin') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          setErrorMsg(data?.error || 'Invalid agent email or clearance passcode.');
          setIsLoading(false);
          return;
        }

        setSuccessMsg('Clearance authorized. Entering Bureau console...');
        setTimeout(() => {
          const returnUrl = searchParams.get('returnUrl') || data.redirectTo || '/dashboard';
          router.push(returnUrl);
        }, 500);
      } else if (mode === 'signup') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, confirmPassword }),
        });
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          setErrorMsg(data?.error || 'Registration failed.');
          setIsLoading(false);
          return;
        }

        setSuccessMsg('Recruit credentials registered. Establishing console session...');
        setTimeout(() => {
          const returnUrl = searchParams.get('returnUrl') || data.redirectTo || '/dashboard';
          router.push(returnUrl);
        }, 500);
      } else if (mode === 'forgot') {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          setErrorMsg(data?.error || 'Clearance dispatch could not be transmitted.');
          setIsLoading(false);
          return;
        }

        setResetSent(true);
        setSuccessMsg(data.message || `Clearance dispatch sent to ${email}. Check your inbox.`);
        setIsLoading(false);
      } else if (mode === 'reset') {
        const token = searchParams.get('token');
        if (!token) {
          setErrorMsg('Missing clearance recovery token. Please utilize the link dispatched to your email.');
          setIsLoading(false);
          return;
        }

        const res = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, password, confirmPassword }),
        });
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          setErrorMsg(data?.error || 'Failed to update clearance passcode.');
          setIsLoading(false);
          return;
        }

        setSuccessMsg('Clearance passcode updated successfully. Please sign in with your new credentials.');
        setIsLoading(false);
        setTimeout(() => {
          switchMode('signin');
        }, 1200);
      }
    } catch (err: unknown) {
      console.error('[SHERLOX AUTH ERROR]:', err);
      setErrorMsg('Bureau communications link failed. Please check network connection.');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen h-[100svh] w-full bg-black text-white selection:bg-red-950 selection:text-red-200 overflow-y-auto lg:overflow-hidden flex flex-col justify-between">
      
      {/* ======================================================== */}
      {/* 1. CINEMATIC FULL-VIEWPORT BACKGROUND VIDEO              */}
      {/* ======================================================== */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="fixed inset-0 w-full h-full object-cover object-center md:object-[68%_center] z-0 pointer-events-none"
      >
        <source src="/media/sherlox-auth-bg.mp4" type="video/mp4" />
        <source src="/media/gemini_generated_video_37ce98e5 (online-video-cutter.com).mp4" type="video/mp4" />
      </video>

      {/* Subtle Global Dark Tint (Ensures detective, warm desk-lamp & smoke stay clearly visible) */}
      <div className="fixed inset-0 bg-black/35 z-[1] pointer-events-none" />

      {/* Atmospheric Noir Gradient: Gently Darker on Left Behind Form, Luminous & Clear Over Detective */}
      <div className="fixed inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent z-[1] pointer-events-none" />

      {/* Gentle Radial Vignette */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.65)_100%)] z-[1] pointer-events-none" />

      {/* Subtle Film Grain Texture */}
      <div className="fixed inset-0 film-grain opacity-20 pointer-events-none z-[1]" />

      {/* ======================================================== */}
      {/* 2. TOP NAV: RETURN TO ARCHIVE & HUD TELEMETRY            */}
      {/* ======================================================== */}
      <motion.header 
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative z-20 w-full h-14 sm:h-16 px-6 sm:px-10 lg:px-16 flex items-center justify-between shrink-0"
      >
        <Link 
          href="/" 
          className="group inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer bg-black/40 hover:bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-800/70 hover:border-zinc-700"
        >
          <span className="text-zinc-500 group-hover:text-red-400 group-hover:-translate-x-1 transition-all">←</span>
          <span className="tracking-wider uppercase font-semibold text-[10px] sm:text-[11px]">RETURN TO ARCHIVE</span>
        </Link>
      </motion.header>

      {/* ======================================================== */}
      {/* 3. MAIN AUTH CONTENT (REFINED TRANSLUCENT COMPACT TERMINAL)*/}
      {/* ======================================================== */}
      <main className="relative z-20 w-full flex-1 flex items-center px-6 sm:px-10 lg:pl-16 xl:pl-20 py-2 min-h-0">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[480px] lg:max-w-[500px]"
        >
          
          {/* Refined Translucent Dark-Glass Panel (75% Opacity, Clearance Badge Removed) */}
          <div className="w-full rounded-2xl border border-zinc-800/60 bg-black/75 backdrop-blur-md p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            
            {/* Panel Header: Logo & Dot only (No Badge) */}
            <div className="flex items-center justify-between pb-2.5 mb-3.5 border-b border-zinc-900/60">
              <Link href="/" className="flex items-center gap-2 group">
                <span className="font-serif font-bold text-xl sm:text-2xl tracking-tight text-white group-hover:text-red-200 transition-colors">
                  SHERLOX
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              </Link>
            </div>

            {/* 1 & 2. Heading & Supporting Sentence */}
            <div className="mb-3.5">
              <h1 className="text-xl sm:text-2xl font-serif text-white tracking-tight leading-snug mb-1">
                {mode === 'signin' && 'Welcome back, Agent.'}
                {mode === 'signup' && 'Join the Bureau.'}
                {mode === 'forgot' && 'Lost your access?'}
                {mode === 'reset' && 'Reset Clearance Passcode.'}
              </h1>
              <p className="text-zinc-400 text-xs font-sans font-light leading-relaxed">
                {mode === 'signin' && 'Your next case is waiting. Sign in and get back to the investigation.'}
                {mode === 'signup' && 'Create your account and start uncovering the stories behind the headlines.'}
                {mode === 'forgot' && "It happens. Enter your email and we'll help you get back into the Bureau."}
                {mode === 'reset' && 'Enter your new credentials to regain access to your dossiers.'}
              </p>
            </div>

            {/* 3. Mode Switcher Tabs (Sign In / Join Bureau) */}
            {(mode === 'signin' || mode === 'signup') && (
              <div className="grid grid-cols-2 p-1 bg-zinc-950/70 border border-zinc-800/60 rounded-xl mb-3.5">
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className={`py-1.5 text-xs font-mono rounded-lg transition-all cursor-pointer ${
                    mode === 'signin' 
                      ? 'bg-zinc-800/90 text-white font-semibold shadow-inner border border-zinc-700/60' 
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  AGENT SIGN IN
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className={`py-1.5 text-xs font-mono rounded-lg transition-all cursor-pointer ${
                    mode === 'signup' 
                      ? 'bg-zinc-800/90 text-white font-semibold shadow-inner border border-zinc-700/60' 
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  JOIN BUREAU
                </button>
              </div>
            )}

            {/* Notifications */}
            <AnimatePresence mode="wait">
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="mb-3 p-2.5 rounded-xl bg-red-950/50 border border-red-900/70 flex items-center gap-2 text-xs text-red-300 font-sans"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}

              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="mb-3 p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-900/70 flex items-center gap-2 text-xs text-emerald-300 font-sans"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FORGOT PASSWORD CONFIRMATION */}
            {mode === 'forgot' && resetSent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col gap-3 text-center"
              >
                <div className="w-10 h-10 mx-auto rounded-full bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center text-emerald-400">
                  <Mail className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-sm text-white font-medium">
                  Dispatch Broadcasted
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                  An encrypted passcode recovery link has been dispatched to <strong className="text-zinc-200">{email}</strong>. Check your inbox to proceed.
                </p>
                <div className="pt-1 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setResetSent(false)}
                    className="w-full py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
                  >
                    Resend Dispatch
                  </button>
                  <button
                    type="button"
                    onClick={() => switchMode('signin')}
                    className="w-full py-1 text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                  >
                    ← Return to Agent Login
                  </button>
                </div>
              </motion.div>
            ) : (
              /* AUTHENTICATION FORM FIELDS (Empty Defaults) */
              <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col gap-2.5">
                
                {/* Agent Call-sign (Sign up only) */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <User className="w-3 h-3 text-zinc-500" />
                      <span>Agent Call-sign / Name</span>
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name or call-sign"
                      className="w-full bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 focus:border-red-500/80 focus:ring-1 focus:ring-red-500/30 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-all"
                    />
                  </div>
                )}

                {/* 4. Agent Email Field */}
                {mode !== 'reset' && (
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-zinc-500" />
                      <span>Agent Email Address</span>
                    </label>
                    <input
                      type="email"
                      required
                      autoComplete="off"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 focus:border-red-500/80 focus:ring-1 focus:ring-red-500/30 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-all"
                    />
                  </div>
                )}

                {/* 5. Passcode Field (Hidden during forgot password mode) */}
                {mode !== 'forgot' && (
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-zinc-500" />
                      <span>{mode === 'reset' ? 'New Clearance Passcode' : 'Clearance Passcode'}</span>
                    </label>

                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 focus:border-red-500/80 focus:ring-1 focus:ring-red-500/30 rounded-xl px-3.5 py-2 pr-10 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide passcode' : 'Show passcode'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Confirm Passcode (Signup & Reset modes) */}
                {(mode === 'signup' || mode === 'reset') && (
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Shield className="w-3 h-3 text-zinc-500" />
                      <span>Confirm Passcode</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        className="w-full bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 focus:border-red-500/80 focus:ring-1 focus:ring-red-500/30 rounded-xl px-3.5 py-2 pr-10 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? 'Hide passcode' : 'Show passcode'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* 6. Forgot Password Link (Login mode) */}
                {mode === 'signin' && (
                  <div className="flex justify-end -mt-0.5">
                    <button
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="text-[11px] font-mono text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      Lost your access?
                    </button>
                  </div>
                )}

                {/* 7. Primary Action Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-1.5 w-full py-2.5 sm:py-2.75 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium text-xs sm:text-sm transition-all shadow-[0_0_18px_rgba(239,68,68,0.35)] hover:shadow-[0_0_28px_rgba(239,68,68,0.5)] cursor-pointer flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>
                        {mode === 'signin' && 'Enter the Bureau'}
                        {mode === 'signup' && 'Join the Bureau'}
                        {mode === 'forgot' && 'Send Reset Dispatch'}
                        {mode === 'reset' && 'Update Clearance'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Forgot & Reset mode back button */}
                {(mode === 'forgot' || mode === 'reset') && (
                  <button
                    type="button"
                    onClick={() => switchMode('signin')}
                    className="mt-1 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer text-center"
                  >
                    ← Return to Agent Login
                  </button>
                )}
              </form>
            )}



            {/* 10. Signup/Login Navigation */}
            <div className="mt-3.5 pt-2.5 border-t border-zinc-900/60 text-center text-xs font-mono text-zinc-400">
              {mode === 'signin' && (
                <span>
                  New recruit?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('signup')}
                    className="text-red-400 hover:text-red-300 underline underline-offset-4 cursor-pointer font-semibold ml-1"
                  >
                    Join the Bureau →
                  </button>
                </span>
              )}

              {mode === 'signup' && (
                <span>
                  Already part of the Bureau?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('signin')}
                    className="text-red-400 hover:text-red-300 underline underline-offset-4 cursor-pointer font-semibold ml-1"
                  >
                    Sign in →
                  </button>
                </span>
              )}
            </div>

          </div>

          {/* Metadata Beneath Card */}
          <div className="mt-2.5 px-3 flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <span>ENCRYPTED // SHA-256</span>
            <span>SHERLOX BUREAU © {year}</span>
          </div>

        </motion.div>
      </main>

      {/* ======================================================== */}
      {/* 4. FLOATING EDITORIAL ACCENT (BOTTOM-RIGHT)              */}
      {/* ======================================================== */}
      <footer className="relative z-20 w-full h-10 sm:h-12 px-6 sm:px-10 lg:px-16 flex items-center justify-between shrink-0 pointer-events-none">
        <div className="hidden lg:block text-[10px] font-mono text-zinc-500">
          <span>CLASSIFIED ACCESS TERMINAL</span>
        </div>

        {/* Cinematic Editorial Quote on the right */}
        <div className="hidden md:block max-w-sm text-right">
          <span className="font-serif italic text-white/90 text-xs sm:text-sm tracking-tight block">
            "EVERY STORY HAS A SECRET."
          </span>
          <span className="font-sans text-zinc-400 text-[11px] font-light block mt-0.5">
            Somewhere between the headlines and the truth lies the real story.
          </span>
        </div>
      </footer>

    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense 
      fallback={
        <div className="h-screen bg-black flex items-center justify-center text-zinc-500 font-mono text-xs">
          [ DECRYPTING BUREAU TERMINAL... ]
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
