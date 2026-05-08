'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Backend integration point: replace with API call to /api/monitoring/throughput?range=1h&interval=5m
const DATA = [
  { time: '11:00', tpm: 187, errors: 3 },
  { time: '11:10', tpm: 201, errors: 5 },
  { time: '11:20', tpm: 195, errors: 4 },
  { time: '11:30', tpm: 218, errors: 7 },
  { time: '11:40', tpm: 241, errors: 6 },
  { time: '11:50', tpm: 229, errors: 9 },
  { time: '12:00', tpm: 218, errors: 8 },
  { time: '12:10', tpm: 234, errors: 5 },
  { time: '12:20', tpm: 248, errors: 11 },
  { time: '12:30', tpm: 218, errors: 7 },
  { time: '12:40', tpm: 203, errors: 4 },
  { time: '12:50', tpm: 211, errors: 6 },
];

interface TooltipPayload {
  value?: number;
  payload?: Record<string, unknown>;
}

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-elevated border border-border rounded-lg p-3 shadow-elevated text-xs">
      <p className="font-600 text-white mb-2">{label}</p>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-muted-foreground">Throughput:</span>
          <span className="font-mono font-600 text-white">{payload[0]?.value} tx/min</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-danger" />
          <span className="text-muted-foreground">Errors:</span>
          <span className="font-mono font-600 text-danger">{payload[1]?.value}</span>
        </div>
      </div>
    </div>
  );
};

export default function TxThroughputChart() {
  return (
    <div className="bg-surface border border-border rounded-lg p-5 shadow-card">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-600 text-white">Transaction Throughput</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Tx/min — last 2 hours (5-min intervals)
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
          LIVE
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={DATA} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="tpmGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(199 89% 48%)" stopOpacity={0.25} />
              <stop offset="100%" stopColor="hsl(199 89% 48%)" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="errGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(0 84% 60%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(0 84% 60%)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="hsl(222 25% 16%)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fill: 'hsl(222 15% 55%)', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'hsl(222 15% 55%)', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="tpm"
            stroke="hsl(199 89% 48%)"
            strokeWidth={2}
            fill="url(#tpmGradient)"
          />
          <Area
            type="monotone"
            dataKey="errors"
            stroke="hsl(0 84% 60%)"
            strokeWidth={1.5}
            fill="url(#errGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
