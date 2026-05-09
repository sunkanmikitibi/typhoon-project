import { supabase } from '@/lib/supabase/client';
import type { OpsAlert } from './types';

export async function getAlerts(): Promise<OpsAlert[]> {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching alerts:', error);
    throw new Error('Failed to fetch alerts');
  }

  return data.map(alert => ({
    id: alert.id,
    title: alert.title,
    description: alert.description,
    source: alert.source,
    createdAt: alert.created_at,
    severity: alert.severity,
    state: alert.state,
  }));
}

export async function resolveAlertById(alertId: string): Promise<OpsAlert | null> {
  const { data, error } = await supabase
    .from('alerts')
    .update({ state: 'resolved' })
    .eq('id', alertId)
    .select()
    .single();

  if (error) {
    console.error('Error resolving alert:', error);
    throw new Error('Failed to resolve alert');
  }

  if (!data) return null;

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    source: data.source,
    createdAt: data.created_at,
    severity: data.severity,
    state: data.state,
  };
}

export async function createAlert(alert: Omit<OpsAlert, 'id' | 'createdAt'>): Promise<OpsAlert> {
  const { data, error } = await supabase
    .from('alerts')
    .insert({
      title: alert.title,
      description: alert.description,
      source: alert.source,
      severity: alert.severity,
      state: alert.state,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating alert:', error);
    throw new Error('Failed to create alert');
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    source: data.source,
    createdAt: data.created_at,
    severity: data.severity,
    state: data.state,
  };
}
