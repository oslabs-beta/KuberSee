import React, { useEffect } from "react";
import * as d3 from "d3";

function ChartTest() {

  const createGraph = async () => {

    // read data from csv and format variables
    let data = await d3.csv('https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv')
    var parseTime = d3.timeParse("%Y-%m-%d");

    data.forEach((d) => {
      d.date = parseTime(d.date);
      d.value = +d.value;
    });
    console.log(data)

    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 20, bottom: 50, left: 70 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g") // grouping
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // add X axis and Y axis
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    x.domain(d3.extent(data, (d) => { return d.date; }));
    y.domain([0, d3.max(data, (d) => { return d.value; })]);

    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    svg.append("g")
      .call(d3.axisLeft(y));

    // add the Line
    var valueLine = d3.line()
      .x((d) => { return x(d.date); })
      .y((d) => { return y(d.value); });

    svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", valueLine);

  }

  useEffect(() => {
    createGraph();
  }, []);

  return (
    <div id="#graph">
      <div />
      );
}

      export default ChartTest