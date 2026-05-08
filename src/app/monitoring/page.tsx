import React from 'react';
import AppLayout from '@/components/AppLayout';
import MonitoringHeader from './components/MonitoringHeader';
import SystemHealthCards from './components/SystemHealthCards';
import MonitoringCharts from './components/MonitoringCharts';
import FraudEventsTable from './components/FraudEventsTable';

export default function MonitoringPage() {
  return (
    <AppLayout>
      <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto space-y-6">
        <MonitoringHeader />
        <SystemHealthCards />
        <MonitoringCharts />
        <FraudEventsTable />
      </div>
    </AppLayout>
  );
}
