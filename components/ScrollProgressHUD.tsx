"use client";

import React, { useState, useEffect } from "react";

const SECTIONS = [
  { id: "intro", label: "01 INTRO" },
  { id: "paradox", label: "02 PARADOX" },
  { id: "scanner", label: "03 X-RAY RECON" },
  { id: "vault", label: "04 VAULT" },
];

interface ScrollProgressHUDProps {
  isVisible?: boolean;
}

export const ScrollProgressHUD: React.FC<ScrollProgressHUDProps> = ({
  isVisible = true,
}) => {
  const [activeSection, setActiveSection] = useState<string>("intro");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;

      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(SECTIONS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed right-6 md:right-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-5 items-end pointer-events-auto select-none">
      {SECTIONS.map((sec) => (
        <button
          key={sec.id}
          onClick={() => scrollToSection(sec.id)}
          className="group flex items-center gap-3 text-right focus:outline-none"
        >
          <span
            className={`font-mono text-[10px] tracking-widest transition-all ${
              activeSection === sec.id
                ? "text-red-500 font-bold"
                : "text-zinc-600 group-hover:text-zinc-400"
            }`}
          >
            {sec.label}
          </span>
          <div
            className={`w-1.5 rounded-full transition-all duration-300 ${
              activeSection === sec.id
                ? "bg-red-500 h-8 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                : "bg-zinc-800 h-6 group-hover:bg-zinc-600"
            }`}
          />
        </button>
      ))}
    </div>
  );
};
