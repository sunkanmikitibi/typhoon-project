import React from 'react';
import AppLayout from '@/components/AppLayout';
import DashboardHeader from './components/DashboardHeader';
import MetricsBentoGrid from './components/MetricsBentoGrid';
import DashboardCharts from './components/DashboardCharts';
import RecentTransactionsTable from './components/RecentTransactionsTable';
import AlertFeed from './components/AlertFeed';

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto space-y-6">
        <DashboardHeader />
        <MetricsBentoGrid />
        <DashboardCharts />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <RecentTransactionsTable />
          </div>
          <div className="xl:col-span-1">
            <AlertFeed />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
