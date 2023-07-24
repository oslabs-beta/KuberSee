import React, { useState, useEffect, useRef } from 'react';
import LogDashboard from '../../Components/Dashboard/LogDashboard.jsx';
import Dashboard from '../../Components/Dashboard/Dashboard.jsx';
import LineGraph from '../../Components/LineChart/LineGraph.jsx';
import DropdownMenu from '../../Components/Dropdown/DropdownButton.jsx';
import * as d3 from 'd3';
import DropdownPods from '../../Components/Dropdown/DropdownPods.jsx';

export default function HomePage({ socket }) {
  const [stats, setStats] = useState([
    { id: 1, name: 'Namespaces', value: 0 },
    { id: 2, name: 'Nodes', value: 0 },
    { id: 3, name: 'Pods', value: 0 },
  ]);

  const [currentPod, setCurrentPod] = useState('');
  const [currentNamespace, setCurrentNamespace] = useState('default');
  const namespacesRef = useRef([]);
  const dataRef = useRef([]);
  const dataRefMem = useRef([]);
  const podRef = useRef([]);
  const nodeCPURef = useRef([]);
  const nodeCPUPercentRef = useRef([]);
  const nodeMemRef = useRef([]);
  const nodeMemPercentRef = useRef([])
  const [log, setLog] = useState([{ id: 1, header: '', message: '' }]);

  useEffect(() => {
    socket.emit('metrics', {
      namespace: currentNamespace
    });
  }, [currentNamespace]);

  useEffect(() => {
    const fetchlogs = () => {
      if (currentPod != '') {
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
    const strictIsoParse = d3.utcParse('%Y-%m-%dT%H:%M:%S.%LZ'); // need to use d3's isoParse: https://github.com/d3/d3-time-format

    socket.on('metrics', (metrics) => {
      console.log(metrics);
      const nodes = metrics.topNodes.map((el) => {
        return {
          name: el.node,
          cpuCurrentUsage: el.cpuCurrentUsage,
          cpuTotal: el.cpuTotal,
          cpuPercentage: el.cpuCurrentUsage / el.cpuTotal,
          memoryCurrentUsage: el.memoryCurrentUsage,
          memoryTotal: el.memoryTotal,
          memoryPercentage: el.memoryCurrentUsage / el.memoryTotal,
          timestamp: strictIsoParse(new Date().toISOString()),
        }
      })
      const pods = metrics.topPods.map((el) => {
        return {
          name: el.pod,
          cpuCurrentUsage: el.cpuCurrentUsage,
          // memoryCurrentUsage: el.memoryCurrentUsage,
          timestamp: strictIsoParse(new Date().toISOString()),
        };
      });
      const mapArrayMem = metrics.topPods.map((el) => {
        return {
          name: el.pod,
          // cpuCurrentUsage: el.cpuCurrentUsage,
          memoryCurrentUsage: el.memoryCurrentUsage,
          timestamp: strictIsoParse(new Date().toISOString()),
        };
      });
      dataRef.current.push(...pods);
      dataRefMem.current.push(...mapArrayMem);
      nodeCPURef.current.push(...nodes);
      nodeCPUPercentRef.current.push(...nodes);
      nodeMemRef.current.push(...nodes);
      nodeMemPercentRef.current.push(...nodes);
      const newPods = metrics.topPods.map((el) => el.pod);
      if (podRef.current !== newPods) {
        podRef.current = [...newPods];
      }
    });
  }, [socket]);

  useEffect(() => {
    socket.on('stats', (stats) => {
      console.log(stats)
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

  useEffect(() => {
    //empty data from chart for pods in last namespace
    dataRef.current = [];
    dataRefMem.current = [];
    nodeCPURef.current = [];
    nodeCPUPercentRef.current = [];
    nodeMemRef.current = [];
    nodeMemPercentRef.current = [];
    //empty log data from last namespace
    setLog([{ id: 1, header: '', message: '' }]);
  }, [currentNamespace]);

  return (
    <>
      <Dashboard stats={stats} />
      <DropdownMenu
        changeNamespace={setCurrentNamespace}
        namespaces={namespacesRef.current}
      />
      <h2>Pod CPU Usage</h2>
      <LineGraph dataRef={dataRef} yaxis='CPU (Cores)' propertyName='cpuCurrentUsage' legendName='Pod Names Legend' />
      <h2>Pod Memory Usage</h2>
      <LineGraph dataRef={dataRefMem} yaxis={'Memory (Bytes)'} propertyName='memoryCurrentUsage' legendName='Pod Names Legend' />
      <h2>Node CPU Usage</h2>
      <LineGraph dataRef={nodeCPURef} yaxis='CPU (Cores)' propertyName='cpuCurrentUsage' legendName='Node Names Legend' />
      <h2>Node CPU % Over Total</h2>
      <LineGraph dataRef={nodeCPUPercentRef} yaxis={'CPU Usage (%)'} propertyName='cpuPercentage' legendName='Node Names Legend' />
      <h2>Node Memory Usage</h2>
      <LineGraph dataRef={nodeMemRef} yaxis={'Memory (Bytes)'} propertyName='memoryCurrentUsage' legendName='Node Names Legend' />
      <h2>Node Memory % Over Total</h2>
      <LineGraph dataRef={nodeMemPercentRef} yaxis={'Memory Usage (%)'} propertyName='memoryPercentage' legendName='Node Names Legend' />
      <DropdownPods changePods={setCurrentPod} pods={podRef.current} />
      <LogDashboard log={log} />
    </>
  );
}
