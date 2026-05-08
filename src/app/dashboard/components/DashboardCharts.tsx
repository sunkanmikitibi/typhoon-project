import React from 'react';
import TxVolumeChart from './TxVolumeChart';
import ErrorRateChart from './ErrorRateChart';

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
      <div className="xl:col-span-3">
        <TxVolumeChart />
      </div>
      <div className="xl:col-span-2">
        <ErrorRateChart />
      </div>
    </div>
  );
}
