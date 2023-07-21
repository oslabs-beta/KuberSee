import React, { useState, useEffect, useRef } from 'react';
import LogDashboard from '../../Components/Dashboard/LogDashboard.jsx';
import Dashboard from '../../Components/Dashboard/Dashboard.jsx';
import CPULineChart from '../../Components/LineChart/CPULineChart.jsx';
import DropdownMenu from '../../Components/Dropdown/DropdownButton.jsx';
import * as d3 from 'd3';
import MemoryLineChart from '../../Components/LineChart/MemoryLineChart.jsx';

export default function HomePage({ socket }) {
  const [stats, setStats] = useState([
    { id: 1, name: 'Namespaces', value: 0 },
    { id: 2, name: 'Nodes', value: 0 },
    { id: 3, name: 'Pods', value: 0 },
  ]);

  const [currentNamespace, setCurrentNamespace] = useState('default')
  const namespacesRef = useRef([]);
  const dataRef = useRef([]); // possible solution: create a ref that will not re-render across components

  useEffect(() => { 
    socket.emit('metrics', {
      namespace: currentNamespace
    });
  }, [currentNamespace])

  useEffect(() => {
    dataRef.current = [];
    console.log('USE EFFECT', dataRef);
  }, [currentNamespace]);

  useEffect(() => {
    const strictIsoParse = d3.utcParse('%Y-%m-%dT%H:%M:%S.%LZ'); // need to use d3's isoParse: https://github.com/d3/d3-time-format

    socket.on('metrics', (metrics) => {
      const pods = metrics.topPods.map((el) => {
        return {
          podName: el.pod,
          cpuCurrentUsage: el.cpuCurrentUsage,
          memoryCurrentUsage: el.memoryCurrentUsage,
          timestamp: strictIsoParse(new Date().toISOString()),
        };
      });
      dataRef.current.push(...pods);
      
    });
  }, [socket]);

  useEffect(() => {
    socket.on('stats', (stats) => {
      setStats([
        { id: 1, name: 'Namespaces', value: stats.totalNamespaces },
        { id: 2, name: 'Nodes', value: stats.totalNodes },
        { id: 3, name: 'Pods', value: stats.totalPods },
      ]);

      const newNamespaces = stats.namespaces;
      // Update namespacesRef.current only if there are new namespaces
      if (
        JSON.stringify(namespacesRef.current) !== JSON.stringify(newNamespaces)
      ) {
        namespacesRef.current = [...newNamespaces];
      }
    });
  }, [socket]);

  return (
    <>
      <Dashboard stats={stats} />
      <DropdownMenu changeNamespace={setCurrentNamespace} namespaces={namespacesRef.current} />
      <h2>CPU</h2>
      <CPULineChart dataRef={dataRef} socket={socket} />
      <h2>Memory</h2>
      <MemoryLineChart dataRef={dataRef} socket={socket} />
      <LogDashboard />
    </>
  );
}
