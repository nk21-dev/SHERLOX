"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, AlertCircle, Loader2, Plus, LogOut } from "lucide-react";
import { CaseNoteResponse, ChatMessage } from "@/types/investigation";
import { CaseNote } from "./CaseNote";

interface InvestigationViewProps {
  initialQuery?: string;
  onBackToArchive: () => void;
  onNewInvestigation?: () => void;
  user?: {
    id?: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  } | null;
  onLogout?: () => void;
}

const QUICK_START_DOSSIERS = [
  {
    title: "The Fall of Silicon Valley Bank",
    tag: "FINANCIAL CASCADE",
    description:
      "48 hours. $42 Billion withdrawn in private WhatsApp chats. The fastest bank run in modern history.",
  },
  {
    title: "Operation Vijay: Kargil 1999",
    tag: "DECLASSIFIED GEOPOLITICS",
    description:
      "Sub-zero mountain combat, local shepherd alerts, and the intercepted Beijing phone transcripts.",
  },
  {
    title: "The OpenAI Boardroom Coup",
    tag: "CORPORATE EXILE",
    description:
      "A secret Friday ambush, 72 hours of chaos, and a 95% staff mutiny that shocked Silicon Valley.",
  },
  {
    title: "The Indus Valley Disappearance",
    tag: "ANCIENT ENIGMA",
    description:
      "A thriving Bronze Age civilization of 5 million people abandoned without evidence of warfare.",
  },
];

