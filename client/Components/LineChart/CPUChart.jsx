import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const CPUChart = ({ pods }) => {
  // const [graphVars, setgraphVars] = useState([]);
  const svgRef = useRef(); //creating a variable to connect the ref prop that we

  function initialize(width, height) {
    var graph = d3
      .select(svgRef.current) //select the svg element from the virtual DOM.
      .attr('width', width)
      .attr('height', height);

    var barGroup = graph.append('g');

    var xScaleGroup = graph.append('g');

    var yScaleGroup = graph.append('g');

    graph
      .append('clipPath') // define a clip path
      .attr('id', 'rectangle-clip') // give the clipPath an ID
      .append('rect') // shape it as an ellipse
      .attr('x', 41) // position the x-centre
      .attr('y', 0) // position the y-centre
      .attr('width', width * 2 + 300)
      .attr('height', height);

    //I used this to make the clipping mask to visualize what the size of the graph of was
    // graph.append("rect")
    // .attr("x", 0)         // position the x-centre
    // .attr("y", 0)
    // .attr("width", width*2 )
    // .attr("height", height*2)
    //   .style('fill', 'red')
    //   .style("opacity", .10)
    // .attr("clip-path", "url(#rectangle-clip)") // clip the rectangle

    return [graph, barGroup, xScaleGroup, yScaleGroup]; // returns an array of the variables, giving you the reference to the variable.
  }

  // updates the graph. data is our data, now is the end time, and lookback is the start time, graph vars is the array of reference of what we returned in initialize.
  function render(data, now, lookback, graphVars) {
    console.log(graphVars);
    const room_for_axis = 40; // padding for axis

    const [graph, barGroup, xScaleGroup, yScaleGroup] = graphVars;

    const radius = graph.attr('width') / 200.0; // for the circle

    // const xValues = data.map(a => a.Date);
    const yValues = data.map((a) => a.cpuCurrentUsage);

    const xScale = d3
      .scaleTime() //accepts a date as a value and helps us compare the time
      .domain([lookback, now]) // min time vs max time of the pods
      // Add a little extra room for y axis
      .range([room_for_axis + 5, graph.attr('width')]);

    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, (d) => {
          return d.cpuCurrentUsage * 2;
        }),
      ])
      .range([graph.attr('height') - room_for_axis, 0]); // range deals with the position of where things get plotted (area)

    const colorScale = d3
      .scaleTime()
      .domain([lookback, now])
      .range(['blue', 'red']);

    barGroup.selectAll('path').data([data]).exit().remove();

    // specifes what date from the plot that is older than the lookback.
    const to_remove = data.filter((a) => a.timestamp < lookback);
    barGroup.selectAll('circle').data(to_remove).exit().remove();

    var valueLine = d3
      .line()
      .x((d) => {
        return xScale(d.timestamp);
      })
      .y((d) => {
        return yScale(d.cpuCurrentUsage);
      });
    barGroup
      .selectAll('.temp-path')
      .data([data])
      .join('path')
      .attr('d', valueLine)
      .attr("fill", "none")
      .attr("clip-path", "url(#rectangle-clip)") // clip the rectangle
      .attr("stroke", "steelblue")
      .attr("stroke-width", 4.5)

    // returning a filtered array 'data' of data that is newer than the lookback and append the points to barGroup.
    data = data.filter((a) => a.timestamp > lookback);
    barGroup.selectAll('g').data(data).enter().append('circle');

    barGroup
      .selectAll('circle')
      .transition()
      .attr('cx', function (d) {
        // cx = circle's x position (specific svg attribute)
        return xScale(d.timestamp); //tells us where on the graph that the plot should be relative to the chart's width.
      })
      .attr('cy', function (d) {
        return yScale(d.cpuCurrentUsage); // tells us where on the graph that the plot should be relative to chart's height.
      })
      .attr('r', radius)
      .attr('clip-path', 'url(#rectangle-clip)') // clip the rectangle
      .attr('fill', function (d) {
        return colorScale(d.timestamp);
      });

    // data.forEach((d) => {
    //   d.Date = d.timestamp;
    //   d.cpuPercent = +d.cpuCurrentUsage;
    // });

    var x_axis = d3.axisBottom().scale(xScale);
    xScaleGroup
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

  // function new_point(last_point, scale) {
  //   const walk = (Math.random() - 0.5) * scale
  //   return last_point + walk
  // }
  const strictIsoParse = d3.utcParse('%Y-%m-%dT%H:%M:%S.%LZ'); // need to use d3's isoParse: https://github.com/d3/d3-time-format
  


  useEffect(() => {

    let data = [];
    const scale = 0.2;
    const lookback_s = 30;
    const width = 960;
    let graphVars = initialize(width, width * 0.7);

    // initialize
    var now = new Date();

    // this is only if we need to plot historical data
    // data.forEach((d) => {
    //   d.Date = strictIsoParse(d.Date);
    //   // console.log(d.Date);
    //   d.cpuPercent = +d.cpuPercent;
    // });

    var lookback = new Date(now); // creates a copy of now's date
    lookback.setSeconds(lookback.getSeconds() - lookback_s); // go back in time by 30 seconds

    render(data, now, lookback, graphVars); // invoke to show first graph

    // const updateIntervalMs = 200;
    // const intervalID = setInterval(async function () {
    //   const response = await fetch('/api/metrics');
    //   const metrics = await response.json();
    //   const pod = metrics.topPods[0];
    //   // console.log('all', metrics);
    //   // console.log('name', metrics.namespace);
    //   // console.log('nodes', metrics.topNodes);
    //   // console.log('pods', metrics.topPods);
    //   changeStats([
    //     { id: 1, name: 'Namespaces', value: metrics.namespace.length },
    //     { id: 2, name: 'Nodes', value: metrics.topNodes.length },
    //     { id: 3, name: 'Pods', value: metrics.totalPods },
    //   ]);
      const podsArray = pods.map((el) => {
        return {
          podName: el.pod,
          cpuCurrentUsage: el.cpuCurrentUsage,
          timestamp: strictIsoParse(new Date().toISOString()),
        };
      });
    //   // console.log(mapArray);
      data.push(...podsArray);
      // console.log(mapArray);
      // console.log(pod);

      // data.push({
      //   podName: pod.pod,
      //   cpuCurrentUsage: pod.cpuCurrentUsage * 100000, // this value is a percentage
      //   timestamp: strictIsoParse(new Date().toISOString()) // convert the date to string and then use the parse method for D3
      // })
  


      // Move time forward
      now = new Date();
      lookback = new Date(now);
      lookback.setSeconds(lookback.getSeconds() - lookback_s);

      data = render(data, now, lookback, graphVars); // reassigning data with the newly pushed data.
  //   }, updateIntervalMs);
  //   return () => {
  //     clearInterval(intervalID); // once the component is removed, it will perform a clean up. Don't want the setInterval to run in the background even if the component is running in the background.
  //   };
  }, [pods]);

  return <svg ref={svgRef}></svg>;
};

export default CPUChart;
