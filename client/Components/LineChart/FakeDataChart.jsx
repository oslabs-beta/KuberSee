import React, { useEffect } from "react";
import * as d3 from "d3";
import fakeCPUData from '../../sampleData.js';


const createGraph = async () => {
  console.log('JHELLO');
  // read data from csv and format variables
  let data = fakeCPUData;
  var parseTime = d3.timeParse('%Y-%m-%dT%H:%M:%S.%LZ');

  data.forEach((d) => {
    d.Date = parseTime(d.Date);
    d.cpuPercent = +d.cpuPercent;
    console.log(d);
  });

  console.log(data)

  // set the dimensions and margins of the graph
  var margin = { top: 20, right: 20, bottom: 50, left: 70 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g") // grouping
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // add X axis and Y axis
  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

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

  svg.append("path")
    .data([data])
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", valueLine);

}

function ChartTest() {
  useEffect(() => {
    createGraph();
  }, []);

  return (
    <div id="graph"> WHY??????
    </div>
  );
}
export default ChartTest;