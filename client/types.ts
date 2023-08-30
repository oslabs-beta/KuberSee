import React from 'react';


export type StatsDataProps = {
  data: StatsData[]
}

export type StatsData = {
  id: string,
  name: string,
  value: number,
}

export type LogsData = {
  id: string,
  header: string,
  message: string
}

export type ReactElementsArray = React.ReactElement<React.ReactElement>[];

export type MappedNodeMetrics = {
  name: string;
  node: string;
  cpuCurrentUsage: number;
  cpuPercentage: number;
  cpuTotal: number;
  memoryCurrentUsage: number;
  memoryTotal: number;
  memoryPercentage: number;
  timestamp: Date;
};

export type MappedPodMetrics = {
  pod: string;
  cpuCurrentUsage: number;
  memoryCurrentUsage: number;
  timestamp: Date;
  cpuPercentage: number;
  memoryPercentage: number;
};
