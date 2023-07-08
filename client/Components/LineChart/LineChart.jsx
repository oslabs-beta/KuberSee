import React, { useRef, useEffect } from "react";
import {
  select,
  line,
  curveCardinal,
  scaleLinear,
  axisBottom,
  axisLeft,
} from "d3";
//data from the cluster would update through a setInterval
const data = [
  { x: 0, y: 10 },
  { x: 1, y: 20 },
  { x: 2, y: 15 },
  { x: 3, y: 25 },
  { x: 4, y: 30 },
];


const LineChart = ({ height = 100, width = 500 }) => {

  //refs
  const svgRef = useRef(); //similiar to document.querySelector. React uses the virtual dom, so we can't expect an element to persist. So instead, react recommends using useRef (aka escape hatch at last ditch effort) to give you a reference to an element. 

  //draws chart
  useEffect(() => {
    const svg = select(svgRef.current); // svgRef.current is getting the svg element. select method is d3's way to use querySelector. 

    //scales
    const xScale = scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width]);

    const yScale = scaleLinear().domain([0, 100]).range([height, 0]); // domain might be how many data points. range = actual value range

    //axes
    const xAxis = axisBottom(xScale).ticks(data.length); // axisBottom is a method, ticks is.. ?
    svg.select(".x-axis").style("transform", `translateY(${height}px)`).call(xAxis); // transform is a css stlye and moving the x-axis by 100 px. 
    svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "start")
      .attr("x", 0)
      .attr("y", height - 6)
      .text("income per capita, inflation-adjusted (dollars)");

    const yAxis = axisLeft(yScale);
    svg.select(".y-axis").style("transform", "translateX(0px)").call(yAxis);

    svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", 6)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("life expectancy (years)");

    //line generator
    const myLine = line() // what does line do here? 
      .x((d, i) => xScale(i))
      .y((d) => yScale(d.y))
      .curve(curveCardinal);

    //drawing the line
    svg
      .selectAll(".line")
      .data([data])
      .join("path")
      .attr("class", "line")
      .attr("d", myLine)
      .attr("fill", "none")
      .attr("stroke", "#00bfa6");
  }, [data]);
  // every element has a ref prop to pass. crates an object with a property called "current" and assigns the ref property with the svgProperty to the element (svg). 
  return (

    <svg ref={svgRef}>


    </svg>

  );
};




export default LineChart;