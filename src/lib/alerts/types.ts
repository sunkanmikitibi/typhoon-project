export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
export type AlertState = 'open' | 'resolved';

export interface OpsAlert {
  id: string;
  title: string;
  description: string;
  source: string;
  createdAt: string;
  severity: AlertSeverity;
  state: AlertState;
}
