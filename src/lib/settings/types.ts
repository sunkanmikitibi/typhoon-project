export type SettlementRail = 'ACH' | 'SWIFT' | 'Wire';

export interface SettingsState {
  requireDualApproval: boolean;
  enableHighRiskBlock: boolean;
  sendFraudAlerts: boolean;
  dailyTransferLimit: string;
  autoFreezeThreshold: string;
  defaultSettlementRail: SettlementRail;
}
