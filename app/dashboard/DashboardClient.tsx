'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { InvestigationView } from '@/components/InvestigationView';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

interface DashboardClientProps {
  user: UserProfile;
}

export const DashboardClient: React.FC<DashboardClientProps> = ({ user: initialUser }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') || '';
  const [currentUser, setCurrentUser] = useState<UserProfile>(initialUser);

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
      className="relative h-screen h-[100dvh] w-full overflow-hidden bg-black text-white selection:bg-red-950 selection:text-red-200 flex flex-col"
    >
      <div className="fixed inset-0 film-grain pointer-events-none z-30 opacity-20" />
      <InvestigationView
        initialQuery={initialQuery}
        onBackToArchive={handleBackToArchive}
        user={currentUser}
        onUserUpdate={setCurrentUser}
        onLogout={handleLogout}
      />
    </motion.main>
  );
};
