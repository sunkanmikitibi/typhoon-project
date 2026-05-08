import React from 'react';
import Sidebar from './Sidebar';
import { Toaster } from 'sonner';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto scrollbar-thin">{children}</main>
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          style: {
            background: 'hsl(222 35% 11%)',
            border: '1px solid hsl(222 25% 16%)',
            color: 'hsl(210 40% 96%)',
            fontFamily: 'Geist, system-ui, sans-serif',
          },
        }}
      />
    </div>
  );
}
