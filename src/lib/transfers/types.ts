export type TransferStatus =
  | 'completed'
  | 'pending'
  | 'pending_review'
  | 'processing'
  | 'failed'
  | 'reversed';

export interface Transfer {
  id: string;
  sender: string;
  senderAccount: string;
  receiver: string;
  receiverAccount: string;
  amount: number;
  fee: number;
  currency: string;
  method: string;
  status: TransferStatus;
  risk: number;
  initiatedBy: string;
  initiatedAt: string;
  settledAt: string | null;
}
