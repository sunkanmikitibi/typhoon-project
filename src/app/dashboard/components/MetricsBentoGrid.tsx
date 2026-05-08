import React from 'react';
import Link from 'next/link';
import MetricCard from '@/components/ui/MetricCard';
import { ArrowLeftRight, CheckCircle, Users, ShieldAlert, DollarSign, Clock } from 'lucide-react';
import { mockTransfers } from '@/lib/transfers/mockTransfers';

// Bento plan: 7 cards → grid-cols-4
// Row 1: hero tx-volume (col-span-2) + success-rate + active-sessions
// Row 2: fraud-alerts (warning) + approval queue (warning) + fees-collected + avg-settlement

export default function MetricsBentoGrid() {
  const approvalPending = mockTransfers.filter((transfer) => transfer.status === 'pending').length;
  const dualApprovalCount = mockTransfers.filter(
    (transfer) => transfer.status === 'pending' && (transfer.amount > 100000 || transfer.risk >= 70)
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      {/* Hero: Transaction Volume — spans 2 cols */}
      <MetricCard
        label="Transaction Volume"
        value="$4.82M"
        subValue="14,391 transactions today"
        change={8.4}
        changeLabel="vs yesterday"
        trend="up"
        trendPositive={true}
        icon={<ArrowLeftRight size={16} />}
        className="lg:col-span-2 xl:col-span-2 2xl:col-span-2"
      >
        <div className="mt-3 flex items-center gap-4 pt-3 border-t border-border">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-500">
              MTD Volume
            </p>
            <p className="text-sm font-600 font-mono tabular-nums text-white">$87.4M</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-500">
              Avg Tx Size
            </p>
            <p className="text-sm font-600 font-mono tabular-nums text-white">$334.82</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-500">
              Peak Hour
            </p>
            <p className="text-sm font-600 font-mono tabular-nums text-white">14:00–15:00</p>
          </div>
        </div>
      </MetricCard>

      {/* Success Rate */}
      <MetricCard
        label="Transfer Success Rate"
        value="97.3%"
        subValue="389 failed today"
        change={-0.8}
        changeLabel="vs yesterday"
        trend="down"
        trendPositive={false}
        icon={<CheckCircle size={16} />}
        variant="default"
      >
        <div className="mt-3 w-full h-1.5 bg-border rounded-full overflow-hidden">
          <div className="h-full bg-success rounded-full" style={{ width: '97.3%' }} />
        </div>
      </MetricCard>

      {/* Active Sessions */}
      <MetricCard
        label="Active Sessions"
        value="1,847"
        subValue="243 internal · 1,604 clients"
        change={12.1}
        changeLabel="vs 1h ago"
        trend="up"
        trendPositive={true}
        icon={<Users size={16} />}
        variant="info"
      />

      {/* Fraud Alerts — warning state */}
      <MetricCard
        label="Fraud Alerts"
        value="23"
        subValue="7 critical · 16 high risk"
        change={47.2}
        changeLabel="vs yesterday"
        trend="up"
        trendPositive={false}
        icon={<ShieldAlert size={16} />}
        variant="warning"
      >
        <div className="mt-2 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
          <span className="text-[11px] text-danger font-500">3 require immediate review</span>
        </div>
      </MetricCard>

      {/* Approval Queue */}
      <MetricCard
        label="Approval Queue"
        value={String(approvalPending)}
        subValue={`${approvalPending} pending · ${dualApprovalCount} dual approval`}
        change={18.4}
        changeLabel="vs yesterday"
        trend="up"
        trendPositive={false}
        icon={<CheckCircle size={16} />}
        variant="warning"
      >
        <div className="mt-3 flex flex-wrap gap-2 pt-3 border-t border-border">
          <span className="rounded-full bg-warning/10 px-2.5 py-1 text-[11px] text-warning border border-warning/20">
            {dualApprovalCount} require second signoff
          </span>
          <span className="rounded-full bg-surface-elevated px-2.5 py-1 text-[11px] text-muted-foreground border border-border">
            Avg review time 18m
          </span>
        </div>
        <Link
          href="/transfers"
          className="mt-3 inline-flex items-center gap-1 text-[11px] font-500 text-primary hover:text-primary/80"
        >
          View transfers
        </Link>
      </MetricCard>

      {/* Fees Collected */}
      <MetricCard
        label="Fees Collected"
        value="$19,482"
        subValue="Target: $24,000 · 81.2%"
        change={5.3}
        changeLabel="vs yesterday"
        trend="up"
        trendPositive={true}
        icon={<DollarSign size={16} />}
        variant="success"
      >
        <div className="mt-3 w-full h-1.5 bg-border rounded-full overflow-hidden">
          <div className="h-full bg-success rounded-full" style={{ width: '81.2%' }} />
        </div>
      </MetricCard>

      {/* Avg Settlement Time */}
      <MetricCard
        label="Avg Settlement Time"
        value="2m 14s"
        subValue="SLA target: 3m 00s"
        change={-8.6}
        changeLabel="faster than yesterday"
        trend="down"
        trendPositive={true}
        icon={<Clock size={16} />}
        variant="default"
      />
    </div>
  );
}
