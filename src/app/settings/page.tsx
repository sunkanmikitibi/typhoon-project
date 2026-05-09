'use client';

import React, { useEffect, useState } from 'react';
import { Save, Shield, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import AppLayout from '@/components/AppLayout';
import { getSettings, updateSettings } from '@/lib/settings/store';
import type { SettingsState } from '@/lib/settings/types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>({
    requireDualApproval: true,
    enableHighRiskBlock: true,
    sendFraudAlerts: true,
    dailyTransferLimit: '500000',
    autoFreezeThreshold: '90',
    defaultSettlementRail: 'ACH',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load settings directly from Supabase
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const data = await getSettings();
        setSettings(data);
      } catch (_error) {
        toast.error('Could not load settings');
      } finally {
        setIsLoading(false);
      }
    };

    void loadSettings();
  }, []);

  const saveSettings = async () => {
    try {
      await updateSettings(settings);
      toast.success('Settings saved', {
        description: 'Operational controls have been updated.',
      });
    } catch {
      toast.error('Could not save settings');
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-screen-2xl px-6 py-10 text-sm text-muted-foreground lg:px-8 xl:px-10">
          Loading settings...
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-screen-2xl space-y-6 px-6 py-6 lg:px-8 xl:px-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-600 text-white">Settings</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Configure risk controls and operational defaults for the platform
            </p>
          </div>
          <button
            onClick={saveSettings}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-500 text-white transition-colors hover:bg-primary/90"
          >
            <Save size={14} />
            Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <section className="rounded-lg border border-border bg-surface p-5 shadow-card">
            <div className="mb-4 flex items-center gap-2">
              <Shield size={15} className="text-primary" />
              <h2 className="text-sm font-600 text-white">Risk Controls</h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between rounded-lg border border-border bg-surface-elevated px-3 py-2">
                <span className="text-sm text-white">
                  Require dual approval for large transfers
                </span>
                <input
                  type="checkbox"
                  checked={settings.requireDualApproval}
                  onChange={(event) =>
                    setSettings((prev) => ({
                      ...prev,
                      requireDualApproval: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-primary"
                />
              </label>

              <label className="flex items-center justify-between rounded-lg border border-border bg-surface-elevated px-3 py-2">
                <span className="text-sm text-white">
                  Auto-block transfers above risk threshold
                </span>
                <input
                  type="checkbox"
                  checked={settings.enableHighRiskBlock}
                  onChange={(event) =>
                    setSettings((prev) => ({
                      ...prev,
                      enableHighRiskBlock: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-primary"
                />
              </label>

              <label className="flex items-center justify-between rounded-lg border border-border bg-surface-elevated px-3 py-2">
                <span className="text-sm text-white">Send fraud alerts to operations channels</span>
                <input
                  type="checkbox"
                  checked={settings.sendFraudAlerts}
                  onChange={(event) =>
                    setSettings((prev) => ({
                      ...prev,
                      sendFraudAlerts: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-primary"
                />
              </label>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-surface p-5 shadow-card">
            <div className="mb-4 flex items-center gap-2">
              <SlidersHorizontal size={15} className="text-primary" />
              <h2 className="text-sm font-600 text-white">Operational Defaults</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[12px] uppercase tracking-widest text-muted-foreground">
                  Daily Transfer Limit (USD)
                </label>
                <input
                  type="number"
                  value={settings.dailyTransferLimit}
                  onChange={(event) =>
                    setSettings((prev) => ({ ...prev, dailyTransferLimit: event.target.value }))
                  }
                  className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[12px] uppercase tracking-widest text-muted-foreground">
                  Auto-Freeze Threshold (Risk Score)
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={settings.autoFreezeThreshold}
                  onChange={(event) =>
                    setSettings((prev) => ({
                      ...prev,
                      autoFreezeThreshold: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[12px] uppercase tracking-widest text-muted-foreground">
                  Default Settlement Rail
                </label>
                <select
                  value={settings.defaultSettlementRail}
                  onChange={(event) =>
                    setSettings((prev) => ({
                      ...prev,
                      defaultSettlementRail: event.target.value as 'ACH' | 'SWIFT' | 'Wire',
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                >
                  <option value="ACH">ACH</option>
                  <option value="SWIFT">SWIFT</option>
                  <option value="Wire">Wire</option>
                </select>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
