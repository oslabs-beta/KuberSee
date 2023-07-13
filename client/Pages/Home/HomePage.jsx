import React from 'react'
import LogDashboard from '../../Components/Dashboard/LogDashboard.jsx'
import MetricsDashboard from '../../Components/Dashboard/MetricsDashboard.jsx'
import Stats from '../../Components/TotalStats/Stats.jsx'
import ChartTest from '../../Components/LineChart/FakeDataChart.jsx'
import ChartTestTwo from '../../Components/LineChart/ChartTestTwo.jsx'

export default function HomePage() {
  return (
    <div className='flex flex-col justify-center content-center	items-center'>
      KUBERSEE
      {/* <h1>HomePage</h1> */}
      {/* <ChartTest /> */}
      <ChartTestTwo />
       <LogDashboard /> 
    </div>
  )
}
