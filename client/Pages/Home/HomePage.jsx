import React, { useState, useEffect, useRef } from 'react';
import LogDashboard from '../../Components/Dashboard/LogDashboard.jsx';
import Dashboard from '../../Components/Dashboard/Dashboard.jsx';
import CPULineChart from '../../Components/LineChart/CPULineChart.jsx';
import DropdownMenu from '../../Components/Dropdown/DropdownButton.jsx';
import * as d3 from 'd3';
import MemoryLineChart from '../../Components/LineChart/MemoryLineChart.jsx';
import DropdownPods from '../../Components/Dropdown/DropdownPods.jsx';

export default function HomePage() {
  const [stats, setStats] = useState([
    { id: 1, name: 'Namespaces', value: 0 },
    { id: 2, name: 'Nodes', value: 0 },
    { id: 3, name: 'Pods', value: 0 },
  ]);
  //setting state for current pod
  const [currentPod, setCurrentPod] = useState('');
  const [currentNamespace, setCurrentNamespace] = useState('default');
  const namespacesRef = useRef([]);
  const dataRef = useRef([]);
  const podRef = useRef([]);
  const [log, setLog] = useState([{ id: 1, header: '', message: '' }]);
  // possible solution: create a ref that will not re-render across components

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

        const newPods = metrics.topPods.map((el) => el.pod);
        if (podRef.current !== newPods) {
          podRef.current = [...newPods];
        }

        const newNamespaces = [...stats.namespaces];
        // Update namespacesRef.current only if there are new namespaces
        if (
          JSON.stringify(namespacesRef.current) !==
          JSON.stringify(newNamespaces)
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
  useEffect(() => {
    console.log('WE ARE IN USE EFFECT');
    const fetchlogs = () => {
      if (currentPod != '') {
        // console.log("fetching logs");
        fetch(`/api/logs/${currentNamespace}/${currentPod}`)
          .then((data) => data.json())
          .then((res) => {
            setLog(res);
          })
          .catch((err) => console.log(err));
      }
    };
    fetchlogs();
  }, [currentPod]);
  useEffect(() => {
    dataRef.current = [];
    // console.log('USE EFFECT', dataRef);
  }, [currentNamespace]);
  return (
    <>
      <Dashboard stats={stats} />
      <DropdownMenu
        changeNamespace={setCurrentNamespace}
        namespaces={namespacesRef.current}
      />
      <h2>CPU</h2>
      <CPULineChart dataRef={dataRef} />
      <h2>Memory</h2>
      <MemoryLineChart dataRef={dataRef} />
      <DropdownPods changePods={setCurrentPod} pods={podRef.current} />
      <LogDashboard log={log} />
    </>
  );
}
