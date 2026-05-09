import { supabase } from '@/lib/supabase/client';
import type { Transfer } from './types';

export async function getTransfers(): Promise<Transfer[]> {
  const { data, error } = await supabase
    .from('transfers')
    .select('*')
    .order('initiated_at', { ascending: false });

  if (error) {
    console.error('Error fetching transfers:', error);
    throw new Error('Failed to fetch transfers');
  }

  return data.map(transfer => ({
    id: transfer.id,
    sender: transfer.sender,
    senderAccount: transfer.sender_account,
    receiver: transfer.receiver,
    receiverAccount: transfer.receiver_account,
    amount: Number(transfer.amount),
    fee: Number(transfer.fee),
    currency: transfer.currency,
    method: transfer.method,
    status: transfer.status,
    risk: Number(transfer.risk),
    initiatedBy: transfer.initiated_by,
    initiatedAt: transfer.initiated_at,
    settledAt: transfer.settled_at,
  }));
}

export async function createTransfer(transfer: Omit<Transfer, 'id' | 'initiatedAt'>): Promise<Transfer> {
  const { data, error } = await supabase
    .from('transfers')
    .insert({
      sender: transfer.sender,
      sender_account: transfer.senderAccount,
      receiver: transfer.receiver,
      receiver_account: transfer.receiverAccount,
      amount: transfer.amount,
      fee: transfer.fee,
      currency: transfer.currency,
      method: transfer.method,
      status: transfer.status,
      risk: transfer.risk,
      initiated_by: transfer.initiatedBy,
      settled_at: transfer.settledAt,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating transfer:', error);
    throw new Error('Failed to create transfer');
  }

  return {
    id: data.id,
    sender: data.sender,
    senderAccount: data.sender_account,
    receiver: data.receiver,
    receiverAccount: data.receiver_account,
    amount: Number(data.amount),
    fee: Number(data.fee),
    currency: data.currency,
    method: data.method,
    status: data.status,
    risk: Number(data.risk),
    initiatedBy: data.initiated_by,
    initiatedAt: data.initiated_at,
    settledAt: data.settled_at,
  };
}

export async function updateTransferStatus(transferId: string, status: Transfer['status']): Promise<Transfer | null> {
  const updateData: any = { status };
  if (status === 'completed') {
    updateData.settled_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('transfers')
    .update(updateData)
    .eq('id', transferId)
    .select()
    .single();

  if (error) {
    console.error('Error updating transfer:', error);
    throw new Error('Failed to update transfer');
  }

  if (!data) return null;

  return {
    id: data.id,
    sender: data.sender,
    senderAccount: data.sender_account,
    receiver: data.receiver,
    receiverAccount: data.receiver_account,
    amount: Number(data.amount),
    fee: Number(data.fee),
    currency: data.currency,
    method: data.method,
    status: data.status,
    risk: Number(data.risk),
    initiatedBy: data.initiated_by,
    initiatedAt: data.initiated_at,
    settledAt: data.settled_at,
  };
}