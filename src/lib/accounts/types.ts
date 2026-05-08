export type AccountType = 'individual' | 'business';
export type AccountStatus = 'active' | 'pending_review' | 'frozen' | 'closed';
export type RiskTier = 'low' | 'medium' | 'high';

export interface Account {
  accountId: string;
  holderName: string;
  email: string;
  accountType: AccountType;
  status: AccountStatus;
  country: string;
  currency: string;
  availableBalance: number;
  riskTier: RiskTier;
  createdAt: string;
  notes?: string;
}

export interface CreateAccountInput {
  accountType: AccountType;
  holderName: string;
  email: string;
  country: string;
  currency: string;
  status: Exclude<AccountStatus, 'frozen' | 'closed'>;
  riskTier: RiskTier;
  notes?: string;
}
