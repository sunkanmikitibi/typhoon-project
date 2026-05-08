'use client';

import React, { useState } from 'react';
import { Eye, MoreHorizontal } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import RiskScore from '@/components/ui/RiskScore';

// Backend integration point: replace with API call to /api/transactions/recent?limit=8&sort=risk
const RECENT_TRANSACTIONS = [
  {
    id: 'txn-00841',
    sender: 'Nexora Capital LLC',
    receiver: 'Bridgeport Clearing',
    amount: 284500,
    fee: 142.25,
    status: 'completed' as const,
    risk: 82,
    method: 'SWIFT',
    timestamp: '12:34:11',
  },
  {
    id: 'txn-00840',
    sender: 'Vantage Payments',
    receiver: 'Orion Bank NA',
    amount: 51200,
    fee: 25.6,
    status: 'processing' as const,
    risk: 44,
    method: 'ACH',
    timestamp: '12:31:04',
  },
  {
    id: 'txn-00839',
    sender: 'Crestfield Holdings',
    receiver: 'Meridian Trust',
    amount: 9800,
    fee: 4.9,
    status: 'failed' as const,
    risk: 91,
    method: 'Wire',
    timestamp: '12:28:47',
  },
  {
    id: 'txn-00838',
    sender: 'Luminos Financial',
    receiver: 'Apex Clearing Co.',
    amount: 126000,
    fee: 63.0,
    status: 'completed' as const,
    risk: 18,
    method: 'ACH',
    timestamp: '12:22:15',
  },
  {
    id: 'txn-00837',
    sender: 'Redwood Ventures',
    receiver: 'Summit Bank Corp',
    amount: 47300,
    fee: 23.65,
    status: 'pending' as const,
    risk: 67,
    method: 'SWIFT',
    timestamp: '12:19:33',
  },
  {
    id: 'txn-00836',
    sender: 'Halcyon Treasury',
    receiver: 'Pinnacle FX Ltd',
    amount: 890000,
    fee: 445.0,
    status: 'processing' as const,
    risk: 29,
    method: 'Wire',
    timestamp: '12:14:58',
  },
  {
    id: 'txn-00835',
    sender: 'Irongate Partners',
    receiver: 'Clearfield Bank',
    amount: 32100,
    fee: 16.05,
    status: 'reversed' as const,
    risk: 78,
    method: 'ACH',
    timestamp: '12:08:22',
  },
  {
    id: 'txn-00834',
    sender: 'Solara Payments',
    receiver: 'Northgate Capital',
    amount: 215000,
    fee: 107.5,
    status: 'completed' as const,
    risk: 12,
    method: 'SWIFT',
    timestamp: '12:03:07',
  },
];

export default function RecentTransactionsTable() {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  return (
    <div className="bg-surface border border-border rounded-lg shadow-card">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <h3 className="text-sm font-600 text-white">Recent Transactions</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Sorted by risk score — high risk first
          </p>
        </div>
        <a
          href="/transfers"
          className="text-[11px] text-primary hover:text-primary/80 font-500 transition-colors"
        >
          View all →
        </a>
      </div>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {['ID', 'Sender', 'Receiver', 'Amount', 'Method', 'Risk', 'Status', ''].map(
                (col, i) => (
                  <th
                    key={`dash-col-${i}`}
                    className="px-4 py-2.5 text-left text-[10px] font-500 uppercase tracking-widest text-muted-foreground whitespace-nowrap"
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {RECENT_TRANSACTIONS.map((tx) => (
              <tr
                key={tx.id}
                onMouseEnter={() => setHoveredRow(tx.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`border-b border-border/50 transition-colors duration-100 ${
                  hoveredRow === tx.id ? 'bg-surface-elevated' : ''
                }`}
              >
                <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground tabular-nums">
                  {tx.id}
                </td>
                <td className="px-4 py-3 text-[12px] text-white font-500 max-w-[140px] truncate">
                  {tx.sender}
                </td>
                <td className="px-4 py-3 text-[12px] text-muted-foreground max-w-[140px] truncate">
                  {tx.receiver}
                </td>
                <td className="px-4 py-3 font-mono text-[12px] text-white font-600 tabular-nums whitespace-nowrap">
                  ${tx.amount.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-surface-elevated text-muted-foreground border border-border">
                    {tx.method}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <RiskScore score={tx.risk} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={tx.status} />
                </td>
                <td className="px-4 py-3">
                  <div
                    className={`flex items-center gap-1 transition-opacity duration-100 ${
                      hoveredRow === tx.id ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <button
                      className="p-1 rounded hover:bg-surface text-muted-foreground hover:text-white transition-colors"
                      title="View transaction details"
                    >
                      <Eye size={13} />
                    </button>
                    <button
                      className="p-1 rounded hover:bg-surface text-muted-foreground hover:text-white transition-colors"
                      title="More actions"
                    >
                      <MoreHorizontal size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
