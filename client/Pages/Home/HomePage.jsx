import React, { useState, useEffect, useRef } from 'react';
import LogDashboard from '../../Components/Dashboard/LogDashboard.jsx';
import Dashboard from '../../Components/Dashboard/Dashboard.jsx';
import CPULineChart from '../../Components/LineChart/CPULineChart.jsx';
import * as d3 from 'd3';

export default function HomePage() {
  const [stats, setStats] = useState([
    { id: 1, name: 'Namespaces', value: 0 },
    { id: 2, name: 'Nodes', value: 0 },
    { id: 3, name: 'Pods', value: 0 },
  ]);
  const dataRef = useRef([]); // possible solution: create a ref that will not re-render across components 
  useEffect(() => {
    const strictIsoParse = d3.utcParse('%Y-%m-%dT%H:%M:%S.%LZ'); // need to use d3's isoParse: https://github.com/d3/d3-time-format
    const updateIntervalMs = 1000;
    const intervalID = setInterval(async function () {
      const response = await fetch('/api/metrics');
      const metrics = await response.json();
      setStats([
        { id: 1, name: 'Namespaces', value: metrics.namespace.length },
        { id: 2, name: 'Nodes', value: metrics.topNodes.length },
        { id: 3, name: 'Pods', value: metrics.totalPods },
      ]);
      const mapArray = metrics.topPods.map((el) => {
        return {
          podName: el.pod,
          cpuCurrentUsage: el.cpuCurrentUsage,
          timestamp: strictIsoParse(new Date().toISOString()),
        };
      });
      // setData((data) => [...data, ...mapArray]); // join data and mapArray to preserve original. 
      dataRef.current.push(...mapArray);
    }, updateIntervalMs);
    return () => {
      clearInterval(intervalID); // once the component is removed, it will perform a clean up. Don't want the setInterval to run in the background even if the component is running in the background.
    };
  }, []);
  return (
    <div>
      <CPULineChart dataRef={dataRef} />
      <Dashboard stats={stats} />
      <LogDashboard />
    </div>
  );
}
