'use client';

import React, { useState } from 'react';
import { Loader2, CheckCircle } from 'lucide-react';
import Modal from '@/components/ui/Modal';

interface Transfer {
  id: string;
  sender: string;
  receiver: string;
  amount: number;
  method: string;
  risk: number;
}

interface Props {
  transfer: Transfer | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ApproveConfirmModal({ transfer, onClose, onConfirm }: Props) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    onConfirm();
  };

  if (!transfer) return null;

  return (
    <Modal
      open={!!transfer}
      onClose={onClose}
      title="Approve Transfer"
      subtitle="Review and confirm this transfer for processing"
      size="sm"
    >
      <div className="space-y-4">
        <div className="rounded-lg bg-surface border border-border p-4 space-y-3">
          {[
            ['Transfer ID', transfer.id],
            ['Sender', transfer.sender],
            ['Receiver', transfer.receiver],
            ['Amount', `$${transfer.amount.toLocaleString()} USD`],
            ['Method', transfer.method],
            ['Risk Score', `${transfer.risk} / 100`],
          ].map(([label, value]) => (
            <div key={`confirm-${label}`} className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-500">
                {label}
              </span>
              <span className="text-sm font-mono font-600 text-white">{value}</span>
            </div>
          ))}
        </div>
        {transfer.risk >= 75 && (
          <div className="px-3 py-2.5 rounded-lg bg-danger/5 border border-danger/20 text-[11px] text-danger">
            High risk score detected — ensure compliance review is complete before approving.
          </div>
        )}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-white hover:bg-surface-elevated border border-border transition-all duration-150 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-success text-white text-sm font-500 hover:bg-success/90 active:scale-95 transition-all duration-150 disabled:opacity-70 min-w-[130px] justify-center"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>
                <CheckCircle size={14} />
                Approve
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
