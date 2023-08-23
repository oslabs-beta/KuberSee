import React, { useState, useEffect, useRef } from 'react';
import LogsDashboard from '../../Components/Dashboard/LogsDashboard.jsx';
import Dashboard from '../../Components/Dashboard/Dashboard';
import LineGraph from '../../Components/LineGraph/LineGraph.jsx';
import DropdownMenu from '../../Components/Dropdown/DropdownButton.jsx';
import * as d3 from 'd3';
import DropdownPods from '../../Components/Dropdown/DropdownPods.jsx';
import { Socket } from 'socket.io-client';
import {StatsDataProps, StatsData, LogsData} from '../../types'


type HomePageProps = {
  socket: Socket;
}

type NodeMetrics = {
  node: String;
  cpuCurrentUsage: number;
  cpuTotal: number ;
  memoryCurrentUsage: number;
  memoryTotal: number ;
}

type PodMetrics = {
  pod: String;
  cpuCurrentUsage: number;
  memoryCurrentUsage: number;
}

const initialStats: StatsData[] = [
  { id: "1", name: 'Namespaces', value: 0 },
  { id: "2", name: 'Nodes', value: 0 },
  { id: "3", name: 'Pods', value: 0 },
];

const initialNamespaces: String[] = [];

const initialLogs: LogsData[] = [{ id: '1', header: '', message: '' }];

export default function HomePage({ socket }: HomePageProps) {
  const [stats, setStats] = useState(initialStats);

  const [currentPod, setCurrentPod] = useState('');
  const [currentNamespace, setCurrentNamespace] = useState('default');
  const namespacesRef = useRef(initialNamespaces);
  const podRef = useRef([]);
  const podNamesRef = useRef([]);
  const nodeRef = useRef([]);
  const [logs, setLogs] = useState(initialLogs);

  useEffect(() => {
    socket.emit('metrics', {
      namespace: currentNamespace
    });
  }, [currentNamespace]);

  useEffect(() => {
    if (currentPod !== '') {
      socket.emit('logs', {
        namespace: currentNamespace,
        podname: currentPod,
      })
    }
  }, [currentPod]);

  useEffect(() => {
    socket.on('logs', (log) => {
      setLogs(log);
    })
  }, [currentPod]);

  useEffect(() => {
    const strictIsoParse = d3.utcParse('%Y-%m-%dT%H:%M:%S.%LZ'); // need to use d3's isoParse: https://github.com/d3/d3-time-format

    socket.on('metrics', (metrics) => {
      console.log(metrics);
      const nodes = metrics.topNodes.map((el: NodeMetrics) => {
        return {
          name: el.node,
          cpuCurrentUsage: el.cpuCurrentUsage,
          cpuTotal: el.cpuTotal,
          cpuPercentage: (el.cpuCurrentUsage / el.cpuTotal),
          memoryCurrentUsage: el.memoryCurrentUsage,
          memoryTotal: el.memoryTotal,
          memoryPercentage: (el.memoryCurrentUsage / el.memoryTotal),
          timestamp: strictIsoParse(new Date().toISOString()),
        }
      });
      const pods = metrics.topPods.map((el: PodMetrics) => {
        return {
          name: el.pod,
          cpuCurrentUsage: el.cpuCurrentUsage,
          memoryCurrentUsage: el.memoryCurrentUsage,
          timestamp: strictIsoParse(new Date().toISOString()),
        };
      });
      podRef.current.push(...pods);
      nodeRef.current.push(...nodes);
      const newPods = metrics.topPods.map((el: PodMetrics) => el.pod);
      if (podNamesRef.current !== newPods) {
        podNamesRef.current = [...newPods];
      }
    });
  }, [socket]);

  useEffect(() => {
    socket.on('stats', (data) => {
      // console.log(stats)
      const newStats: StatsData[] = [
        { id: '1', name: 'Namespaces', value: data.totalNamespaces },
        { id: '2', name: 'Nodes', value: data.totalNodes },
        { id: '3', name: 'Pods', value: data.totalPods },
      ];
      setStats(newStats);

      const newNamespaces = data.namespaces;
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
    podRef.current = [];
    nodeRef.current = [];
    //empty log data from last namespace
    setLogs([{ id: '1', header: '', message: '' }]);
  }, [currentNamespace]);

  return (
    <>
      <Dashboard data={stats} />
      <DropdownMenu
        changeNamespace={setCurrentNamespace}
        namespaces={namespacesRef.current}
      />
      <div className='flex flex-wrap items-center justify-center'>
        <LineGraph dataRef={podRef} yaxis='CPU (Cores)' propertyName='cpuCurrentUsage' legendName='Pod Names Legend' title='Pod CPU Usage' />
        <LineGraph dataRef={podRef} yaxis={'Memory (Bytes)'} propertyName='memoryCurrentUsage' legendName='Pod Names Legend' title='Pod Memory Usage' />
      </div>
      <div className='flex flex-wrap items-center justify-center'>
        <LineGraph dataRef={nodeRef} yaxis='CPU (Cores)' propertyName='cpuCurrentUsage' legendName='Node Names Legend' title='Node CPU Usage' />
        <LineGraph dataRef={nodeRef} yaxis={'CPU Usage (%)'} propertyName='cpuPercentage' legendName='Node Names Legend' title='Node CPU % Over Total' />
      </div>
      <div className='flex flex-wrap items-center justify-center'>
        <LineGraph dataRef={nodeRef} yaxis={'Memory (Bytes)'} propertyName='memoryCurrentUsage' legendName='Node Names Legend' title='Node Memory Usage' />
        <LineGraph dataRef={nodeRef} yaxis={'Memory Usage (%)'} propertyName='memoryPercentage' legendName='Node Names Legend' title='Node Memory % Over Total' />
      </div>
      <DropdownPods changePod={setCurrentPod} pods={podNamesRef.current} />
      <LogsDashboard logs={logs} />
    </>
  );
}
