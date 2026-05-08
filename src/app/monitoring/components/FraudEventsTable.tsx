'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  ShieldAlert,
  Eye,
  CheckSquare,
  XSquare,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import StatusBadge from '@/components/ui/StatusBadge';
import RiskScore from '@/components/ui/RiskScore';
import EmptyState from '@/components/ui/EmptyState';

type FraudSeverity = 'critical' | 'high' | 'medium' | 'low';
type FraudStatus = 'open' | 'resolved';

interface FraudEvent {
  id: string;
  severity: FraudSeverity;
  eventType: string;
  affectedAccount: string;
  linkedTxId: string;
  amount: number;
  riskScore: number;
  detectedAt: string;
  analyst: string | null;
  status: FraudStatus;
  notes: string;
}

// Backend integration point: replace with API call to /api/fraud-events?page=1&limit=10
const FRAUD_EVENTS: FraudEvent[] = [
  {
    id: 'frd-2291',
    severity: 'critical',
    eventType: 'Velocity Anomaly',
    affectedAccount: 'Nexora Capital LLC',
    linkedTxId: 'txfr-10091',
    amount: 284500,
    riskScore: 94,
    detectedAt: '04/29 12:34',
    analyst: null,
    status: 'open',
    notes: '11 transfers in 4 min window',
  },
  {
    id: 'frd-2290',
    severity: 'critical',
    eventType: 'Blacklist Match',
    affectedAccount: 'Irongate Partners',
    linkedTxId: 'txfr-10085',
    amount: 32100,
    riskScore: 91,
    detectedAt: '04/29 12:08',
    analyst: 'Marcus Reid',
    status: 'open',
    notes: 'Receiver OFAC match — hold pending review',
  },
  {
    id: 'frd-2289',
    severity: 'high',
    eventType: 'Geo-IP Mismatch',
    affectedAccount: 'Redwood Ventures',
    linkedTxId: 'txfr-10087',
    amount: 47300,
    riskScore: 78,
    detectedAt: '04/29 11:44',
    analyst: 'Priya Nambiar',
    status: 'open',
    notes: 'Login from Lagos, account registered in NYC',
  },
  {
    id: 'frd-2288',
    severity: 'high',
    eventType: 'Auth Brute Force',
    affectedAccount: 'Crestfield Holdings',
    linkedTxId: 'txfr-10089',
    amount: 9800,
    riskScore: 82,
    detectedAt: '04/29 11:28',
    analyst: null,
    status: 'open',
    notes: '47 failed login attempts in 3 min',
  },
  {
    id: 'frd-2287',
    severity: 'high',
    eventType: 'Unusual Transfer Size',
    affectedAccount: 'Titan Payments LLC',
    linkedTxId: 'txfr-10080',
    amount: 5200,
    riskScore: 73,
    detectedAt: '04/29 11:18',
    analyst: 'Kwame Asante',
    status: 'open',
    notes: '10x above 30d average for this account',
  },
  {
    id: 'frd-2286',
    severity: 'medium',
    eventType: 'Structuring Pattern',
    affectedAccount: 'Citadel Remittance',
    linkedTxId: 'txfr-10082',
    amount: 18600,
    riskScore: 61,
    detectedAt: '04/29 10:54',
    analyst: 'Sarah Okonkwo',
    status: 'open',
    notes: '9 transfers just below $10K threshold',
  },
  {
    id: 'frd-2285',
    severity: 'medium',
    eventType: 'New Device Login',
    affectedAccount: 'Vantage Payments',
    linkedTxId: 'txfr-10090',
    amount: 51200,
    riskScore: 55,
    detectedAt: '04/29 10:31',
    analyst: 'Marcus Reid',
    status: 'resolved',
    notes: 'Device verified by account holder',
  },
  {
    id: 'frd-2284',
    severity: 'low',
    eventType: 'Off-Hours Activity',
    affectedAccount: 'Solara Payments',
    linkedTxId: 'txfr-10084',
    amount: 215000,
    riskScore: 28,
    detectedAt: '04/29 03:12',
    analyst: 'Priya Nambiar',
    status: 'resolved',
    notes: 'Confirmed scheduled batch — no action needed',
  },
  {
    id: 'frd-2283',
    severity: 'low',
    eventType: 'Large Single Transfer',
    affectedAccount: 'Halcyon Treasury',
    linkedTxId: 'txfr-10086',
    amount: 890000,
    riskScore: 34,
    detectedAt: '04/28 22:47',
    analyst: 'Kwame Asante',
    status: 'resolved',
    notes: 'Pre-approved by compliance — documented',
  },
  {
    id: 'frd-2282',
    severity: 'medium',
    eventType: 'Duplicate Transfer',
    affectedAccount: 'Luminos Financial',
    linkedTxId: 'txfr-10088',
    amount: 126000,
    riskScore: 58,
    detectedAt: '04/28 18:22',
    analyst: null,
    status: 'open',
    notes: 'Identical transfer submitted twice within 90s',
  },
];

