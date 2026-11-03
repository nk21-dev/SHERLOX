import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { DashboardClient } from './DashboardClient';

async function ProtectedDashboardContent() {
  await connection();

  const sessionData = await getCurrentUser();

  if (!sessionData) {
    redirect('/auth?mode=signin&returnUrl=/dashboard');
  }

  return (
    <DashboardClient
      user={{
        id: sessionData.user.id,
        name: sessionData.user.name,
        email: sessionData.user.email,
        avatarUrl: sessionData.user.avatar_url,
      }}
    />
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
              VERIFYING BUREAU CLEARANCE...
            </span>
          </div>
        </div>
      }
    >
      <ProtectedDashboardContent />
    </Suspense>
  );
}
