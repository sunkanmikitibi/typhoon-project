'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Calendar, ChevronDown } from 'lucide-react';

export default function DashboardHeader() {
  const [lastUpdated, setLastUpdated] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setLastUpdated(
      new Date()?.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    );
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setLastUpdated(
        new Date()?.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setRefreshing(false);
    }, 1200);
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-600 text-white">Operations Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Real-time transaction monitoring and risk overview
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-subtle" />
          {lastUpdated ? `Updated ${lastUpdated}` : 'Live'}
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated border border-border text-sm text-muted-foreground hover:text-white hover:border-border transition-all duration-150">
          <Calendar size={13} />
          <span>Apr 29, 2026</span>
          <ChevronDown size={12} />
        </button>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated border border-border text-sm text-muted-foreground hover:text-white transition-all duration-150 disabled:opacity-50"
        >
          <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
}
