'use client';

import React, { useMemo, useState } from 'react';
import { Lock, ShieldCheck, Search } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';
import type { Account, AccountStatus } from '@/lib/accounts/types';

interface AccountsTableSectionProps {
  accounts: Account[];
}

export default function AccountsTableSection({ accounts }: AccountsTableSectionProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AccountStatus>('all');

  const filtered = useMemo(() => {
    let result = accounts;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (account) =>
          account.accountId.toLowerCase().includes(q) ||
          account.holderName.toLowerCase().includes(q) ||
          account.email.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter((account) => account.status === statusFilter);
    }
    return result;
  }, [accounts, search, statusFilter]);

  return (
    <div className="rounded-lg border border-border bg-surface shadow-card">
      <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-4">
        <div className="relative min-w-[220px] flex-1">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search by account ID, name, or email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-lg border border-border bg-surface-elevated py-2 pl-8 pr-3 text-sm text-white placeholder-muted-foreground transition-colors focus:border-primary focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as 'all' | AccountStatus)}
          className="rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-white transition-colors focus:border-primary focus:outline-none"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="pending_review">Pending Review</option>
          <option value="frozen">Frozen</option>
          <option value="closed">Closed</option>
        </select>

        <div className="ml-auto text-xs text-muted-foreground">
          {filtered.length} account{filtered.length === 1 ? '' : 's'}
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="min-w-[980px] w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-muted-foreground">
                Account ID
              </th>
              <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-muted-foreground">
                Holder
              </th>
              <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-muted-foreground">
                Type
              </th>
              <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-muted-foreground">
                Created
              </th>
              <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-muted-foreground">
                Available Balance
              </th>
              <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <EmptyState
                    icon={ShieldCheck}
                    title="No accounts found"
                    description="No accounts match your filters. Try broadening your search criteria."
                    action={{
                      label: 'Reset filters',
                      onClick: () => {
                        setSearch('');
                        setStatusFilter('all');
                      },
                    }}
                  />
                </td>
              </tr>
            ) : (
              filtered.map((account) => (
                <tr key={account.accountId} className="border-b border-border/50">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px] text-primary">
                    {account.accountId}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[12px] font-500 text-white">{account.holderName}</p>
                    <p className="text-[11px] text-muted-foreground">{account.email}</p>
                  </td>
                  <td className="px-4 py-3 text-[12px] capitalize text-muted-foreground">
                    {account.accountType}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={account.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px] text-muted-foreground">
                    {account.createdAt}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-[12px] text-white">
                    {account.currency} {account.availableBalance.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled
                        title="Freeze account (next phase)"
                        className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground opacity-70"
                      >
                        <Lock size={12} />
                        Freeze
                      </button>
                      <button
                        type="button"
                        disabled
                        title="Unfreeze account (next phase)"
                        className="rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground opacity-70"
                      >
                        Unfreeze
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
