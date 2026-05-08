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

// Backend integration point: replace with API call to /api/monitoring/fraud-rate?range=7d
const DATA = [
  { date: 'Apr 23', rate: 0.8, flagged: 89 },
  { date: 'Apr 24', rate: 1.1, flagged: 134 },
  { date: 'Apr 25', rate: 0.7, flagged: 76 },
  { date: 'Apr 26', rate: 1.6, flagged: 218 },
  { date: 'Apr 27', rate: 2.3, flagged: 271 },
  { date: 'Apr 28', rate: 1.4, flagged: 187 },
  { date: 'Apr 29', rate: 1.8, flagged: 243 },
];

interface TooltipPayload {
  value?: number;
  payload?: { flagged?: number } & Record<string, unknown>;
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
          <span className="w-2 h-2 rounded-full bg-warning" />
          <span className="text-muted-foreground">Fraud Rate:</span>
          <span className="font-mono font-600 text-warning">{payload[0]?.value?.toFixed(1)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-danger" />
          <span className="text-muted-foreground">Flagged Tx:</span>
          <span className="font-mono font-600 text-white">{payload[0]?.payload?.flagged}</span>
        </div>
      </div>
    </div>
  );
};

export default function FraudRateChart() {
  return (
    <div className="bg-surface border border-border rounded-lg p-5 shadow-card">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-600 text-white">Fraud Detection Rate</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">7-day flagged transaction rate</p>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="flex items-center gap-1 text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-warning" />
            Fraud %
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={DATA} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="hsl(222 25% 16%)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
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
          <ReferenceLine y={2.0} stroke="hsl(0 84% 60%)" strokeDasharray="4 4" strokeWidth={1} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="rate"
            stroke="hsl(38 92% 50%)"
            strokeWidth={2}
            dot={{ fill: 'hsl(38 92% 50%)', strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, fill: 'hsl(38 92% 50%)', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
