import React, { useState, useEffect, useRef } from 'react';
import LogDashboard from '../../Components/Dashboard/LogDashboard.jsx';
import Dashboard from '../../Components/Dashboard/Dashboard.jsx';
import CPULineChart from '../../Components/LineChart/CPULineChart.jsx';
import DropdownMenu from '../../Components/Dropdown/DropdownButton.jsx';
import * as d3 from 'd3';
import MemoryLineChart from '../../Components/LineChart/MemoryLineChart.jsx';

export default function HomePage() {
  const [stats, setStats] = useState([
    { id: 1, name: 'Namespaces', value: 0 },
    { id: 2, name: 'Nodes', value: 0 },
    { id: 3, name: 'Pods', value: 0 },
  ]);
  const [currentNamespace, setCurrentNamespace] = useState('default')
  const namespacesRef = useRef([]);
  const dataRef = useRef([]); // possible solution: create a ref that will not re-render across components

  useEffect(() => {
    const strictIsoParse = d3.utcParse('%Y-%m-%dT%H:%M:%S.%LZ'); // need to use d3's isoParse: https://github.com/d3/d3-time-format
    const updateIntervalMs = 1000;
    const intervalID = setInterval(async function () {

      try {
        console.log(currentNamespace);
        const res1 = await fetch(`/api/metrics/${currentNamespace}`);
        const metrics = await res1.json();
        const res2 = await fetch('/api/stats');
        const stats = await res2.json();

        setStats([
          { id: 1, name: 'Namespaces', value: stats.totalNamespaces },
          { id: 2, name: 'Nodes', value: stats.totalNodes },
          { id: 3, name: 'Pods', value: stats.totalPods },
        ]);

        const mapArray = metrics.topPods.map((el) => {
          return {
            podName: el.pod,
            cpuCurrentUsage: el.cpuCurrentUsage,
            memoryCurrentUsage: el.memoryCurrentUsage,
            timestamp: strictIsoParse(new Date().toISOString()),
          };
        });
  
        const newNamespaces = [...stats.namespaces];
        // Update namespacesRef.current only if there are new namespaces
        if (
          JSON.stringify(namespacesRef.current) !== JSON.stringify(newNamespaces)
        ) {
          namespacesRef.current = [...newNamespaces];
        }
        
        dataRef.current.push(...mapArray);

      } catch (error) {
        console.log(error);
      }

    }, updateIntervalMs);

    return () => {
      clearInterval(intervalID); // once the component is removed, it will perform a clean up. Don't want the setInterval to run in the background even if the component is running in the background.
    };
  }, [currentNamespace]);
  return (
    <>
      <Dashboard stats={stats} />
      <DropdownMenu changeNamespace={setCurrentNamespace} namespaces={namespacesRef.current} />
      <h2>CPU</h2>
      <CPULineChart dataRef={dataRef} />
      <h2>Memory</h2>
      <MemoryLineChart dataRef={dataRef} />
      <LogDashboard />
    </>
  );
}
