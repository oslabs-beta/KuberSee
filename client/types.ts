import React from 'react';


export type StatsDataProps = {
  data: StatsData[]
}

export type StatsData = {
  id: String,
  name: String,
  value: Number
}

export type ReactElementsArray = React.ReactElement<React.ReactElement>[];
