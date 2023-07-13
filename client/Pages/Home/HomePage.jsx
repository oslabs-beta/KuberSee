import React from 'react';
import LogDashboard from '../../Components/Dashboard/LogDashboard.jsx';
import MetricsDashboard from '../../Components/Dashboard/MetricsDashboard.jsx';
import Stats from '../../Components/TotalStats/Stats.jsx';
import ChartTestTwo from '../../Components/LineChart/ChartTestTwo.jsx';
import Dashboard from '../../Components/Dashboard/Dashboard.jsx';
import { useState } from 'react';

export default function HomePage() {
  const [stats, setStats] = useState([
    { id: 1, name: 'Namespace', value: 0 },
    { id: 2, name: 'Nodes', value: 0 },
    { id: 3, name: 'Pods', value: 0 },
  ]);
  return (
    <div>
      <ChartTestTwo changeStats={setStats} />
      <Dashboard stats={stats} />
      <LogDashboard />
    </div>
  );
}
