'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import TransactionFlowSimulator from './components/TransactionFlowSimulator';

export default function SimulatorPage() {
  return (
    <AppLayout>
      <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-700 text-white tracking-tight">
              Transaction Flow Simulator
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Simulate the end-to-end payment lifecycle across Typhoon, Middleware, Ebanq, and
              processor rails.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-600 uppercase tracking-widest bg-warning/10 text-warning border border-warning/20">
            Simulation Mode
          </span>
        </div>
        <TransactionFlowSimulator />
      </div>
    </AppLayout>
  );
}
