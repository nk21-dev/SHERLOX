"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Sparkles, AlertCircle, CornerDownLeft, Loader2 } from "lucide-react";
import { CaseNoteResponse, ChatMessage } from "@/types/investigation";
import { CaseNote } from "./CaseNote";

interface InvestigationViewProps {
  initialQuery?: string;
  onBackToArchive: () => void;
}

export const InvestigationView: React.FC<InvestigationViewProps> = ({
  initialQuery = "",
  onBackToArchive,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [latestFollowUps, setLatestFollowUps] = useState<string[]>([]);

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

  // Adjust textarea height dynamically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputQuery]);

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

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/investigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const caseData: CaseNoteResponse = await res.json();

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        caseNote: caseData,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Update suggested follow-up questions
      if (caseData.followUpSuggestions && caseData.followUpSuggestions.length > 0) {
        setLatestFollowUps(caseData.followUpSuggestions);
      }
    } catch (err: any) {
      console.error("Investigation API error:", err);
      setErrorMessage("Forensic connection interrupted. Neural network failed to declassify evidence.");
    } finally {
      setIsLoading(false);
    }
  };

  // Run initial query on mount if passed
  useEffect(() => {
    if (!hasInitializedRef.current && initialQuery) {
      hasInitializedRef.current = true;
      handleInvestigate(initialQuery);
    }
  }, [initialQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleInvestigate(inputQuery);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col selection:bg-red-950 selection:text-red-200">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 w-full bg-black/80 backdrop-blur-xl border-b border-zinc-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
        <button
          onClick={onBackToArchive}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all text-xs font-mono group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>RETURN TO ARCHIVE</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] text-zinc-400 uppercase tracking-widest hidden sm:inline">
              FORENSIC LINK ACTIVE
            </span>
          </div>
          <span className="font-mono text-[10px] text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded uppercase hidden md:inline">
            DUAL-GATEWAY: GEMINI + GROQ
          </span>
        </div>
      </header>

      {/* Main Single-Feed Conversational Stream */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 pt-8 pb-48">
        {/* Welcome Brief if no messages */}
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center text-center py-20 px-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 text-red-500 shadow-xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-zinc-100 font-normal">
              Sherlox Declassification Terminal
            </h2>
            <p className="text-zinc-400 text-sm max-w-md mt-2 leading-relaxed">
              Inquire about any historical enigma, geopolitical conflict, or corporate collapse.
              The dual-gateway reconstructs the sequence of events with authentic archival photography.
            </p>

            <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-lg">
              {[
                "Collapse of Silicon Valley Bank",
                "1999 Kargil Strategic Recon",
                "The Indus Valley Disappearance",
                "OpenAI Boardroom Coup",
              ].map((starter) => (
                <button
                  key={starter}
                  onClick={() => handleInvestigate(starter)}
                  className="px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-red-900/60 text-xs text-zinc-300 font-mono transition-all"
                >
                  {starter} →
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
                CROSS-REFERENCING PUBLIC LEDGERS &bull; SOURCING WIKIMEDIA ARCHIVES &bull; DUAL GATEWAY ACTIVE
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
            <div className="flex items-center gap-3 p-4 bg-red-950/40 border border-red-800/60 rounded-xl text-red-200 text-sm font-mono my-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
              <span>{errorMessage}</span>
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
              placeholder="Investigate an event, scandal, or historical mystery..."
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
