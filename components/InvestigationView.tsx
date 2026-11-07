"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Send,
  AlertCircle,
  Loader2,
  Plus,
  LogOut,
  User as UserIcon,
  Camera,
  Edit2,
  Check,
  X,
} from "lucide-react";
import { CaseNoteResponse, ChatMessage } from "@/types/investigation";
import { CaseNote } from "./CaseNote";

interface UserProfileData {
  id?: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

interface InvestigationViewProps {
  initialQuery?: string;
  onBackToArchive: () => void;
  onNewInvestigation?: () => void;
  user?: UserProfileData | null;
  onUserUpdate?: (user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  }) => void;
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
  user: initialUser,
  onUserUpdate,
  onLogout,
}) => {
  // Local user state for immediate UI responsiveness
  const [currentUser, setCurrentUser] = useState<UserProfileData | null | undefined>(
    initialUser
  );

  useEffect(() => {
    setCurrentUser(initialUser);
  }, [initialUser]);

  // Profile Menu state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(initialUser?.name || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditingName && currentUser?.name) {
      setNameInput(currentUser.name);
    }
  }, [currentUser?.name, isEditingName]);

  // Click-outside listener to close the profile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
        setIsEditingName(false);
        setProfileError(null);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isProfileOpen]);

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasInitializedRef = useRef<boolean>(false);

  // Auto-scroll on message updates
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    chatEndRef.current?.scrollIntoView({ behavior, block: "end" });
  };

  useEffect(() => {
    scrollToBottom("smooth");
  }, [messages, isLoading]);

  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        scrollToBottom("instant");
      }, 60);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        128
      )}px`;
    }
  }, [inputQuery]);

  // Whenever chatHistory updates, sync with sessionStorage:
  useEffect(() => {
    if (messages && messages.length > 0) {
      try {
        sessionStorage.setItem("sherlox_in_investigation", "true");
        sessionStorage.setItem("sherlox_chat_history", JSON.stringify(messages));
      } catch {}
    }
  }, [messages]);

  // Client-side image compression using canvas
  const resizeImageToDataUrl = (file: File, maxSize = 256): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.type === "image/svg+xml") {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxSize) {
              height = Math.round((height * maxSize) / width);
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = Math.round((width * maxSize) / height);
              height = maxSize;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        };
        img.onerror = () => reject(new Error("Failed to process image file"));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read image file"));
      reader.readAsDataURL(file);
    });
  };

  // Avatar upload handler
  const handleAvatarFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProfileError("File must be an image (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setProfileError("Image size must be under 5MB.");
      return;
    }

    setIsSavingProfile(true);
    setProfileError(null);
    setProfileSuccess(null);

    try {
      const compressedDataUrl = await resizeImageToDataUrl(file, 256);
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: compressedDataUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile picture.");
      }

      setCurrentUser((prev) => (prev ? { ...prev, avatarUrl: data.user.avatarUrl } : data.user));
      if (onUserUpdate && data.user) {
        onUserUpdate(data.user);
      }
      setProfileSuccess("Avatar updated successfully.");
      setTimeout(() => setProfileSuccess(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error updating avatar";
      setProfileError(msg);
    } finally {
      setIsSavingProfile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Remove avatar handler
  const handleRemoveAvatar = async () => {
    setIsSavingProfile(true);
    setProfileError(null);
    setProfileSuccess(null);

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: null }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to remove avatar.");
      }

      setCurrentUser((prev) => (prev ? { ...prev, avatarUrl: null } : data.user));
      if (onUserUpdate && data.user) {
        onUserUpdate(data.user);
      }
      setProfileSuccess("Avatar removed.");
      setTimeout(() => setProfileSuccess(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error removing avatar";
      setProfileError(msg);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Save agent codename handler
  const handleSaveName = async () => {
    const trimmed = nameInput.trim();
    if (!trimmed || trimmed.length < 2) {
      setProfileError("Codename must be at least 2 characters.");
      return;
    }
    if (trimmed.length > 50) {
      setProfileError("Codename cannot exceed 50 characters.");
      return;
    }

    setIsSavingProfile(true);
    setProfileError(null);
    setProfileSuccess(null);

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update codename.");
      }

      setCurrentUser((prev) => (prev ? { ...prev, name: data.user.name } : data.user));
      if (onUserUpdate && data.user) {
        onUserUpdate(data.user);
      }
      setIsEditingName(false);
      setProfileSuccess("Codename updated.");
      setTimeout(() => setProfileSuccess(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving codename";
      setProfileError(msg);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Perform logout
  const handleLogoutAction = () => {
    setIsProfileOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      fetch("/api/auth/logout", { method: "POST" }).finally(() => {
        window.location.href = "/";
      });
    }
  };

  // Handle return to archive
  const handleReturnToArchive = () => {
    try {
      sessionStorage.setItem("sherlox_intro_completed", "true");
    } catch {}
    onBackToArchive();
  };

  // Handle new investigation
  const handleNewInvestigation = () => {
    setMessages([]);
    setInputQuery("");
    setLatestFollowUps([]);
    setErrorMessage(null);
    try {
      sessionStorage.removeItem("sherlox_chat_history");
      sessionStorage.removeItem("sherlox_active_dossier");
      sessionStorage.removeItem("sherlox_in_investigation");
    } catch {}
    if (onNewInvestigation) {
      onNewInvestigation();
    }
  };

  // Execute investigation
  const handleInvestigate = async (queryToRun: string) => {
    const q = queryToRun.trim();
    if (!q || isLoading) return;

    setInputQuery("");
    setErrorMessage(null);

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/investigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${res.status}`);
      }

      const noteData: CaseNoteResponse = await res.json();

      const assistantMessage: ChatMessage = {
        id: `note_${Date.now()}`,
        role: "assistant",
        caseNote: noteData,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (noteData.followUpSuggestions && noteData.followUpSuggestions.length > 0) {
        setLatestFollowUps(noteData.followUpSuggestions);
      }

      try {
        sessionStorage.setItem("sherlox_active_dossier", JSON.stringify(noteData));
      } catch {}
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected anomaly severed the forensic transmission.";
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
    <div className="relative h-full w-full bg-black text-white flex flex-col overflow-hidden selection:bg-red-950 selection:text-red-200">
      {/* Top Navigation Bar with Return & New Case Actions */}
      <header className="flex-shrink-0 w-full bg-black/80 backdrop-blur-xl border-b border-zinc-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between z-30">
        <button
          onClick={handleReturnToArchive}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all text-xs font-mono group cursor-pointer"
          title="Return to Bureau Hero Landing"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>RETURN TO ARCHIVE</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleNewInvestigation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 hover:border-red-600 text-red-300 hover:text-white text-xs font-mono font-semibold transition-all shadow-[0_0_12px_rgba(220,38,38,0.25)] active:scale-98 cursor-pointer"
            title="Clear active case and start a new investigation"
          >
            <Plus className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">NEW INVESTIGATION</span>
            <span className="sm:hidden">NEW</span>
          </button>
        </div>
      </header>

      {/* Main Single-Feed Conversational Stream */}
      <main
        ref={scrollContainerRef}
        className="flex-1 w-full min-h-0 overflow-y-auto overflow-x-hidden relative"
      >
        <div className="max-w-5xl w-full mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Atmospheric Detective Dispatch Room (Empty Chat State) */}
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center text-center py-10 md:py-16 px-4">
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
            <div key={msg.id} className="w-full">
              {msg.role === "user" ? (
                <div className="flex justify-end">
                  <div className="max-w-2xl bg-zinc-900/90 border border-zinc-800 text-zinc-200 px-5 py-3.5 rounded-2xl rounded-tr-sm shadow-md font-sans text-sm sm:text-base leading-relaxed">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">
                        OPERATIVE DIRECTIVE
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  {msg.caseNote ? (
                    <CaseNote data={msg.caseNote} />
                  ) : (
                    <div className="max-w-2xl bg-zinc-950 border border-zinc-800 text-zinc-300 p-4 rounded-xl font-mono text-sm">
                      {msg.content}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Forensic Loading State */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-12 gap-4 border border-dashed border-zinc-800/80 rounded-2xl bg-zinc-950/40"
            >
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-red-500 animate-spin" />
                <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
                  INTERROGATING CLASSIFIED ARCHIVES...
                </span>
              </div>
              <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
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

          <div ref={chatEndRef} className="h-2" />
        </div>
      </div>
    </main>

    {/* Fixed Profile Menu at Bottom-Left */}
    <div ref={profileMenuRef} className="fixed bottom-3 left-3 sm:bottom-3.5 sm:left-4 lg:left-6 z-50">
      {/* Profile Popover Menu */}
      <AnimatePresence>
        {isProfileOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute bottom-full left-0 mb-3 w-[290px] sm:w-[320px] max-h-[calc(100dvh-80px)] overflow-y-auto bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800/90 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_20px_rgba(220,38,38,0.12)] flex flex-col gap-3.5 text-left z-50"
          >
              {/* Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-zinc-800/80">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
                    AGENT DOSSIER
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(false)}
                  className="p-1 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 transition-colors cursor-pointer"
                  aria-label="Close profile menu"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Avatar Section */}
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-inner group">
                  {currentUser?.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name || "Avatar"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-mono text-sm font-bold text-red-400 bg-zinc-900">
                      {currentUser?.name ? (
                        currentUser.name.slice(0, 2).toUpperCase()
                      ) : (
                        <UserIcon className="w-6 h-6 text-zinc-500" />
                      )}
                    </div>
                  )}
                  {isSavingProfile && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-red-500 animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    className="hidden"
                    onChange={handleAvatarFileSelected}
                  />
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isSavingProfile}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white text-[11px] font-mono transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Camera className="w-3 h-3 text-red-400" />
                      <span>{currentUser?.avatarUrl ? "Change Photo" : "Upload Photo"}</span>
                    </button>

                    {currentUser?.avatarUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        disabled={isSavingProfile}
                        className="px-2 py-1 rounded-lg bg-zinc-950 hover:bg-red-950/40 border border-zinc-800 hover:border-red-900/60 text-zinc-400 hover:text-red-400 text-[11px] font-mono transition-all cursor-pointer disabled:opacity-50"
                        title="Remove custom photo"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <span className="font-mono text-[9px] text-zinc-500 truncate">
                    {currentUser?.email || "Declassified operative"}
                  </span>
                </div>
              </div>

              {/* Agent Codename Section */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-zinc-900">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] tracking-wider text-zinc-500 uppercase">
                    AGENT CODENAME
                  </span>
                  {!isEditingName && (
                    <button
                      type="button"
                      onClick={() => {
                        setNameInput(currentUser?.name || "");
                        setIsEditingName(true);
                        setProfileError(null);
                      }}
                      className="flex items-center gap-1 text-[10px] font-mono text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-2.5 h-2.5" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                {isEditingName ? (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveName();
                        if (e.key === "Escape") {
                          setNameInput(currentUser?.name || "");
                          setIsEditingName(false);
                          setProfileError(null);
                        }
                      }}
                      autoFocus
                      maxLength={50}
                      disabled={isSavingProfile}
                      placeholder="Enter agent codename"
                      className="w-full bg-zinc-900 border border-zinc-700 focus:border-red-500 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 font-mono focus:outline-none transition-colors"
                    />
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setNameInput(currentUser?.name || "");
                          setIsEditingName(false);
                          setProfileError(null);
                        }}
                        disabled={isSavingProfile}
                        className="px-2.5 py-1 rounded-md text-[11px] font-mono text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveName}
                        disabled={isSavingProfile || !nameInput.trim()}
                        className="flex items-center gap-1 px-3 py-1 rounded-md bg-red-600 hover:bg-red-500 text-white text-[11px] font-mono font-semibold transition-all cursor-pointer disabled:opacity-50 shadow-sm"
                      >
                        {isSavingProfile ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )}
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="px-2.5 py-1.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-xs font-mono text-zinc-200 font-medium truncate">
                    {currentUser?.name || "Anonymous Operative"}
                  </div>
                )}
              </div>

              {/* Status messages */}
              {profileSuccess && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-[10px] font-mono">
                  <Check className="w-3 h-3 flex-shrink-0" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              {profileError && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-950/40 border border-red-800/60 text-red-300 text-[10px] font-mono">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{profileError}</span>
                </div>
              )}

              {/* Logout Option */}
              <div className="pt-2 border-t border-zinc-800/80">
                <button
                  type="button"
                  onClick={handleLogoutAction}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-zinc-950 hover:bg-red-950/40 border border-zinc-800 hover:border-red-900/60 text-zinc-400 hover:text-red-300 text-xs font-mono transition-all cursor-pointer group shadow-sm"
                  title="Sign out of the Bureau"
                >
                  <LogOut className="w-3.5 h-3.5 text-zinc-500 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all" />
                  <span>SIGN OUT OF BUREAU</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Trigger Button */}
        <button
          type="button"
          onClick={() => {
            setIsProfileOpen(!isProfileOpen);
            setProfileError(null);
            setProfileSuccess(null);
          }}
          className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-full border transition-all flex items-center justify-center cursor-pointer shadow-xl group overflow-hidden ${
            isProfileOpen
              ? "border-red-500 bg-zinc-900 shadow-[0_0_15px_rgba(220,38,38,0.35)]"
              : "border-zinc-800 hover:border-red-600/60 bg-zinc-950 hover:bg-zinc-900 hover:shadow-[0_0_12px_rgba(220,38,38,0.25)]"
          }`}
          title="Agent Profile & Settings"
          aria-label="Agent Profile"
        >
          {currentUser?.avatarUrl ? (
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name || "Agent"}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center font-mono text-xs font-bold text-red-400 group-hover:text-red-300">
              {currentUser?.name ? (
                currentUser.name.slice(0, 2).toUpperCase()
              ) : (
                <UserIcon className="w-4 h-4 text-zinc-400" />
              )}
            </div>
          )}
          {/* Subtle Online Indicator Dot */}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-zinc-950 shadow-sm" />
        </button>
      </div>

      {/* Bottom-Docked Input Bar & Suggested Follow-Ups */}
      <footer className="flex-shrink-0 w-full bg-black/95 backdrop-blur-2xl border-t border-zinc-800/80 px-3 sm:px-4 py-3 z-40 relative">
        <div className="max-w-3xl w-full mx-auto flex flex-col gap-2 pl-12 sm:pl-14 lg:pl-0">
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
