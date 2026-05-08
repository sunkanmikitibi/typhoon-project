'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="text-center space-y-3 px-4 py-6">
        <p className="text-lg font-semibold">Redirecting to dashboard…</p>
        <p className="text-sm text-slate-300">
          If you are not redirected automatically,{' '}
          <a href="/dashboard" className="underline text-sky-300">
            click here
          </a>
          .
        </p>
      </div>
    </main>
  );
}
