import React, { useEffect } from 'react';
import socketIoClient from 'socket.io-client';

export default function Dashboard() {
  useEffect(() => {
    const newSocket = socketIoClient('http://localhost:3000/api/metrics', {
      autoConnect: false,
    });
    newSocket.on('event', (event) => {
      console.log(event);
    });

    return () => {
      newSocket.off('event', handleNewEvent);
      newSocket.disconnect();
    };
  }, []);
  const stats = [
    { id: 1, name: 'Namespace', value: '' },
    { id: 2, name: 'Nodes', value: '' },
    { id: 3, name: 'Pods', value: '' },
  ];

  return (
    <html data-theme='night'>
      <div className='bg-night py-24 sm:py-32'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <dl className='grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3'>
            {stats.map((stat) => (
              <div
                key={stat.id}
                className='mx-auto  flex max-w-xs flex-col gap-y-4'
              >
                <dt class='mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white'>
                  {stat.name}
                </dt>
                <dd className='order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl'>
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </html>
  );
}
