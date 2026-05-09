import React from 'react';
import type { Metadata, Viewport } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import '../styles/tailwind.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Typhoon — Payment Operations & Risk Intelligence',
  description:
    'Typhoon helps fintech ops teams monitor transactions, manage transfers with approval workflows, and detect fraud events in real time.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {children}

          <script
            type="module"
            async
            src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Ftyphoon9927back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.18"
          />
          <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" />
        </body>
      </html>
    </ClerkProvider>
  );
}
