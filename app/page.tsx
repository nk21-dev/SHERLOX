"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HeroSection } from "@/components/HeroSection";
import { ClassifiedMarquee } from "@/components/ClassifiedMarquee";
import { ParadoxSection } from "@/components/ParadoxSection";
import { UVForensicScanner } from "@/components/UVForensicScanner";
import { HorizontalFeatures } from "@/components/HorizontalFeatures";
import { CaseVault } from "@/components/CaseVault";
import { ScrollProgressHUD } from "@/components/ScrollProgressHUD";
import { PreFooterCTA } from "@/components/PreFooterCTA";
import { Footer } from "@/components/Footer";
import { InvestigationView } from "@/components/InvestigationView";

export default function Home() {
  const [isInvestigating, setIsInvestigating] = useState<boolean>(false);
  const [activeInvestigationQuery, setActiveInvestigationQuery] = useState<string>("");
  const [isIntroActive, setIsIntroActive] = useState<boolean>(true);
  const [hasCompletedIntro, setHasCompletedIntro] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Ensure page loads fresh on the landing page every reload
  useEffect(() => {
    try {
      sessionStorage.removeItem("sherlox_active_dossier");
      sessionStorage.removeItem("sherlox_chat_history");
    } catch (e) {
      // ignore
    }
  }, []);

  // Transition from landing page into active investigation stream
  const handleLaunchInvestigation = (query: string) => {
    setActiveInvestigationQuery(query);
    setIsInvestigating(true);
    setIsIntroActive(false);
    setHasCompletedIntro(true);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Keep user in investigation room with a fresh empty chat
  const handleNewInvestigation = () => {
    setActiveInvestigationQuery("");
    setIsInvestigating(true);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Return to the bureau landing page without replaying the intro
  const handleReturnToArchive = () => {
    setActiveInvestigationQuery("");
    setIsInvestigating(false);
    setIsIntroActive(false);
    setHasCompletedIntro(true); // Sherlock remains settled on the right
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleIntroStateChange = (isActive: boolean) => {
    setIsIntroActive(isActive);
    if (!isActive) {
      setHasCompletedIntro(true);
    }
  };

  return (
    <main className="relative min-h-screen bg-black text-white selection:bg-red-950 selection:text-red-200">
      {/* Subtle Background Film Grain Overlay */}
      <div className="fixed inset-0 film-grain pointer-events-none z-30" />

      <AnimatePresence mode="wait">
        {isInvestigating ? (
          <motion.div
            key="investigation-stream"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full relative z-40"
          >
            <InvestigationView
              initialQuery={activeInvestigationQuery}
              onBackToArchive={handleReturnToArchive}
              onNewInvestigation={handleNewInvestigation}
            />
          </motion.div>
        ) : (
          <motion.div
            key="archive-landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full relative"
          >
            {/* Global Persistent Detective Background Video */}
            <video
              ref={videoRef}
              src="/media/gemini_generated_video_988681c8-clean.mp4"
              playsInline
              preload="auto"
              className="fixed inset-0 w-full h-full object-contain md:object-right z-0 pointer-events-none bg-black"
            />

            {/* Right-Aligned Floating Navigation Rail (Active after intro completes) */}
            <ScrollProgressHUD isVisible={!isIntroActive} />

            {/* Hero Section & Fullscreen Detective Intro */}
            <HeroSection
              videoRef={videoRef}
              onOpenDossier={handleLaunchInvestigation}
              onIntroStateChange={handleIntroStateChange}
              initialVideoDone={hasCompletedIntro}
            />

            {/* Continuous Marquee Tape */}
            <ClassifiedMarquee />

            {/* Section 2: Sticky Stacking Cards ("The Intel Paradox") */}
            <ParadoxSection />

            {/* Section 3: The UV Forensic Lightbox (X-Ray Truth Scanner) */}
            <UVForensicScanner onSelectCase={handleLaunchInvestigation} />

            {/* Section 4: Horizontal Sticky Features Track */}
            <HorizontalFeatures />

            {/* Section 5: The Declassified Archive (2x2 Case Vault Grid) */}
            <CaseVault onSelectCase={handleLaunchInvestigation} />

            {/* Pre-Footer Action Section */}
            <PreFooterCTA onStartInvestigation={() => handleLaunchInvestigation("")} />

            {/* Archival Bureau Footer with Chief Architect Dossier */}
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
