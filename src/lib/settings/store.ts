import type { SettingsState } from './types';

let settingsStore: SettingsState = {
  requireDualApproval: true,
  enableHighRiskBlock: true,
  sendFraudAlerts: true,
  dailyTransferLimit: '500000',
  autoFreezeThreshold: '90',
  defaultSettlementRail: 'ACH',
};

export function getSettings(): SettingsState {
  return settingsStore;
}

export function updateSettings(next: SettingsState): SettingsState {
  settingsStore = next;
  return settingsStore;
}
