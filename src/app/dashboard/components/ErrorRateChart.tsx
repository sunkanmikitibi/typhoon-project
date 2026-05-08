'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

// Backend integration point: replace with API call to /api/analytics/error-rate?range=24h
const ERROR_RATE_DATA = [
  { time: '00:00', rate: 1.2 },
  { time: '02:00', rate: 0.8 },
  { time: '04:00', rate: 0.6 },
  { time: '06:00', rate: 1.4 },
  { time: '08:00', rate: 2.1 },
  { time: '10:00', rate: 3.8 },
  { time: '12:00', rate: 2.7 },
  { time: '14:00', rate: 1.9 },
  { time: '16:00', rate: 2.4 },
  { time: '18:00', rate: 3.1 },
  { time: '20:00', rate: 1.6 },
  { time: '22:00', rate: 1.1 },
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
      <p className="font-600 text-white mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-danger" />
        <span className="text-muted-foreground">Error Rate:</span>
        <span className="font-mono font-600 text-danger tabular-nums">
          {payload[0]?.value?.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};

export default function ErrorRateChart() {
  return (
    <div className="bg-surface border border-border rounded-lg p-5 shadow-card h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-600 text-white">Error Rate</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">24h — 2h intervals</p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-danger/10 text-danger border border-danger/20">
          SLA: 3.0%
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={ERROR_RATE_DATA} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="hsl(222 25% 16%)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fill: 'hsl(222 15% 55%)', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${v}%`}
            tick={{ fill: 'hsl(222 15% 55%)', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <ReferenceLine y={3.0} stroke="hsl(38 92% 50%)" strokeDasharray="4 4" strokeWidth={1} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="rate"
            stroke="hsl(0 84% 60%)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: 'hsl(0 84% 60%)', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
