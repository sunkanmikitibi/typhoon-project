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

// Backend integration point: replace with API call to /api/analytics/tx-volume?range=7d
const TX_VOLUME_DATA = [
  { date: 'Apr 23', volume: 3840000, count: 11240 },
  { date: 'Apr 24', volume: 4120000, count: 12180 },
  { date: 'Apr 25', volume: 3650000, count: 10870 },
  { date: 'Apr 26', volume: 4580000, count: 13640 },
  { date: 'Apr 27', volume: 3920000, count: 11720 },
  { date: 'Apr 28', volume: 4450000, count: 13280 },
  { date: 'Apr 29', volume: 4820000, count: 14391 },
];

const formatUSD = (v: number) =>
  v >= 1000000 ? `$${(v / 1000000).toFixed(2)}M` : `$${(v / 1000).toFixed(0)}K`;

interface TooltipPayload {
  value?: number;
  payload?: { count?: number } & Record<string, unknown>;
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
          <span className="text-muted-foreground">Volume:</span>
          <span className="font-mono font-600 text-white tabular-nums">
            {formatUSD(payload[0]?.value ?? 0)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success" />
          <span className="text-muted-foreground">Transactions:</span>
          <span className="font-mono font-600 text-white tabular-nums">
            {payload[0]?.payload?.count?.toLocaleString() ?? '0'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function TxVolumeChart() {
  return (
    <div className="bg-surface border border-border rounded-lg p-5 shadow-card h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-600 text-white">Transaction Volume</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">7-day daily totals (USD)</p>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Volume
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={TX_VOLUME_DATA} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="volGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(199 89% 48%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(199 89% 48%)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="hsl(222 25% 16%)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: 'hsl(222 15% 55%)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatUSD}
            tick={{ fill: 'hsl(222 15% 55%)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={56}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="volume"
            stroke="hsl(199 89% 48%)"
            strokeWidth={2}
            fill="url(#volGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
