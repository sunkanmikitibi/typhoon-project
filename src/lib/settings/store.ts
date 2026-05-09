import { supabase } from '@/lib/supabase/client';
import type { SettingsState } from './types';

export async function getSettings(): Promise<SettingsState> {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .single();

  if (error) {
    console.error('Error fetching settings:', error);
    throw new Error('Failed to fetch settings');
  }

  return {
    requireDualApproval: data.require_dual_approval,
    enableHighRiskBlock: data.enable_high_risk_block,
    sendFraudAlerts: data.send_fraud_alerts,
    dailyTransferLimit: data.daily_transfer_limit,
    autoFreezeThreshold: data.auto_freeze_threshold,
    defaultSettlementRail: data.default_settlement_rail,
  };
}

export async function updateSettings(settings: SettingsState): Promise<SettingsState> {
  const { data, error } = await supabase
    .from('settings')
    .update({
      require_dual_approval: settings.requireDualApproval,
      enable_high_risk_block: settings.enableHighRiskBlock,
      send_fraud_alerts: settings.sendFraudAlerts,
      daily_transfer_limit: settings.dailyTransferLimit,
      auto_freeze_threshold: settings.autoFreezeThreshold,
      default_settlement_rail: settings.defaultSettlementRail,
      updated_at: new Date().toISOString(),
    })
    .eq('id', '00000000-0000-0000-0000-000000000000') // Use a fixed ID for single settings row
    .select()
    .single();

  if (error) {
    console.error('Error updating settings:', error);
    throw new Error('Failed to update settings');
  }

  return {
    requireDualApproval: data.require_dual_approval,
    enableHighRiskBlock: data.enable_high_risk_block,
    sendFraudAlerts: data.send_fraud_alerts,
    dailyTransferLimit: data.daily_transfer_limit,
    autoFreezeThreshold: data.auto_freeze_threshold,
    defaultSettlementRail: data.default_settlement_rail,
  };
}
