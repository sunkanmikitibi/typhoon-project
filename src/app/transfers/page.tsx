'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import TransfersHeader from './components/TransfersHeader';
import TransfersTableSection from './components/TransfersTableSection';
import InitiateTransferModal from './components/InitiateTransferModal';
import type { Transfer } from '@/lib/transfers/types';

export default function TransfersPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTransfer, setNewTransfer] = useState<Transfer | null>(null);

  const handleCreateTransfer = (transfer: Transfer) => {
    setNewTransfer(transfer);
    setShowCreateModal(false);
  };

  return (
    <AppLayout>
      <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto space-y-6">
        <TransfersHeader onInitiateTransfer={() => setShowCreateModal(true)} />
        <TransfersTableSection newTransfer={newTransfer} />
      </div>

      <InitiateTransferModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateTransfer={handleCreateTransfer}
      />
    </AppLayout>
  );
}
