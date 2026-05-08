'use client';

import React, { useMemo, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import AccountsHeader from './components/AccountsHeader';
import AccountsTableSection from './components/AccountsTableSection';
import CreateAccountModal from './components/CreateAccountModal';
import type { Account, CreateAccountInput } from '@/lib/accounts/types';

const INITIAL_ACCOUNTS: Account[] = [
  {
    accountId: 'acc-20011',
    holderName: 'Apex Treasury Ltd',
    email: 'finance@apextreasury.com',
    accountType: 'business',
    status: 'active',
    country: 'United States',
    currency: 'USD',
    availableBalance: 245000,
    riskTier: 'low',
    createdAt: '04/29 11:04',
  },
  {
    accountId: 'acc-20010',
    holderName: 'Mira Okafor',
    email: 'mira.okafor@example.com',
    accountType: 'individual',
    status: 'pending_review',
    country: 'United Kingdom',
    currency: 'GBP',
    availableBalance: 0,
    riskTier: 'medium',
    createdAt: '04/29 10:21',
  },
  {
    accountId: 'acc-20009',
    holderName: 'Northline Payments',
    email: 'ops@northline.io',
    accountType: 'business',
    status: 'frozen',
    country: 'Germany',
    currency: 'EUR',
    availableBalance: 83400,
    riskTier: 'high',
    createdAt: '04/29 09:44',
  },
  {
    accountId: 'acc-20008',
    holderName: 'Jonas Weber',
    email: 'jonas.weber@example.com',
    accountType: 'individual',
    status: 'closed',
    country: 'Germany',
    currency: 'EUR',
    availableBalance: 0,
    riskTier: 'low',
    createdAt: '04/29 08:53',
  },
];

function createAccountId(seed: number): string {
  return `acc-${String(seed).padStart(5, '0')}`;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const summary = useMemo(
    () => ({
      total: accounts.length,
      active: accounts.filter((account) => account.status === 'active').length,
      pendingReview: accounts.filter((account) => account.status === 'pending_review').length,
    }),
    [accounts]
  );

  const handleCreateAccount = (payload: CreateAccountInput) => {
    setAccounts((previous) => {
      const nextSeed = 20000 + previous.length + 1;
      const nextAccount: Account = {
        accountId: createAccountId(nextSeed),
        holderName: payload.holderName,
        email: payload.email,
        accountType: payload.accountType,
        status: payload.status,
        country: payload.country,
        currency: payload.currency,
        availableBalance: 0,
        riskTier: payload.riskTier,
        createdAt:
          new Date().toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
          }) +
          ' ' +
          new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }),
        notes: payload.notes,
      };
      return [nextAccount, ...previous];
    });
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-screen-2xl space-y-6 px-6 py-6 lg:px-8 xl:px-10">
        <AccountsHeader
          totalAccounts={summary.total}
          activeAccounts={summary.active}
          pendingReviewAccounts={summary.pendingReview}
          onCreateAccount={() => setShowCreateModal(true)}
        />

        <AccountsTableSection accounts={accounts} />
      </div>

      <CreateAccountModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateAccount={handleCreateAccount}
      />
    </AppLayout>
  );
}
