import React, { useRef, useEffect, useState } from "react";
import { nest } from 'd3-collection';
// import * as d3 from "d3";
// import { select, Selection } from 'd3-selection';
import {
  select,
  line,
  curveCardinal,
  scaleLinear,
  axisBottom,
  axisLeft,
} from "d3";
import fakeCPUData from '../../sampleData.js';

const createGraph = (data) => {

  const svgRef = useRef(); //similiar to document.querySelector. React uses the virtual dom, so we can't expect an element to persist. So instead, react recommends using useRef (aka escape hatch at last ditch effort) to give you a reference to an element. 

  //draws chart
  const svg = select(svgRef.current); // svgRef.current is getting the svg element. select method is d3's way to use querySelector. 

  console.log("create")
  // read data from fake data object and format variables
  // let data = fakeCPUData;
  var parseTime = d3.timeParse('%Y-%m-%dT%H:%M:%S.%LZ');

  data.forEach((d) => {
    d.Date = parseTime(d.Date);
    // console.log(d.Date);
    d.cpuPercent = +d.cpuPercent;
  });

  let sumStat = nest()
    .key(function (d) { return d.podName })
    .entries(data);

  // console.log(sumStat);

  // set the dimensions and margins of the graph
  var margin = { top: 20, right: 100, bottom: 50, left: 70 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // append the svg object to the graph id of the page
  // var svg = d3.select("#graph").append("svg")
  //   .attr("width", width + margin.left + margin.right)
  //   .attr("height", height + margin.top + margin.bottom)
  //   .append("g") // grouping
  //   .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // add X axis and Y axis
  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  x.domain(d3.extent(data, (d) => { return d.Date; }));
  y.domain([0, d3.max(data, (d) => { return d.cpuPercent; })]);

  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .call(d3.axisLeft(y));

  // add the Line
  var valueLine = d3.line()
    .x((d) => { return x(d.Date); })
    .y((d) => { return y(d.cpuPercent); });

  //append circle for each datapoint 
  svg.selectAll("circle")
    .data(data)
    .enter()
    .append('circle')
    .attr('fill', 'pink')
    .attr('class', 'circle')
    .attr('r', 3)
    .attr('cx', function (d) { return x(d.Date) })
    .attr('cy', function (d) { return y(d.cpuPercent) })

  svg.selectAll('.temp-path')
    .data(sumStat)
    .enter()
    .append('path')
    .attr('d', function (d) {
      return valueLine(d.values)
    })
    .attr("fill", "none")
    .attr("stroke", function (d, i) {
      return (color(d.key));
    })
    .attr("stroke-width", 1.5)

  svg.selectAll('.podName-label')
    .data(sumStat)
    .enter()
    .append('text')
    .attr('class', 'pod-name')
    .text(function (d) {
      return d.key
    })
    .style('fill', function (d, i) {
      return (color(d.key))
    })
    .attr('x', width)
    .attr('y', function (d) {
      return y(d.values[d.values.length - 1].cpuPercent)
    })
    .attr('alignment-baseline', 'middle')
    .attr('dx', 5)
    .attr('font-size', 12)
  return svg

}

const updateGraph = (svg, data) => {
  console.log("updatew")
  var parseTime = d3.timeParse('%Y-%m-%dT%H:%M:%S.%LZ');
  data.forEach((d) => {
    d.Date = parseTime(d.Date);
    // console.log(d.Date);
    d.cpuPercent = +d.cpuPercent;
  });
  let sumStat = nest()
    .key(function (d) { return d.podName })
    .entries(data);

  // console.log(sumStat);

  // set the dimensions and margins of the graph
  var margin = { top: 20, right: 100, bottom: 50, left: 70 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
  // add X axis and Y axis
  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  x.domain(d3.extent(data, (d) => { return d.Date; }));
  y.domain([0, d3.max(data, (d) => { return d.cpuPercent; })]);

  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .call(d3.axisLeft(y));

  // add the Line
  var valueLine = d3.line()
    .x((d) => { return x(d.Date); })
    .y((d) => { return y(d.cpuPercent); });

  //append circle for each datapoint 
  svg.selectAll("circle")
    .data(data)
    .enter()
    .append('circle')
    .attr('fill', 'pink')
    .attr('class', 'circle')
    .attr('r', 3)
    .attr('cx', function (d) { return x(d.Date) })
    .attr('cy', function (d) { return y(d.cpuPercent) })

  svg.selectAll('.temp-path')
    .data(sumStat)
    .enter()
    .append('path')
    .attr('d', function (d) {
      return valueLine(d.values)
    })
    .attr("fill", "none")
    .attr("stroke", function (d, i) {
      return (color(d.key));
    })
    .attr("stroke-width", 1.5)

  svg.selectAll('.podName-label')
    .data(sumStat)
    .enter()
    .append('text')
    .attr('class', 'pod-name')
    .text(function (d) {
      return d.key
    })
    .style('fill', function (d, i) {
      return (color(d.key))
    })
    .attr('x', width)
    .attr('y', function (d) {
      return y(d.values[d.values.length - 1].cpuPercent)
    })
    .attr('alignment-baseline', 'middle')
    .attr('dx', 5)
    .attr('font-size', 12)
}
// function redraw() {
//   for (let i = 0; i < fakeData.length; i++) {
//     let linedata = fakeData[i];
//     let removedPoint = linedata
//   }
// }

// podName: 'coredns-787d4945fb-7r5zr',
// cpuPercent: 4.005346, // this value is a percentage
// Date: "2023-07-08T19:12:12.568Z"
function ChartTest() {
  const [fakeData, setFakeData] = useState(fakeCPUData);
  let graph = createGraph(fakeCPUData);
  setInterval(() => {
    // console.log('inting')
    const newArray = [...fakeData];
    newArray.push({
      podName: 'pod2-787d4945fb-7r5zr',
      cpuPercent: 20, // this value is a percentage
      Date: "2023-07-08T20:27:43.919Z"
    })
    setFakeData(newArray);
    // updateGraph(graph, fakeData);
  }, 2000);
  useEffect(() => {
    updateGraph(graph, fakeData);
  }, [fakeData]);

  return (
    // <div id="graph">
    // </div>
    <svg ref={svgRef}>
    </svg>
  );
}

export default ChartTest;