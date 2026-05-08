'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import type { CreateAccountInput } from '@/lib/accounts/types';

interface CreateAccountModalProps {
  open: boolean;
  onClose: () => void;
  onCreateAccount: (payload: CreateAccountInput) => void;
}

export default function CreateAccountModal({
  open,
  onClose,
  onCreateAccount,
}: CreateAccountModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateAccountInput>({
    defaultValues: {
      accountType: 'individual',
      currency: 'USD',
      country: 'United States',
      status: 'pending_review',
      riskTier: 'medium',
      notes: '',
    },
  });

  const onSubmit = async (values: CreateAccountInput) => {
    await new Promise((resolve) => setTimeout(resolve, 450));
    onCreateAccount(values);
    toast.success('Account created', {
      description: `${values.holderName} was added with ${values.status.replace('_', ' ')} status.`,
    });
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Account"
      subtitle="Add a new customer account for operations and transfer workflows."
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-[12px] font-500 uppercase tracking-widest text-muted-foreground">
              Account Type
            </label>
            <select
              {...register('accountType')}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-white transition-colors focus:border-primary focus:outline-none"
            >
              <option value="individual">Individual</option>
              <option value="business">Business</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[12px] font-500 uppercase tracking-widest text-muted-foreground">
              Initial Status
            </label>
            <select
              {...register('status')}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-white transition-colors focus:border-primary focus:outline-none"
            >
              <option value="pending_review">Pending Review</option>
              <option value="active">Active</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-[12px] font-500 uppercase tracking-widest text-muted-foreground">
            Legal Name
          </label>
          <input
            type="text"
            placeholder="Acme Holdings LLC"
            {...register('holderName', { required: 'Legal name is required' })}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-white placeholder-muted-foreground transition-colors focus:border-primary focus:outline-none"
          />
          {errors.holderName && <p className="text-xs text-danger">{errors.holderName.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-[12px] font-500 uppercase tracking-widest text-muted-foreground">
            Contact Email
          </label>
          <input
            type="email"
            placeholder="ops@acme.com"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address',
              },
            })}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-white placeholder-muted-foreground transition-colors focus:border-primary focus:outline-none"
          />
          {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <label className="block text-[12px] font-500 uppercase tracking-widest text-muted-foreground">
              Country
            </label>
            <input
              type="text"
              {...register('country', { required: 'Country is required' })}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-white transition-colors focus:border-primary focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[12px] font-500 uppercase tracking-widest text-muted-foreground">
              Currency
            </label>
            <select
              {...register('currency')}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-white transition-colors focus:border-primary focus:outline-none"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-[12px] font-500 uppercase tracking-widest text-muted-foreground">
              Risk Tier
            </label>
            <select
              {...register('riskTier')}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-white transition-colors focus:border-primary focus:outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-[12px] font-500 uppercase tracking-widest text-muted-foreground">
            Internal Notes
          </label>
          <textarea
            rows={3}
            placeholder="Optional onboarding or compliance notes..."
            {...register('notes')}
            className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-white placeholder-muted-foreground transition-colors focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border bg-surface px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-500 text-white transition-colors hover:bg-primary/90 disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : null}
            {isSubmitting ? 'Creating...' : 'Create Account'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
