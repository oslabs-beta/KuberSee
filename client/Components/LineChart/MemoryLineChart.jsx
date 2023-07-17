import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { nest } from 'd3-collection';
import { selectAll } from 'd3-selection';

const MemoryLineChart = ({ dataRef }) => {
  const svgRef = useRef(); //creating a variable to connect the ref prop that we

  function initialize(width, height) {
    var margin = { top: 20, right: 175, bottom: 50, left: 100 },
      width = width - margin.left - margin.right,
      height = height - margin.top - margin.bottom;

    var graph = d3
      .select(svgRef.current) //select the svg element from the virtual DOM.
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    var barGroup = graph.append('g');

    var xScaleGroup = graph.append('g');

    var yScaleGroup = graph.append('g');

    graph
      .append('clipPath') // define a clip path
      .attr('id', 'rectangle-clip') // give the clipPath an ID
      .append('rect') // shape it as an ellipse
      .attr('x', 101) // position the x-centre
      .attr('y', 0) // position the y-centre
      .attr('width', width * 2 + 300)
      .attr('height', height);

    graph.append("text")
      .attr("text-anchor", "end")
      .attr("x", width / 2 + margin.left)
      .attr("y", height + margin.bottom / 2)
      .text("Time (seconds)")
      .style("fill", "white")
      .attr('font-size', 12)

    graph.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2 + margin.bottom)
      .attr("y", margin.left / 6)
      .text("Memory (bytes)")
      .style("fill", "white")
      .attr('font-size', 12)
    //I used this to make the clipping mask to visualize what the size of the graph of was
    // graph.append("rect")
    // .attr("x", 0)         // position the x-centre
    // .attr("y", 0)
    // .attr("width", width*2 )
    // .attr("height", height*2)
    //   .style('fill', 'red')
    //   .style("opacity", .10)
    // .attr("clip-path", "url(#rectangle-clip)") // clip the rectangle

    return [graph, barGroup, xScaleGroup, yScaleGroup, width, margin]; // returns an array of the variables, giving you the reference to the variable.
  }

  // updates the graph. data is our data, now is the end time, and lookback is the start time, graph vars is the array of reference of what we returned in initialize.
  function render(data, now, lookback, graphVars) {
    const room_for_axis = 100; // padding for axis

    const [graph, barGroup, xScaleGroup, yScaleGroup, width] = graphVars;

    const radius = graph.attr('width') / 200.0; // for the circle

    // const xValues = data.map(a => a.Date);
    // const yValues = data.map((a) => a.memoryCurrentUsage);

    let sumStat = nest()
      .key(function (d) { return d.podName })
      .entries(data);

    var color = d3.scaleOrdinal(d3.schemeCategory10);
    const xScale = d3
      .scaleTime() //accepts a date as a value and helps us compare the time
      .domain([lookback, now]) // min time vs max time of the pods
      // Add a little extra room for y axis
      .range([room_for_axis + 5, width]);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => { return d.memoryCurrentUsage - 1000000 }),
        d3.max(data, (d) => {
          return d.memoryCurrentUsage * 1.1;
        }),
      ])
      .range([graph.attr('height') - room_for_axis, 0]); // range deals with the position of where things get plotted (area)

    const colorScale = d3
      .scaleTime()
      .domain([lookback, now])
      .range(['blue', 'red']);

    barGroup.selectAll('path').data([data]).exit().remove();
    graph.selectAll('text.pod-name').data(sumStat).remove();

    graph.selectAll('.pod-name-temp')
      .data(sumStat)
      .join('text')
      .attr('class', 'pod-name')
      .text(function (d) {
        return d.key
      })
      .style('fill', function (d, i) {
        return (color(d.key))
      })
      .attr('x', width)
      .attr('y', function (d) {
        return yScale(d.values[d.values.length - 1].memoryCurrentUsage)
      })
      .attr('alignment-baseline', 'middle')
      .attr('dx', 5)
      .attr('font-size', 12)

    //subtracted 5 seconds from lookback to create additional buffer on the clip. 
    const adjustLookback = new Date(lookback)
    adjustLookback.setSeconds(adjustLookback.getSeconds() - 5);
    // specifes what date from the plot that is older than the lookback.
    const to_remove = data.filter((a) => a.timestamp < adjustLookback);
    barGroup.selectAll('circle').data(to_remove).exit().remove();

    var valueLine = d3
      .line()
      .x((d) => {
        return xScale(d.timestamp);
      })
      .y((d) => {
        return yScale(d.memoryCurrentUsage);
      });
    barGroup
      .selectAll('.temp-path')
      .data(sumStat)
      .join('path')
      .attr('d', function (d) {
        return valueLine(d.values)
      })
      .attr("fill", "none")
      .attr("clip-path", "url(#rectangle-clip)") // clip the rectangle
      .attr("stroke", (d, i) => {
        return (color(d.key));
      })
      .attr("stroke-width", 4.5)

    // returning a filtered array 'data' of data that is newer than the lookback and append the points to barGroup.
    data = data.filter((a) => a.timestamp > adjustLookback);
    barGroup.selectAll('g').data(data).enter().append('circle');

    barGroup
      .selectAll('circle')
      .attr('cx', function (d) {
        // cx = circle's x position (specific svg attribute)
        return xScale(d.timestamp); //tells us where on the graph that the plot should be relative to the chart's width.
      })
      .attr('cy', function (d) {
        return yScale(d.memoryCurrentUsage); // tells us where on the graph that the plot should be relative to chart's height.
      })
      .attr('r', radius)
      .attr('clip-path', 'url(#rectangle-clip)') // clip the rectangle
      .attr('fill', function (d) {
        return colorScale(d.timestamp);
      });

    // data.forEach((d) => {
    //   d.Date = d.timestamp;
    //   d.memoryCurrentUsage = +d.memoryCurrentUsage;
    // });

    var x_axis = d3.axisBottom().scale(xScale);
    xScaleGroup
      // .transition()
      .attr(
        'transform',
        'translate(0,' + (graph.attr('height') - room_for_axis) + ')'
      )
      .call(x_axis);

    var y_axis = d3.axisLeft().scale(yScale);
    yScaleGroup
      .attr('transform', 'translate(' + room_for_axis + ',0)')
      .call(y_axis);

    return data; // return the updated filter data.
  }

  useEffect(() => {
    // const scale = 0.2;
    const lookback_s = 30;

    // initialize
    var now = new Date();
    const width = 1050;
    const graphVars = initialize(width, width * 0.7);

    var lookback = new Date(now); // creates a copy of now's date
    lookback.setSeconds(lookback.getSeconds() - lookback_s); // go back in time by 30 seconds

    render(dataRef.current, now, lookback, graphVars); // invoke to show first graph

    const updateIntervalMs = 200;
    const intervalID = setInterval(async function () {
      // Move time forward
      now = new Date();
      lookback = new Date(now);
      lookback.setSeconds(lookback.getSeconds() - lookback_s);

      dataRef.current = render(dataRef.current, now, lookback, graphVars); // reassigning data with the newly pushed data.
    }, updateIntervalMs);
    return () => {
      clearInterval(intervalID); // once the component is removed, it will perform a clean up. Don't want the setInterval to run in the background even if the component is running in the background.
    };
  }, []);

  return <svg ref={svgRef}></svg>;
};

export default MemoryLineChart;
