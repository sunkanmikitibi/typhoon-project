import React from 'react';

type StatusType =
  | 'completed'
  | 'pending'
  | 'pending_review'
  | 'processing'
  | 'failed'
  | 'reversed'
  | 'active'
  | 'frozen'
  | 'closed'
  | 'approved'
  | 'rejected'
  | 'critical'
  | 'high'
  | 'medium'
  | 'low'
  | 'healthy'
  | 'degraded'
  | 'down'
  | 'open'
  | 'resolved';

const STATUS_CONFIG: Record<StatusType, { label: string; className: string; dot: string }> = {
  completed: {
    label: 'Completed',
    className: 'bg-success/10 text-success border border-success/20',
    dot: 'bg-success',
  },
  pending: {
    label: 'Pending',
    className: 'bg-warning/10 text-warning border border-warning/20',
    dot: 'bg-warning',
  },
  pending_review: {
    label: 'Pending Review',
    className: 'bg-warning/10 text-warning border border-warning/20',
    dot: 'bg-warning animate-pulse',
  },
  active: {
    label: 'Active',
    className: 'bg-success/10 text-success border border-success/20',
    dot: 'bg-success',
  },
  frozen: {
    label: 'Frozen',
    className: 'bg-primary/10 text-primary border border-primary/20',
    dot: 'bg-primary',
  },
  closed: {
    label: 'Closed',
    className: 'bg-muted/30 text-muted-foreground border border-border',
    dot: 'bg-muted-foreground',
  },
  processing: {
    label: 'Processing',
    className: 'bg-primary/10 text-primary border border-primary/20',
    dot: 'bg-primary animate-pulse',
  },
  failed: {
    label: 'Failed',
    className: 'bg-danger/10 text-danger border border-danger/20',
    dot: 'bg-danger',
  },
  reversed: {
    label: 'Reversed',
    className: 'bg-muted/30 text-muted-foreground border border-border',
    dot: 'bg-muted-foreground',
  },
  approved: {
    label: 'Approved',
    className: 'bg-success/10 text-success border border-success/20',
    dot: 'bg-success',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-danger/10 text-danger border border-danger/20',
    dot: 'bg-danger',
  },
  critical: {
    label: 'Critical',
    className: 'bg-danger/15 text-danger border border-danger/30',
    dot: 'bg-danger animate-pulse',
  },
  high: {
    label: 'High',
    className: 'bg-warning/10 text-warning border border-warning/20',
    dot: 'bg-warning',
  },
  medium: {
    label: 'Medium',
    className: 'bg-primary/10 text-primary border border-primary/20',
    dot: 'bg-primary',
  },
  low: {
    label: 'Low',
    className: 'bg-muted/20 text-muted-foreground border border-border',
    dot: 'bg-muted-foreground',
  },
  healthy: {
    label: 'Healthy',
    className: 'bg-success/10 text-success border border-success/20',
    dot: 'bg-success',
  },
  degraded: {
    label: 'Degraded',
    className: 'bg-warning/10 text-warning border border-warning/20',
    dot: 'bg-warning animate-pulse',
  },
  down: {
    label: 'Down',
    className: 'bg-danger/15 text-danger border border-danger/30',
    dot: 'bg-danger animate-pulse',
  },
  open: {
    label: 'Open',
    className: 'bg-danger/10 text-danger border border-danger/20',
    dot: 'bg-danger',
  },
  resolved: {
    label: 'Resolved',
    className: 'bg-success/10 text-success border border-success/20',
    dot: 'bg-success',
  },
};

interface StatusBadgeProps {
  status: StatusType;
  showDot?: boolean;
  className?: string;
}

export default function StatusBadge({ status, showDot = true, className = '' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  if (!config) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-500 whitespace-nowrap ${config.className} ${className}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />}
      {config.label}
    </span>
  );
}
