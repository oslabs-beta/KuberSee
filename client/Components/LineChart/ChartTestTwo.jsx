import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import fakeCPUData from '../../sampleData.js'

const ChartTestTwo = () => {
  const svgRef = useRef();
  function initialize(width, height) {
    var graph = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    var barGroup = graph.append("g");

    var xScaleGroup = graph.append("g");

    var yScaleGroup = graph.append("g");

    return [graph, barGroup, xScaleGroup, yScaleGroup]
  }
  function render(data, now, lookback, graphVars) {
    const room_for_axis = 40;

    const [graph, barGroup, xScaleGroup, yScaleGroup] = graphVars;

    const radius = graph.attr('width') / 200.0;

    const xValues = data.map(a => a[0]);
    const yValues = data.map(a => a[1]);

    const xScale = d3.scaleTime()
      .domain([lookback, now])
      // Add a little extra room for y axis
      .range([room_for_axis + 5, graph.attr('width')]);

    const miny = d3.min(yValues)
    const maxy = d3.max(yValues)
    const range = maxy - miny
    const yScale = d3.scaleLinear()
      .domain([miny - range * 0.01, maxy + range * 0.01])
      .range([graph.attr('height') - room_for_axis, 0]);

    const colorScale = d3.scaleTime()
      .domain([lookback, now])
      .range(['blue', 'red']);

    const to_remove = data.filter(a => a[0] < lookback);
    barGroup.selectAll("circle")
      .data(to_remove)
      .exit()
      .remove();

    data = data.filter(a => a[0] > lookback);
    barGroup.selectAll("g")
      .data(data)
      .enter()
      .append("circle");

    barGroup.selectAll("circle")
      .attr('cx', function (d) {
        return xScale(d[0]);
      })
      .attr("cy", function (d) {
        return yScale(d[1]);
      })
      .attr("r", radius)
      .attr("fill", function (d) { return colorScale(d[0]) });

    var x_axis = d3.axisBottom().scale(xScale);
    xScaleGroup.attr('transform', 'translate(0,' + (graph.attr('height') - room_for_axis) + ')')
      .call(x_axis);

    var y_axis = d3.axisLeft().scale(yScale)
    yScaleGroup.attr('transform', 'translate(' + room_for_axis + ',0)').call(y_axis);

    return data
  }

  function new_point(last_point, scale) {
    const walk = (Math.random() - 0.5) * scale
    return last_point + walk
  }

  useEffect(() => {
    const scale = 0.2;
    const lookback_s = 30;

    // initialize
    var now = new Date();
    const width = 960;
    const graphVars = initialize(width, width * 0.7);

    var data = [];
    var last_point = Math.random();
    data.push([now, last_point]);

    var lookback = new Date(now)
    lookback.setSeconds(lookback.getSeconds() - lookback_s);
    now = new Date();
    render(data, now, lookback, graphVars);

    const updateIntervalMs = 200;
    setInterval(function () {
      // Add a new point
      last_point = new_point(last_point, scale);
      data.push([now, last_point]);

      // Move time forward
      now = new Date()
      lookback = new Date(now)
      lookback.setSeconds(lookback.getSeconds() - lookback_s);

      data = render(data, now, lookback, graphVars);
    }, updateIntervalMs);
  }, []);

  return (
    <svg ref={svgRef} ></svg>
  )
}

export default ChartTestTwo;