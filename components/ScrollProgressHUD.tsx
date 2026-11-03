"use client";

import React, { useState, useEffect } from "react";

const SECTIONS = [
  { id: "intro", label: "01 INTRO" },
  { id: "paradox", label: "02 PARADOX" },
  { id: "anatomy", label: "03 ANATOMY", fallbackId: "scanner" },
  { id: "features", label: "04 FEATURES" },
  { id: "vault", label: "05 VAULT" },
];

interface ScrollProgressHUDProps {
  isVisible?: boolean;
}

export const ScrollProgressHUD: React.FC<ScrollProgressHUDProps> = ({
  isVisible = true,
}) => {
  const [activeSection, setActiveSection] = useState<string>("intro");

  useEffect(() => {
    const getTargetElement = (sec: (typeof SECTIONS)[number]) => {
      return (
        document.getElementById(sec.id) ||
        (sec.fallbackId ? document.getElementById(sec.fallbackId) : null)
      );
    };

    const handleScroll = () => {
      // 1. If at the very top of the page, activate 01 INTRO
      if (window.scrollY < 120) {
        setActiveSection("intro");
        return;
      }

      // 2. If scrolled near the bottom of the document, activate 05 VAULT
      const isNearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 160;
      if (isNearBottom) {
        setActiveSection("vault");
        return;
      }

      // 3. Scan sections with a focal line in upper-middle viewport
      const focalLine = window.innerHeight * 0.42;
      let matchedId = "intro";

      for (const sec of SECTIONS) {
        const el = getTargetElement(sec);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        // Element's top has crossed above the focal line, and its bottom is still visible
        if (rect.top <= focalLine && rect.bottom > window.innerHeight * 0.15) {
          matchedId = sec.id;
        }
      }

      setActiveSection(matchedId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const sec = SECTIONS.find((s) => s.id === id);
    if (!sec) return;

    if (id === "intro") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const el =
      document.getElementById(sec.id) ||
      (sec.fallbackId ? document.getElementById(sec.fallbackId) : null);

    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  if (!isVisible) return null;

  return (
    <nav
      aria-label="Section Navigation"
      className="fixed right-6 md:right-8 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col gap-5 items-end pointer-events-auto select-none"
    >
      {SECTIONS.map((sec) => {
        const isActive = activeSection === sec.id;

        return (
          <button
            key={sec.id}
            type="button"
            onClick={() => scrollToSection(sec.id)}
            className="group flex items-center gap-3 text-right focus:outline-none cursor-pointer"
            aria-current={isActive ? "true" : undefined}
          >
            {/* Label */}
            <span
              className={`font-mono text-[11px] tracking-[0.2em] transition-all duration-300 ${
                isActive
                  ? "text-red-500 font-bold drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]"
                  : "text-zinc-600 font-medium group-hover:text-zinc-300"
              }`}
            >
              {sec.label}
            </span>

            {/* Vertical Pill / Bar */}
            <div
              className={`w-1.5 rounded-full transition-all duration-300 ease-out ${
                isActive
                  ? "bg-red-500 h-8 shadow-[0_0_14px_rgba(239,68,68,0.95)] drop-shadow-[0_0_8px_rgba(239,68,68,1)]"
                  : "bg-zinc-800 h-6 group-hover:bg-zinc-600"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
};

export default ScrollProgressHUD;
