import type { OpsAlert } from './types';

let alertsStore: OpsAlert[] = [
  {
    id: 'alt-9012',
    title: 'Spike in high-risk transfer attempts',
    description: 'Risk engine flagged 13 transfers above 85 risk score in the last 10 minutes.',
    source: 'Fraud Monitor',
    createdAt: '04/29 14:58',
    severity: 'critical',
    state: 'open',
  },
  {
    id: 'alt-9011',
    title: 'ACH settlement latency increased',
    description: 'Average processing latency exceeded 2.5x baseline for ACH transfers.',
    source: 'Rail Health',
    createdAt: '04/29 14:42',
    severity: 'high',
    state: 'open',
  },
  {
    id: 'alt-9010',
    title: 'Manual review queue threshold reached',
    description: 'Pending review queue has reached 40 items and may delay approvals.',
    source: 'Operations',
    createdAt: '04/29 14:17',
    severity: 'medium',
    state: 'open',
  },
  {
    id: 'alt-9009',
    title: 'Notification webhook retry recovered',
    description: 'Downstream notifications recovered after transient endpoint timeout.',
    source: 'Platform',
    createdAt: '04/29 13:53',
    severity: 'low',
    state: 'resolved',
  },
];

export function getAlerts(): OpsAlert[] {
  return alertsStore;
}

export function resolveAlertById(alertId: string): OpsAlert | null {
  let updatedAlert: OpsAlert | null = null;
  alertsStore = alertsStore.map((alert) => {
    if (alert.id !== alertId) return alert;
    updatedAlert = { ...alert, state: 'resolved' };
    return updatedAlert;
  });
  return updatedAlert;
}