const SEVERITY_COLORS: Record<FraudSeverity, string> = {
  critical: 'bg-danger/10 text-danger border-danger/20',
  high: 'bg-warning/10 text-warning border-warning/20',
  medium: 'bg-primary/10 text-primary border-primary/20',
  low: 'bg-muted/20 text-muted-foreground border-border',
};

const SEVERITY_DOT: Record<FraudSeverity, string> = {
  critical: 'bg-danger animate-pulse',
  high: 'bg-warning',
  medium: 'bg-primary',
  low: 'bg-muted-foreground',
};

export default function FraudEventsTable() {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = useMemo(() => {
    let result = FRAUD_EVENTS;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.id.includes(q) ||
          e.affectedAccount.toLowerCase().includes(q) ||
          e.eventType.toLowerCase().includes(q) ||
          e.linkedTxId.includes(q)
      );
    }
    if (severityFilter !== 'all') result = result.filter((e) => e.severity === severityFilter);
    if (statusFilter !== 'all') result = result.filter((e) => e.status === statusFilter);
    return result;
  }, [search, severityFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const openCount = FRAUD_EVENTS.filter((e) => e.status === 'open').length;
  const criticalCount = FRAUD_EVENTS.filter((e) => e.severity === 'critical').length;

  const handleResolve = (event: FraudEvent) => {
    // Backend integration point: POST /api/fraud-events/{id}/resolve
    toast.success(`Fraud event ${event.id} marked as resolved`, {
      description: `${event.eventType} — ${event.affectedAccount}`,
    });
  };

  const handleEscalate = (event: FraudEvent) => {
    // Backend integration point: POST /api/fraud-events/{id}/escalate
    toast.warning(`Event ${event.id} escalated to compliance team`, {
      description: 'Compliance will be notified within 5 minutes',
    });
  };

  return (
    <div className="bg-surface border border-border rounded-lg shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert size={15} className="text-danger" />
            <h3 className="text-sm font-600 text-white">Fraud Event Log</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-600 px-1.5 py-0.5 rounded-full bg-danger/15 text-danger border border-danger/20 tabular-nums">
              {openCount} open
            </span>
            <span className="text-[10px] font-600 px-1.5 py-0.5 rounded-full bg-danger/10 text-danger border border-danger/15 tabular-nums">
              {criticalCount} critical
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search
              size={12}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="bg-surface-elevated border border-border rounded-lg pl-7 pr-3 py-1.5 text-sm text-white placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors w-48"
            />
          </div>
          <select
            value={severityFilter}
            onChange={(e) => {
              setSeverityFilter(e.target.value);
              setPage(1);
            }}
            className="bg-surface-elevated border border-border rounded-lg px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-surface-elevated border border-border rounded-lg px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm min-w-[1000px]">
          <thead>
            <tr className="border-b border-border">
              {[
                'Event ID',
                'Severity',
                'Event Type',
                'Affected Account',
                'Linked Transfer',
                'Amount',
                'Risk Score',
                'Detected',
                'Analyst',
                'Status',
                'Actions',
              ].map((col, i) => (
                <th
                  key={`fraud-col-${i}`}
                  className="px-4 py-2.5 text-left text-[10px] font-500 uppercase tracking-widest text-muted-foreground whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={11}>
                  <EmptyState
                    icon={ShieldAlert}
                    title="No fraud events found"
                    description="No fraud events match your current filters. Adjust severity or status filters to see more results."
                    action={{
                      label: 'Clear Filters',
                      onClick: () => {
                        setSearch('');
                        setSeverityFilter('all');
                        setStatusFilter('all');
                      },
                    }}
                  />
                </td>
              </tr>
            ) : (
              paginated.map((event) => (
                <tr
                  key={event.id}
                  onMouseEnter={() => setHoveredRow(event.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={`border-b border-border/50 transition-colors duration-100 ${
                    hoveredRow === event.id ? 'bg-surface-elevated' : ''
                  } ${event.status === 'resolved' ? 'opacity-60' : ''}`}
                >
                  {/* Event ID */}
                  <td className="px-4 py-3 font-mono text-[11px] text-primary tabular-nums whitespace-nowrap">
                    {event.id}
                  </td>

                  {/* Severity */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-500 border whitespace-nowrap ${SEVERITY_COLORS[event.severity]}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${SEVERITY_DOT[event.severity]}`}
                      />
                      {event.severity.charAt(0).toUpperCase() + event.severity.slice(1)}
                    </span>
                  </td>

                  {/* Event Type */}
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-[12px] font-500 text-white whitespace-nowrap">
                        {event.eventType}
                      </p>
                      <p
                        className="text-[10px] text-muted-foreground mt-0.5 max-w-[180px] truncate"
                        title={event.notes}
                      >
                        {event.notes}
                      </p>
                    </div>
                  </td>

                  {/* Affected Account */}
                  <td className="px-4 py-3 text-[12px] text-white max-w-[140px] truncate whitespace-nowrap">
                    {event.affectedAccount}
                  </td>

                  {/* Linked Transfer */}
                  <td className="px-4 py-3">
                    <span className="font-mono text-[11px] text-primary/80 bg-primary/5 px-1.5 py-0.5 rounded border border-primary/15">
                      {event.linkedTxId}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-3 font-mono text-[12px] font-600 text-white tabular-nums whitespace-nowrap">
                    ${event.amount.toLocaleString()}
                  </td>

                  {/* Risk Score */}
                  <td className="px-4 py-3">
                    <RiskScore score={event.riskScore} />
                  </td>

                  {/* Detected At */}
                  <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                    {event.detectedAt}
                  </td>

                  {/* Analyst */}
                  <td className="px-4 py-3 text-[12px] whitespace-nowrap">
                    {event.analyst ? (
                      <span className="text-muted-foreground">{event.analyst}</span>
                    ) : (
                      <span className="text-warning/70 text-[11px]">Unassigned</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <StatusBadge status={event.status} />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div
                      className={`flex items-center gap-1 transition-opacity duration-100 ${
                        hoveredRow === event.id ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <button
                        className="p-1.5 rounded hover:bg-surface text-muted-foreground hover:text-white transition-colors"
                        title="View full event details"
                      >
                        <Eye size={13} />
                      </button>
                      {event.status === 'open' && (
                        <>
                          <button
                            onClick={() => handleResolve(event)}
                            className="p-1.5 rounded hover:bg-success/10 text-muted-foreground hover:text-success transition-colors"
                            title="Mark as resolved"
                          >
                            <CheckSquare size={13} />
                          </button>
                          <button
                            onClick={() => handleEscalate(event)}
                            className="p-1.5 rounded hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors"
                            title="Escalate to compliance"
                          >
                            <XSquare size={13} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-border">
        <p className="text-[12px] text-muted-foreground">
          Showing{' '}
          <span className="text-white font-500">
            {Math.min((page - 1) * perPage + 1, filtered.length)}–
            {Math.min(page * perPage, filtered.length)}
          </span>{' '}
          of <span className="text-white font-500">{filtered.length}</span> events
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="p-1.5 rounded border border-border text-muted-foreground hover:text-white hover:bg-surface-elevated disabled:opacity-30 transition-all duration-150"
            aria-label="Previous page"
          >
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={`fraud-page-${p}`}
              onClick={() => setPage(p)}
              className={`w-7 h-7 rounded text-[12px] font-500 transition-all duration-150 ${
                p === page
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:text-white hover:bg-surface-elevated border border-border'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages || totalPages === 0}
            className="p-1.5 rounded border border-border text-muted-foreground hover:text-white hover:bg-surface-elevated disabled:opacity-30 transition-all duration-150"
            aria-label="Next page"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
