'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Eye,
  CheckCircle,
  XCircle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import StatusBadge from '@/components/ui/StatusBadge';
import RiskScore from '@/components/ui/RiskScore';
import EmptyState from '@/components/ui/EmptyState';
import { ArrowLeftRight } from 'lucide-react';
import ApproveConfirmModal from './ApproveConfirmModal';
import { getTransfers } from '@/lib/transfers/store';
import type { Transfer } from '@/lib/transfers/types';

type SortDir = 'asc' | 'desc' | null;

type SortKey = keyof Transfer;

interface Props {
  newTransfer: Transfer | null;
}

export default function TransfersTableSection({ newTransfer }: Props) {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('initiatedAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [approveTarget, setApproveTarget] = useState<Transfer | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  useEffect(() => {
    // Load transfers directly from Supabase
    const loadTransfers = async () => {
      try {
        setIsLoading(true);
        const data = await getTransfers();
        setTransfers(data);
      } catch (_error) {
        toast.error('Could not load transfers');
      } finally {
        setIsLoading(false);
      }
    };

    void loadTransfers();
  }, []);

  useEffect(() => {
    if (!newTransfer) return;
    setTransfers((previous) => [newTransfer, ...previous]);
  }, [newTransfer]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : sortDir === 'desc' ? null : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const filtered = useMemo(() => {
    let result = transfers;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.id.includes(q) ||
          t.sender.toLowerCase().includes(q) ||
          t.receiver.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') result = result.filter((t) => t.status === statusFilter);
    if (methodFilter !== 'all') result = result.filter((t) => t.method === methodFilter);
    if (sortKey && sortDir) {
      result = [...result].sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        if (av === null) return 1;
        if (bv === null) return -1;
        const cmp = av < bv ? -1 : av > bv ? 1 : 0;
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return result;
  }, [transfers, search, statusFilter, methodFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleRow = (id: string) => {
    const next = new Set(selectedRows);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedRows(next);
  };

  const toggleAll = () => {
    if (selectedRows.size === paginated.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginated.map((t) => t.id)));
    }
  };

  const needsDualApproval = (transfer: Transfer) =>
    transfer.status === 'pending' && (transfer.amount > 100000 || transfer.risk >= 70);

  const handleApprove = (transfer: Transfer) => {
    setApproveTarget(transfer);
  };

  const handleApproveConfirm = () => {
    if (!approveTarget) return;

    const nextStatus: Transfer['status'] =
      approveTarget.status === 'pending_review' || !needsDualApproval(approveTarget)
        ? 'processing'
        : 'pending_review';

    setTransfers((previous) =>
      previous.map((transfer) =>
        transfer.id === approveTarget.id ? { ...transfer, status: nextStatus } : transfer
      )
    );

    toast.success(
      nextStatus === 'pending_review'
        ? `Transfer ${approveTarget.id} moved to secondary review`
        : `Transfer ${approveTarget.id} approved`,
      {
        description:
          nextStatus === 'pending_review'
            ? 'A second approver is required before processing.'
            : `$${approveTarget.amount.toLocaleString()} — moved to processing`,
      }
    );

    setApproveTarget(null);
  };

  const handleReject = (transfer: Transfer) => {
    setTransfers((previous) =>
      previous.map((item) => (item.id === transfer.id ? { ...item, status: 'reversed' } : item))
    );

    toast.error(`Transfer ${transfer.id} rejected`, {
      description: 'Sender will be notified',
    });
  };

  const handleBulkApprove = () => {
    const pendingSelected = transfers.filter(
      (transfer) =>
        selectedRows.has(transfer.id) &&
        (transfer.status === 'pending' || transfer.status === 'pending_review')
    );

    if (pendingSelected.length === 0) {
      toast.error('No pending transfers selected for approval');
      return;
    }

    setTransfers((previous) =>
      previous.map((transfer) => {
        if (!selectedRows.has(transfer.id)) return transfer;
        if (transfer.status !== 'pending' && transfer.status !== 'pending_review') return transfer;

        return {
          ...transfer,
          status:
            transfer.status === 'pending_review' || !needsDualApproval(transfer)
              ? 'processing'
              : 'pending_review',
        };
      })
    );

    toast.success(
      `${pendingSelected.length} transfer${pendingSelected.length !== 1 ? 's' : ''} approved`,
      {
        description: 'Selected transfers were moved through the approval workflow.',
      }
    );
    setSelectedRows(new Set());
  };

  const handleBulkReject = () => {
    const rejectedCount = transfers.filter(
      (transfer) =>
        selectedRows.has(transfer.id) &&
        (transfer.status === 'pending' || transfer.status === 'pending_review')
    ).length;

    if (rejectedCount === 0) {
      toast.error('No pending transfers selected for rejection');
      return;
    }

    setTransfers((previous) =>
      previous.map((transfer) =>
        selectedRows.has(transfer.id) &&
        (transfer.status === 'pending' || transfer.status === 'pending_review')
          ? { ...transfer, status: 'reversed' }
          : transfer
      )
    );

    toast.error(`${rejectedCount} transfer${rejectedCount !== 1 ? 's' : ''} rejected`, {
      description: 'Selected pending transfers were declined.',
    });
    setSelectedRows(new Set());
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronsUpDown size={12} className="text-muted-foreground/40" />;
    if (sortDir === 'asc') return <ChevronUp size={12} className="text-primary" />;
    if (sortDir === 'desc') return <ChevronDown size={12} className="text-primary" />;
    return <ChevronsUpDown size={12} className="text-muted-foreground/40" />;
  };

  return (
    <>
      <div className="bg-surface border border-border rounded-lg shadow-card">
        {/* Filter bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search by ID, sender, or receiver..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-surface-elevated border border-border rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={13} className="text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-surface-elevated border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="pending_review">Pending Review</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="reversed">Reversed</option>
            </select>
            <select
              value={methodFilter}
              onChange={(e) => {
                setMethodFilter(e.target.value);
                setPage(1);
              }}
              className="bg-surface-elevated border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors"
            >
              <option value="all">All Methods</option>
              <option value="ACH">ACH</option>
              <option value="Wire">Wire</option>
              <option value="SWIFT">SWIFT</option>
              <option value="RTP">RTP</option>
            </select>
          </div>
          <div className="ml-auto text-[12px] text-muted-foreground">
            {isLoading
              ? 'Loading transfers...'
              : `${filtered.length} transfer${filtered.length !== 1 ? 's' : ''}`}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm min-w-[1100px]">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginated.length && paginated.length > 0}
                    onChange={toggleAll}
                    className="rounded border-border bg-surface-elevated accent-primary"
                    aria-label="Select all rows"
                  />
                </th>
                {(
                  [
                    ['id', 'Transfer ID'],
                    ['sender', 'Sender'],
                    ['receiver', 'Receiver'],
                    ['amount', 'Amount'],
                    ['fee', 'Fee'],
                    ['method', 'Method'],
                    ['risk', 'Risk'],
                    ['status', 'Status'],
                    ['initiatedBy', 'Initiated By'],
                    ['initiatedAt', 'Initiated'],
                  ] as [SortKey, string][]
                ).map(([key, label]) => (
                  <th
                    key={`col-${key}`}
                    onClick={() => handleSort(key)}
                    className="px-4 py-3 text-left text-[10px] font-500 uppercase tracking-widest text-muted-foreground cursor-pointer hover:text-white transition-colors whitespace-nowrap select-none"
                  >
                    <span className="flex items-center gap-1">
                      {label}
                      <SortIcon col={key} />
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 w-28 text-[10px] font-500 uppercase tracking-widest text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={12} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    Loading transfers...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={12}>
                    <EmptyState
                      icon={ArrowLeftRight}
                      title="No transfers found"
                      description="No transfers match your current filters. Try adjusting your search or filter criteria."
                      action={{
                        label: 'Clear Filters',
                        onClick: () => {
                          setSearch('');
                          setStatusFilter('all');
                          setMethodFilter('all');
                        },
                      }}
                    />
                  </td>
                </tr>
              ) : (
                paginated.map((t) => (
                  <tr
                    key={t.id}
                    onMouseEnter={() => setHoveredRow(t.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={`border-b border-border/50 transition-colors duration-100 ${
                      selectedRows.has(t.id)
                        ? 'bg-primary/5'
                        : hoveredRow === t.id
                          ? 'bg-surface-elevated'
                          : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(t.id)}
                        onChange={() => toggleRow(t.id)}
                        className="rounded border-border bg-surface-elevated accent-primary"
                        aria-label={`Select transfer ${t.id}`}
                      />
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-primary tabular-nums whitespace-nowrap">
                      {t.id}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-[12px] font-500 text-white truncate max-w-[130px]">
                          {t.sender}
                        </p>
                        <p className="text-[10px] font-mono text-muted-foreground">
                          {t.senderAccount}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-[12px] text-muted-foreground truncate max-w-[130px]">
                          {t.receiver}
                        </p>
                        <p className="text-[10px] font-mono text-muted-foreground">
                          {t.receiverAccount}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-[12px] font-600 text-white tabular-nums whitespace-nowrap">
                      ${t.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground tabular-nums">
                      ${t.fee.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-surface-elevated text-muted-foreground border border-border">
                        {t.method}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <RiskScore score={t.risk} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="px-4 py-3 text-[12px] text-muted-foreground whitespace-nowrap">
                      {t.initiatedBy}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                      {t.initiatedAt}
                    </td>
                    <td className="px-4 py-3">
                      <div
                        className={`flex items-center gap-1 transition-opacity duration-100 ${
                          hoveredRow === t.id ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <button
                          className="p-1.5 rounded hover:bg-surface text-muted-foreground hover:text-white transition-colors"
                          title="View transfer details"
                        >
                          <Eye size={13} />
                        </button>
                        {(t.status === 'pending' || t.status === 'pending_review') && (
                          <>
                            <button
                              onClick={() => handleApprove(t)}
                              className="p-1.5 rounded hover:bg-success/10 text-muted-foreground hover:text-success transition-colors"
                              title="Approve transfer"
                            >
                              <CheckCircle size={13} />
                            </button>
                            <button
                              onClick={() => handleReject(t)}
                              className="p-1.5 rounded hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors"
                              title="Reject transfer"
                            >
                              <XCircle size={13} />
                            </button>
                          </>
                        )}
                        {t.status === 'completed' && (
                          <button
                            className="p-1.5 rounded hover:bg-warning/10 text-muted-foreground hover:text-warning transition-colors"
                            title="Request reversal"
                          >
                            <RotateCcw size={13} />
                          </button>
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
            of <span className="text-white font-500">{filtered.length}</span> transfers
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
                key={`page-${p}`}
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
              disabled={page === totalPages}
              className="p-1.5 rounded border border-border text-muted-foreground hover:text-white hover:bg-surface-elevated disabled:opacity-30 transition-all duration-150"
              aria-label="Next page"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk action bar */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-200 ${
          selectedRows.size > 0
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-surface-elevated border border-border shadow-modal">
          <span className="text-sm font-500 text-white">{selectedRows.size} selected</span>
          <div className="w-px h-4 bg-border" />
          <button
            onClick={handleBulkApprove}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success/10 text-success text-[12px] font-500 hover:bg-success/20 transition-colors"
          >
            <CheckCircle size={13} />
            Approve Selected
          </button>
          <button
            onClick={handleBulkReject}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-danger/10 text-danger text-[12px] font-500 hover:bg-danger/20 transition-colors"
          >
            <XCircle size={13} />
            Reject Selected
          </button>
          <button
            onClick={() => setSelectedRows(new Set())}
            className="text-[12px] text-muted-foreground hover:text-white transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <ApproveConfirmModal
        transfer={approveTarget}
        onClose={() => setApproveTarget(null)}
        onConfirm={handleApproveConfirm}
      />
    </>
  );
}
