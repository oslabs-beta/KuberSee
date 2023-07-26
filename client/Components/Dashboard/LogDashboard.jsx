import React from 'react';
import LogTable from '../LogTable/LogTable.jsx';

export default function LogDashboard({log}) {
  return (
    <div className='flex items-center justify-center'>
      <LogTable log={log} />
    </div>
  );
}
