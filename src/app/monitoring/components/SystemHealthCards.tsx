import React from 'react';
import MetricCard from '@/components/ui/MetricCard';
import { Zap, BarChart3, AlertOctagon, Clock } from 'lucide-react';

export default function SystemHealthCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      <MetricCard
        label="API Latency (P95)"
        value="142ms"
        subValue="P99: 387ms · P50: 68ms"
        change={-11.4}
        changeLabel="vs 1h ago"
        trend="down"
        trendPositive={true}
        icon={<Zap size={15} />}
        variant="success"
      />
      <MetricCard
        label="Tx Throughput"
        value="218 / min"
        subValue="Peak today: 341/min at 14:02"
        change={3.7}
        changeLabel="vs baseline"
        trend="up"
        trendPositive={true}
        icon={<BarChart3 size={15} />}
        variant="info"
      />
      <MetricCard
        label="Error Rate (1h)"
        value="2.7%"
        subValue="SLA threshold: 3.0%"
        change={18.2}
        changeLabel="vs prior hour"
        trend="up"
        trendPositive={false}
        icon={<AlertOctagon size={15} />}
        variant="warning"
      >
        <div className="mt-3 w-full h-1.5 bg-border rounded-full overflow-hidden">
          <div className="h-full bg-warning rounded-full" style={{ width: '90%' }} />
        </div>
        <p className="text-[10px] text-warning mt-1">Approaching SLA limit</p>
      </MetricCard>
      <MetricCard
        label="System Uptime"
        value="99.97%"
        subValue="18m downtime MTD"
        change={0}
        changeLabel="stable"
        trend="neutral"
        trendPositive={true}
        icon={<Clock size={15} />}
        variant="default"
      />
    </div>
  );
}
