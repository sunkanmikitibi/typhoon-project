'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader2, AlertCircle } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import type { Transfer } from '@/lib/transfers/types';

interface TransferFormData {
  senderAccount: string;
  receiverAccount: string;
  receiverName: string;
  receiverBank: string;
  amount: string;
  currency: string;
  transferMethod: string;
  reference: string;
  priority: string;
  notes: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onCreateTransfer: (transfer: Transfer) => void;
}

function getRiskScore(amount: number) {
  if (amount >= 250000) return 92;
  if (amount >= 150000) return 80;
  if (amount >= 100000) return 70;
  if (amount >= 50000) return 58;
  if (amount >= 15000) return 40;
  return 24;
}

export default function InitiateTransferModal({ open, onClose, onCreateTransfer }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransferFormData>({
    defaultValues: {
      currency: 'USD',
      transferMethod: 'ACH',
      priority: 'standard',
    },
  });

  const onSubmit = async (data: TransferFormData) => {
    setIsSubmitting(true);
    const amount = parseFloat(data.amount);
    const transfer: Transfer = {
      id: `txfr-${Date.now()}`,
      sender: data.senderAccount,
      senderAccount: data.senderAccount,
      receiver: data.receiverName,
      receiverAccount: data.receiverAccount,
      amount,
      fee: Math.max(2, Math.round(amount * 0.00095 * 100) / 100),
      currency: data.currency,
      method: data.transferMethod,
      status: 'pending',
      risk: getRiskScore(amount),
      initiatedBy: 'You',
      initiatedAt: new Date().toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      settledAt: null,
    };

    // Backend integration point: POST /api/transfers/initiate with data
    await new Promise((r) => setTimeout(r, 1600));
    setIsSubmitting(false);
    toast.success('Transfer initiated — pending approval', {
      description: `${data.transferMethod} transfer of $${amount.toLocaleString()} queued successfully`,
    });
    onCreateTransfer(transfer);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Initiate Transfer"
      subtitle="Fill in transfer details. High-risk transfers require dual approval."
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Sender */}
        <div className="space-y-1">
          <label className="block text-[12px] font-500 text-muted-foreground uppercase tracking-widest">
            Sender Account
          </label>
          <p className="text-[11px] text-muted-foreground/70">
            Select the originating account for this transfer
          </p>
          <select
            {...register('senderAccount', { required: 'Sender account is required' })}
            className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors"
          >
            <option value="">Select account...</option>
            <option value="Nexora Capital LLC — ****4821">Nexora Capital LLC — ****4821</option>
            <option value="Vantage Payments — ****2293">Vantage Payments — ****2293</option>
            <option value="Luminos Financial — ****7741">Luminos Financial — ****7741</option>
            <option value="Halcyon Treasury — ****0094">Halcyon Treasury — ****0094</option>
          </select>
          {errors.senderAccount && (
            <p className="flex items-center gap-1 text-[11px] text-danger mt-1">
              <AlertCircle size={11} />
              {errors.senderAccount.message}
            </p>
          )}
        </div>

        {/* Receiver */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-[12px] font-500 text-muted-foreground uppercase tracking-widest">
              Receiver Name
            </label>
            <input
              type="text"
              placeholder="e.g. Orion Bank NA"
              {...register('receiverName', { required: 'Receiver name is required' })}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            {errors.receiverName && (
              <p className="flex items-center gap-1 text-[11px] text-danger mt-1">
                <AlertCircle size={11} />
                {errors.receiverName.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <label className="block text-[12px] font-500 text-muted-foreground uppercase tracking-widest">
              Receiver Bank
            </label>
            <input
              type="text"
              placeholder="e.g. JPMorgan Chase"
              {...register('receiverBank', { required: 'Receiver bank is required' })}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            {errors.receiverBank && (
              <p className="flex items-center gap-1 text-[11px] text-danger mt-1">
                <AlertCircle size={11} />
                {errors.receiverBank.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-[12px] font-500 text-muted-foreground uppercase tracking-widest">
            Receiver Account Number
          </label>
          <input
            type="text"
            placeholder="Account number or IBAN"
            {...register('receiverAccount', {
              required: 'Receiver account is required',
              minLength: { value: 8, message: 'Account number too short' },
            })}
            className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm font-mono text-white placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
          {errors.receiverAccount && (
            <p className="flex items-center gap-1 text-[11px] text-danger mt-1">
              <AlertCircle size={11} />
              {errors.receiverAccount.message}
            </p>
          )}
        </div>

        {/* Amount + Currency */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-1">
            <label className="block text-[12px] font-500 text-muted-foreground uppercase tracking-widest">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-mono">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                {...register('amount', {
                  required: 'Amount is required',
                  min: { value: 0.01, message: 'Amount must be greater than 0' },
                })}
                className="w-full bg-surface border border-border rounded-lg pl-7 pr-3 py-2 text-sm font-mono text-white placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors tabular-nums"
              />
            </div>
            {errors.amount && (
              <p className="flex items-center gap-1 text-[11px] text-danger mt-1">
                <AlertCircle size={11} />
                {errors.amount.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <label className="block text-[12px] font-500 text-muted-foreground uppercase tracking-widest">
              Currency
            </label>
            <select
              {...register('currency')}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="CAD">CAD</option>
            </select>
          </div>
        </div>

        {/* Method + Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-[12px] font-500 text-muted-foreground uppercase tracking-widest">
              Transfer Method
            </label>
            <select
              {...register('transferMethod')}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors"
            >
              <option value="ACH">ACH</option>
              <option value="Wire">Wire Transfer</option>
              <option value="SWIFT">SWIFT</option>
              <option value="RTP">RTP (Real-Time)</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-[12px] font-500 text-muted-foreground uppercase tracking-widest">
              Priority
            </label>
            <select
              {...register('priority')}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors"
            >
              <option value="standard">Standard (1–2 days)</option>
              <option value="same-day">Same-Day ACH</option>
              <option value="urgent">Urgent Wire</option>
            </select>
          </div>
        </div>

        {/* Reference */}
        <div className="space-y-1">
          <label className="block text-[12px] font-500 text-muted-foreground uppercase tracking-widest">
            Reference / Memo
          </label>
          <p className="text-[11px] text-muted-foreground/70">
            Optional reference that will appear on the receiver&apos;s statement
          </p>
          <input
            type="text"
            placeholder="Invoice #INV-2026-0441 or payment description"
            {...register('reference')}
            className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Notes */}
        <div className="space-y-1">
          <label className="block text-[12px] font-500 text-muted-foreground uppercase tracking-widest">
            Internal Notes
          </label>
          <textarea
            rows={2}
            placeholder="Notes visible only to internal ops team..."
            {...register('notes')}
            className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
          />
        </div>

        {/* Warning for large amounts */}
        <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-warning/5 border border-warning/20">
          <AlertCircle size={13} className="text-warning shrink-0 mt-0.5" />
          <p className="text-[11px] text-warning/90">
            Transfers exceeding $100,000 require dual approval from a second ops analyst before
            processing.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-white hover:bg-surface-elevated border border-border transition-all duration-150 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-white text-sm font-500 hover:bg-primary/90 active:scale-95 transition-all duration-150 disabled:opacity-70 min-w-[160px] justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              'Submit for Approval'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
