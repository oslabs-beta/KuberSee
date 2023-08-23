import React from 'react';
import LogTable from '../LogTable/LogTable.jsx';

export default function LogsDashboard({logs}) {
  return (
    <div className='flex items-center justify-center'>
      <LogTable logs={logs} />
    </div>
  );
}
