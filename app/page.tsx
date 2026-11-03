import React, { Suspense } from 'react';
import { connection } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { HomeClient } from '@/components/HomeClient';

async function HomeContent() {
  await connection();
  const sessionData = await getCurrentUser();
  const user = sessionData?.user
    ? {
        id: sessionData.user.id,
        name: sessionData.user.name,
        email: sessionData.user.email,
        avatarUrl: sessionData.user.avatar_url,
      }
    : null;

  return <HomeClient initialUser={user} />;
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <HomeContent />
    </Suspense>
  );
}
