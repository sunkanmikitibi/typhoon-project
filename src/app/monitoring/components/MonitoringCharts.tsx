import React from 'react';
import TxThroughputChart from './TxThroughputChart';
import FraudRateChart from './FraudRateChart';

export default function MonitoringCharts() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <TxThroughputChart />
      <FraudRateChart />
    </div>
  );
}
