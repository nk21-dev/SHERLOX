'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
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
    <main className="relative min-h-screen bg-black text-white selection:bg-red-950 selection:text-red-200">
      <div className="fixed inset-0 film-grain pointer-events-none z-30 opacity-20" />
      <InvestigationView
        onBackToArchive={handleBackToArchive}
        user={user}
        onLogout={handleLogout}
      />
    </main>
  );
};

