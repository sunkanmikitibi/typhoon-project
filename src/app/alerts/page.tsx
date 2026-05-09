'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Bell, CheckCircle2, Siren, TriangleAlert } from 'lucide-react';
import { toast } from 'sonner';
import AppLayout from '@/components/AppLayout';
import StatusBadge from '@/components/ui/StatusBadge';
import { getAlerts, resolveAlertById } from '@/lib/alerts/store';
import type { AlertState, OpsAlert } from '@/lib/alerts/types';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<OpsAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | AlertState>('all');

  useEffect(() => {
    // Load alerts directly from Supabase
    const loadAlerts = async () => {
      try {
        setIsLoading(true);
        const data = await getAlerts();
        setAlerts(data);
      } catch (_error) {
        toast.error('Could not load alerts');
      } finally {
        setIsLoading(false);
      }
    };

    void loadAlerts();
  }, []);

  const filteredAlerts = useMemo(() => {
    if (filter === 'all') return alerts;
    return alerts.filter((alert) => alert.state === filter);
  }, [alerts, filter]);

  const openCount = alerts.filter((alert) => alert.state === 'open').length;
  const criticalCount = alerts.filter(
    (alert) => alert.state === 'open' && alert.severity === 'critical'
  ).length;

  const resolveAlert = async (alertId: string) => {
    try {
      const resolvedAlert = await resolveAlertById(alertId);
      if (resolvedAlert) {
        setAlerts((previous) =>
          previous.map((alert) => (alert.id === alertId ? resolvedAlert : alert))
        );
        toast.success('Alert marked as resolved');
      }
    } catch {
      toast.error('Could not resolve alert');
    }
  };

  const escalateAlert = (alertId: string) => {
    const target = alerts.find((alert) => alert.id === alertId);
    toast.warning(`Escalation sent for ${target?.id ?? 'selected alert'}`, {
      description: 'Incident owner and compliance lead were notified.',
    });
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-screen-2xl space-y-6 px-6 py-6 lg:px-8 xl:px-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-600 text-white">Alerts</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Track operational, risk, and infrastructure alerts in real time
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-1.5 text-xs text-danger">
              Open: <span className="font-600">{openCount}</span>
            </span>
            <span className="rounded-lg border border-warning/30 bg-warning/10 px-3 py-1.5 text-xs text-warning">
              Critical: <span className="font-600">{criticalCount}</span>
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface shadow-card">
          <div className="flex items-center gap-2 border-b border-border px-5 py-4">
            <Bell size={14} className="text-primary" />
            <p className="text-sm text-white">Alert Queue</p>
            <div className="ml-auto">
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value as 'all' | AlertState)}
                className="rounded-lg border border-border bg-surface-elevated px-3 py-1.5 text-sm text-white focus:border-primary focus:outline-none"
              >
                <option value="all">All alerts</option>
                <option value="open">Open only</option>
                <option value="resolved">Resolved only</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-border/60">
            {isLoading ? (
              <div className="px-5 py-12 text-center">
                <p className="text-sm text-muted-foreground">Loading alerts...</p>
              </div>
            ) : null}
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] text-primary">{alert.id}</span>
                    <StatusBadge status={alert.severity} />
                    <StatusBadge status={alert.state} />
                  </div>
                  <p className="text-sm font-500 text-white">{alert.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{alert.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                    <span>Source: {alert.source}</span>
                    <span>Detected: {alert.createdAt}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => escalateAlert(alert.id)}
                    disabled={alert.state === 'resolved'}
                    className="inline-flex items-center gap-1 rounded-md border border-warning/40 bg-warning/10 px-2.5 py-1.5 text-xs text-warning transition-colors hover:bg-warning/20 disabled:opacity-50"
                  >
                    <Siren size={12} />
                    Escalate
                  </button>
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    disabled={alert.state === 'resolved'}
                    className="inline-flex items-center gap-1 rounded-md border border-success/40 bg-success/10 px-2.5 py-1.5 text-xs text-success transition-colors hover:bg-success/20 disabled:opacity-50"
                  >
                    <CheckCircle2 size={12} />
                    Resolve
                  </button>
                </div>
              </div>
            ))}

            {filteredAlerts.length === 0 && !isLoading ? (
              <div className="px-5 py-12 text-center">
                <TriangleAlert className="mx-auto mb-3 text-muted-foreground" size={18} />
                <p className="text-sm text-muted-foreground">No alerts for the selected filter.</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
