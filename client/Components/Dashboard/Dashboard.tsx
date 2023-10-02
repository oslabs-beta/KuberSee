import React from 'react';
import { StatsDataProps, StatsData, ReactElementsArray } from '../../types'

export default function Dashboard({ data = [] }: StatsDataProps) {


  const stats: ReactElementsArray = data.map((datum: StatsData) => (
    <div
      key={datum.id.toString()}
      id = {datum.id.toString()}
      className='mx-auto flex max-w-xs flex-col gap-y-4'
    >
      <dt className='mb-4 text-2xl font-extrabold leading-none tracking-tight md:text-3xl lg:text-4xl text-white'>
        {datum.name}
      </dt>

      <dd className='order-first text-3xl font-semibold tracking-tight  sm:text-5xl text-white'>
        {datum.value.toString()}
      </dd>
    </div>
  ))

  return (
    <div data-theme='night'>
      <div className='bg-night py-24 sm:py-32'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <dl className='grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3'>
            {stats}
          </dl>
        </div>
      </div>
    </div>
  );
}
