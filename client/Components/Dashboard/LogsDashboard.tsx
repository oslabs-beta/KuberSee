import React from 'react';
import LogTable from '../LogTable/LogTable.jsx';
import { type LogsData } from '../../types.js';

type LogsDashboardProps = {
  logs: LogsData[];
};

export default function LogsDashboard({ logs }: LogsDashboardProps) {
  return (
    <div className='flex items-center justify-center'>
      <LogTable logs={logs} />
    </div>
  );
}