export const InvestigationView: React.FC<InvestigationViewProps> = ({
  initialQuery = "",
  onBackToArchive,
  onNewInvestigation,
  user,
  onLogout,
}) => {
  // Session-persisted state: restore from sessionStorage on mount/refresh
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = sessionStorage.getItem("sherlox_chat_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [inputQuery, setInputQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [latestFollowUps, setLatestFollowUps] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const savedDossier = sessionStorage.getItem("sherlox_active_dossier");
      if (savedDossier) {
        const parsed = JSON.parse(savedDossier);
        return parsed.followUpSuggestions || [];
      }
    } catch {}
    return [];
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasInitializedRef = useRef<boolean>(false);

  // Auto-scroll on message updates
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Whenever chatHistory updates, sync with sessionStorage:
  useEffect(() => {
    if (messages && messages.length > 0) {
      try {
        sessionStorage.setItem("sherlox_in_investigation", "true");
        sessionStorage.setItem("sherlox_chat_history", JSON.stringify(messages));
      } catch (err) {
        console.warn("sessionStorage save error", err);
      }
    }
  }, [messages]);

  // Adjust textarea height dynamically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputQuery]);

  // Start a fresh investigation in the chat without exiting to landing page
  const handleNewInvestigation = () => {
    // Clear active case data
    setMessages([]);
    setLatestFollowUps([]);
    setErrorMessage(null);
    setInputQuery("");

    // Clear session storage but keep in_investigation flag
    try {
      sessionStorage.setItem("sherlox_in_investigation", "true");
      sessionStorage.removeItem("sherlox_active_dossier");
      sessionStorage.removeItem("sherlox_chat_history");
    } catch (e) {
      console.error("Error clearing sessionStorage", e);
    }

    // Scroll to top of chat
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Focus input ready for typing
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);

    onNewInvestigation?.();
  };

  // Return to the bureau hero landing page without replaying the intro
  const handleReturnToArchive = () => {
    try {
      sessionStorage.removeItem("sherlox_in_investigation");
      sessionStorage.removeItem("sherlox_active_dossier");
      sessionStorage.removeItem("sherlox_chat_history");
    } catch (e) {
      // ignore
    }
    onBackToArchive();
  };

  // Core investigation dispatch
  const handleInvestigate = async (queryToRun: string) => {
    const trimmed = queryToRun.trim();
    if (!trimmed || isLoading) return;

    setErrorMessage(null);
    setInputQuery("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // 1. Add user question message
    const userMsgId = `user-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMsgId,
      role: "user",
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const nextHistoryWithUser = [...messages, userMessage];
    setMessages(nextHistoryWithUser);
    setIsLoading(true);

    try {
      // Save interim history with user query
      try {
        sessionStorage.setItem("sherlox_chat_history", JSON.stringify(nextHistoryWithUser));
      } catch (err) {
        console.warn("sessionStorage save error", err);
      }

      const res = await fetch("/api/investigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });

      const responseData = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(responseData?.error || `Server returned status ${res.status}`);
      }

      const caseData: CaseNoteResponse = responseData;

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        caseNote: caseData,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const finalHistory = [...nextHistoryWithUser, assistantMsg];
      setMessages(finalHistory);

      // Save complete case file and chat history to sessionStorage
      try {
        sessionStorage.setItem("sherlox_in_investigation", "true");
        sessionStorage.setItem("sherlox_active_dossier", JSON.stringify(caseData));
        sessionStorage.setItem("sherlox_chat_history", JSON.stringify(finalHistory));
      } catch (err) {
        console.warn("sessionStorage save error", err);
      }

      // Update suggested follow-up questions
      if (caseData.followUpSuggestions && caseData.followUpSuggestions.length > 0) {
        setLatestFollowUps(caseData.followUpSuggestions);
      }
    } catch (err: unknown) {
      console.error("[SHERLOX INVESTIGATION ERROR]:", err);
      const message = err instanceof Error ? err.message : "Forensic connection interrupted. Neural network failed to declassify evidence.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Run initial query on mount only if there is NO restored session history
  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      if (initialQuery && messages.length === 0) {
        handleInvestigate(initialQuery);
      }
    }
  }, [initialQuery, messages.length]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleInvestigate(inputQuery);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col selection:bg-red-950 selection:text-red-200">
      {/* Top Navigation Bar with Return & New Case Actions */}
      <header className="sticky top-0 z-30 w-full bg-black/80 backdrop-blur-xl border-b border-zinc-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
        <button
          onClick={handleReturnToArchive}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all text-xs font-mono group cursor-pointer"
          title="Return to Bureau Hero Landing"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>RETURN TO ARCHIVE</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] text-zinc-400 uppercase tracking-widest hidden md:inline">
              FORENSIC LINK ACTIVE
            </span>
          </div>

          {user && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono">
              <span className="text-zinc-500 text-[10px] uppercase hidden sm:inline">AGENT:</span>
              <span className="text-zinc-200 font-semibold max-w-[120px] truncate">{user.name}</span>
            </div>
          )}

          <button
            onClick={handleNewInvestigation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 hover:border-red-600 text-red-300 hover:text-white text-xs font-mono font-semibold transition-all shadow-[0_0_12px_rgba(220,38,38,0.25)] active:scale-98 cursor-pointer"
            title="Clear active case and start a new investigation"
          >
            <Plus className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">NEW INVESTIGATION</span>
            <span className="sm:hidden">NEW</span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-red-900/60 text-zinc-400 hover:text-red-400 text-xs font-mono transition-all cursor-pointer"
              title="Sign out of the Bureau"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">LOGOUT</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Single-Feed Conversational Stream */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 pt-8 pb-48">
        {/* Atmospheric Detective Dispatch Room (Empty Chat State) */}
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center text-center py-10 md:py-16 px-4">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 border border-red-500/30 text-red-400 font-mono text-xs tracking-widest uppercase mb-4 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span>● ACTIVE CONSOLE // AWAITING DIRECTIVE</span>
            </div>

            {/* Title */}
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-zinc-100 font-normal max-w-2xl tracking-tight leading-snug">
              Select a declassified dossier to begin, or interrogate any custom enigma below.
            </h2>

            {/* 2x2 Grid of Quick-Start Dossier Cards */}
            <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 px-2">
              {QUICK_START_DOSSIERS.map((card) => (
                <button
                  key={card.title}
                  onClick={() => handleInvestigate(card.title)}
                  className="relative bg-zinc-950/90 border border-zinc-800/80 hover:border-red-600/50 p-6 rounded-2xl text-left transition-all duration-300 hover:scale-[1.02] cursor-pointer group shadow-xl overflow-hidden flex flex-col justify-between"
                >
                  {/* Glowing Red Corner Marker */}
                  <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none">
                    <div className="absolute top-0 right-0 w-12 h-1.5 bg-red-600/40 group-hover:bg-red-500 group-hover:shadow-[0_0_8px_#ef4444] transition-all rotate-45 transform origin-top-right" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="font-mono text-[10px] text-red-400/90 border border-red-900/60 bg-red-950/40 px-2 py-0.5 rounded uppercase tracking-wider font-semibold">
                        {card.tag}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg sm:text-xl font-medium text-zinc-100 group-hover:text-red-200 transition-colors">
                      {card.title}
                    </h3>

                    <p className="font-sans text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between text-xs font-mono text-zinc-500 group-hover:text-red-400 transition-colors">
                    <span>INITIATE DECLASSIFICATION</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Feed */}
        <div className="flex flex-col gap-6">
          {messages.map((msg) => (
            <React.Fragment key={msg.id}>
              {msg.role === "user" ? (
                /* User Query Pill */
                <div className="flex justify-end my-2">
                  <div className="max-w-xl bg-zinc-900/90 border border-zinc-700/60 rounded-2xl px-5 py-3 shadow-lg flex flex-col items-end">
                    <span className="font-mono text-[9px] text-red-400/90 tracking-widest uppercase mb-1">
                      INVESTIGATIVE INQUIRY
                    </span>
                    <p className="font-mono text-sm sm:text-base text-zinc-200">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ) : (
                /* AI Declassified Case Note */
                msg.caseNote && <CaseNote data={msg.caseNote} />
              )}
            </React.Fragment>
          ))}

          {/* Inline Loading Decryption Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-zinc-950/60 border border-amber-500/30 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center gap-3 my-4 backdrop-blur-md shadow-xl"
            >
              <div className="flex items-center gap-2 text-amber-400">
                <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                <span className="font-mono text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase">
                  DECRYPTING EVIDENCE DOSSIER // VERIFYING NEURAL REGISTRY...
                </span>
              </div>
              <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest text-center">
                CROSS-REFERENCING HISTORICAL LEDGERS &bull; SOURCING MULTI-PHOTO ARCHIVES &bull; FACTUAL RIGOR ENFORCED
              </p>
              <div className="w-48 h-1 bg-zinc-900 rounded-full overflow-hidden border border-amber-500/20 mt-1">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                  className="w-1/2 h-full bg-gradient-to-r from-transparent via-amber-500 to-transparent"
                />
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-start gap-3 p-4 bg-red-950/40 border border-red-800/60 rounded-xl text-red-200 text-sm font-mono my-2 shadow-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-red-300">INVESTIGATION SUSPENDED</span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </main>

      {/* Bottom-Docked Input Bar & Suggested Follow-Ups */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/95 to-transparent z-40 pointer-events-none">
        <div className="max-w-3xl mx-auto flex flex-col gap-2.5 pointer-events-auto">
          {/* Suggested Follow-Up Pills */}
          <AnimatePresence>
            {latestFollowUps.length > 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1"
              >
                <span className="font-mono text-[9px] text-zinc-500 tracking-wider uppercase flex-shrink-0 px-1">
                  SUGGESTED:
                </span>
                {latestFollowUps.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleInvestigate(suggestion)}
                    className="flex-shrink-0 px-3 py-1 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-red-600/50 text-zinc-300 hover:text-white text-xs font-mono transition-all shadow-md group flex items-center gap-1.5"
                  >
                    <span>{suggestion}</span>
                    <span className="text-red-500 group-hover:translate-x-0.5 transition-transform">→</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Input Container */}
          <div className="w-full bg-zinc-900/85 backdrop-blur-2xl border border-zinc-800 rounded-2xl p-2 pl-4 flex items-center shadow-2xl focus-within:border-zinc-700 transition-all">
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Or type any war, corporate collapse, or mystery here..."
              disabled={isLoading}
              className="flex-1 bg-transparent text-sm sm:text-base text-zinc-100 placeholder:text-zinc-500 focus:outline-none resize-none py-1.5 max-h-32"
            />

            <button
              onClick={() => handleInvestigate(inputQuery)}
              disabled={isLoading || !inputQuery.trim()}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:hover:bg-red-600 text-white font-mono text-xs font-semibold tracking-wider transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] ml-2"
            >
              <span>Investigate</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
