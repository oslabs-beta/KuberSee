import React from 'react';


export type StatsDataProps = {
  data: StatsData[]
}

export type StatsData = {
  id: String,
  name: String,
  value: Number,
}

export type LogsData = {
    id: String,
    header: String,
    message: String
}

export type ReactElementsArray = React.ReactElement<React.ReactElement>[];
