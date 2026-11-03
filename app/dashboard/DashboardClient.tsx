'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { InvestigationView } from '@/components/InvestigationView';

interface DashboardClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
}

export const DashboardClient: React.FC<DashboardClientProps> = ({ user }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') || '';

  const handleBackToArchive = () => {
    router.push('/');
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    router.push('/');
    router.refresh();
  };

  return (
    <motion.main
      initial={{ opacity: 0, filter: 'blur(6px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(6px)' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="relative min-h-screen bg-black text-white selection:bg-red-950 selection:text-red-200"
    >
      <div className="fixed inset-0 film-grain pointer-events-none z-30 opacity-20" />
      <InvestigationView
        initialQuery={initialQuery}
        onBackToArchive={handleBackToArchive}
        user={user}
        onLogout={handleLogout}
      />
    </motion.main>
  );
};
