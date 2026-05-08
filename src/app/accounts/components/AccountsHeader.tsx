'use client';

import React from 'react';
import { Plus, Shield } from 'lucide-react';

interface AccountsHeaderProps {
  totalAccounts: number;
  activeAccounts: number;
  pendingReviewAccounts: number;
  onCreateAccount: () => void;
}

export default function AccountsHeader({
  totalAccounts,
  activeAccounts,
  pendingReviewAccounts,
  onCreateAccount,
}: AccountsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-2xl font-600 text-white">Accounts</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Create and monitor customer accounts across your operation
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="rounded-lg border border-border bg-surface-elevated px-3 py-1.5 text-xs text-muted-foreground">
          Total: <span className="font-600 text-white">{totalAccounts}</span>
        </div>
        <div className="rounded-lg border border-success/30 bg-success/10 px-3 py-1.5 text-xs text-success">
          Active: <span className="font-600">{activeAccounts}</span>
        </div>
        <div className="rounded-lg border border-warning/30 bg-warning/10 px-3 py-1.5 text-xs text-warning">
          Pending Review: <span className="font-600">{pendingReviewAccounts}</span>
        </div>
        <button
          onClick={onCreateAccount}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-sm font-500 text-white transition-all duration-150 hover:bg-primary/90 active:scale-95"
        >
          <Plus size={14} />
          <span>Create Account</span>
        </button>
        <div className="hidden items-center gap-1.5 rounded-lg border border-border bg-surface-elevated px-3 py-1.5 text-xs text-muted-foreground xl:flex">
          <Shield size={13} />
          <span>KYC controls in next phase</span>
        </div>
      </div>
    </div>
  );
}
