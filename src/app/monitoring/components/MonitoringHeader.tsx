'use client';

import React, { useState, useEffect } from 'react';
import { Activity, RefreshCw } from 'lucide-react';

export default function MonitoringHeader() {
  const [ts, setTs] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setTs(new Date()?.toLocaleTimeString('en-US'));
  }, []);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setTs(new Date()?.toLocaleTimeString('en-US'));
      setRefreshing(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Activity size={16} className="text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-600 text-white">System Monitoring</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Real-time fraud detection, system health, and event logs
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/5 border border-success/20">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-subtle" />
          <span className="text-[11px] font-500 text-success">All systems operational</span>
        </div>
        <span className="text-[11px] text-muted-foreground font-mono">{ts || '—'}</span>
        <button
          onClick={refresh}
          disabled={refreshing}
          className="p-1.5 rounded-lg bg-surface-elevated border border-border text-muted-foreground hover:text-white transition-all duration-150 disabled:opacity-50"
          aria-label="Refresh monitoring data"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
        </button>
      </div>
    </div>
  );
}
