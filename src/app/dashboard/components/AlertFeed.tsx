'use client';

import React from 'react';
import { ShieldAlert, AlertTriangle, Info, XCircle, ArrowRight } from 'lucide-react';

// Backend integration point: replace with WebSocket subscription to /ws/fraud-alerts
const ALERTS = [
  {
    id: 'alert-0091',
    severity: 'critical' as const,
    title: 'Velocity anomaly detected',
    account: 'Nexora Capital LLC',
    txId: 'txn-00841',
    amount: '$284,500',
    time: '2m ago',
  },
  {
    id: 'alert-0090',
    severity: 'critical' as const,
    title: 'Blacklist match — receiver',
    account: 'Irongate Partners',
    txId: 'txn-00835',
    amount: '$32,100',
    time: '24m ago',
  },
  {
    id: 'alert-0089',
    severity: 'high' as const,
    title: 'Unusual geo — IP mismatch',
    account: 'Redwood Ventures',
    txId: 'txn-00837',
    amount: '$47,300',
    time: '43m ago',
  },
  {
    id: 'alert-0088',
    severity: 'high' as const,
    title: 'Repeated failed auth attempts',
    account: 'Crestfield Holdings',
    txId: 'txn-00839',
    amount: '$9,800',
    time: '1h ago',
  },
  {
    id: 'alert-0087',
    severity: 'medium' as const,
    title: 'Large single transfer — review',
    account: 'Halcyon Treasury',
    txId: 'txn-00836',
    amount: '$890,000',
    time: '1h 48m ago',
  },
];

const SEVERITY_CONFIG = {
  critical: {
    icon: XCircle,
    iconColor: 'text-danger',
    bg: 'bg-danger/5 border-danger/15',
    dot: 'bg-danger',
  },
  high: {
    icon: AlertTriangle,
    iconColor: 'text-warning',
    bg: 'bg-warning/5 border-warning/15',
    dot: 'bg-warning',
  },
  medium: {
    icon: Info,
    iconColor: 'text-primary',
    bg: 'bg-primary/5 border-primary/15',
    dot: 'bg-primary',
  },
};

export default function AlertFeed() {
  return (
    <div className="bg-surface border border-border rounded-lg shadow-card h-full flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <ShieldAlert size={14} className="text-danger" />
          <h3 className="text-sm font-600 text-white">Fraud Alerts</h3>
          <span className="text-[10px] font-600 px-1.5 py-0.5 rounded-full bg-danger/15 text-danger border border-danger/20 tabular-nums">
            {ALERTS.length}
          </span>
        </div>
        <a
          href="/monitoring"
          className="text-[11px] text-primary hover:text-primary/80 font-500 transition-colors"
        >
          View all →
        </a>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin divide-y divide-border/50">
        {ALERTS.map((alert) => {
          const config = SEVERITY_CONFIG[alert.severity];
          const Icon = config.icon;
          return (
            <div
              key={alert.id}
              className={`px-4 py-3.5 hover:bg-surface-elevated transition-colors duration-100 cursor-pointer group`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 p-1.5 rounded-md border ${config.bg} shrink-0`}>
                  <Icon size={12} className={config.iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-500 text-white leading-snug">{alert.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                    {alert.account}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="font-mono text-[10px] text-muted-foreground bg-surface-elevated px-1.5 py-0.5 rounded border border-border">
                      {alert.txId}
                    </span>
                    <span className="font-mono text-[10px] font-600 text-white tabular-nums">
                      {alert.amount}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {alert.time}
                  </span>
                  <ArrowRight
                    size={12}
                    className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
