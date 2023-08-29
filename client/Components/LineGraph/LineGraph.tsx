import React, { useRef, useEffect } from 'react';
import { nest } from 'd3-collection';
import * as d3 from 'd3';
import { MappedNodeMetrics, MappedPodMetrics } from '../../types';
type LineGraphProps = {
  dataRef: {
    current: Array<MappedPodMetrics | MappedNodeMetrics>
  };
  yaxis: string;
  // propertyName: keyof MappedPodMetrics | keyof MappedNodeMetrics;
  propertyName: 'cpuCurrentUsage' | 'memoryCurrentUsage' | 'cpuPercentage' | 'memoryPercentage';
  legendName: string;
  title: string;
}

type GraphVars = [
  graph: d3.Selection<d3.BaseType, unknown, HTMLElement, unknown>,
  circleGroup: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>,
  xScaleGroup: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>,
  yScaleGroup: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>,
  width: number,
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  }
]

const LineGraph = ({ dataRef, yaxis, propertyName, legendName, title }: LineGraphProps) => {
  const svgRef = useRef();
  function initialize(width: number, height: number): GraphVars {

    const margin = { top: 20, right: 175, bottom: 50, left: 100 };
    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;

    const graph = d3
      .select(svgRef.current) //select the svg element from the virtual DOM.
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const circleGroup = graph.append('g');

    const xScaleGroup = graph.append('g');

    const yScaleGroup = graph.append('g');

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

    graph
      .append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2 + margin.bottom)
      .attr("y", margin.left / 6)
      .text(`${yaxis}`)
      .style("fill", "white")
      .attr('font-size', 12)

    graph.append("text")
      .attr("text-anchor", "start")
      .attr("x", width + margin.right / 8)
      .attr("y", 20)
      .text(legendName)
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
    return [graph, circleGroup, xScaleGroup, yScaleGroup, width, margin]; // returns an array of the variables, giving you the reference to the variable.
  }

  // updates the graph. data is our data, now is the end time, and lookback is the start time, graph vars is the array of reference of what we returned in initialize.
  function render(data: Array<MappedPodMetrics | MappedNodeMetrics>, now: Date, lookback: Date, graphVars: GraphVars) {
    // if (data[0]) y = Object.keys(dataRef['current'][0])[1];
    const room_for_axis = 100; // padding for axis

    const [graph, circleGroup, xScaleGroup, yScaleGroup, width] = graphVars;

    const radius = +graph.attr('width') / 200.0; // for the circle


    const sumStat = nest()
      .key(function ({ name }) { return name })
      .entries(data);


    //   // add the Line

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const xScale = d3
      .scaleTime() //accepts a date as a value and helps us compare the time
      .domain([lookback, now]) // min time vs max time of the pods
      // Add a little extra room for y axis
      .range([room_for_axis + 5, width]);

    const isMappedNodeMetricsArray = (data: Array<MappedPodMetrics | MappedNodeMetrics>): data is MappedNodeMetrics[] => {
      return data.length > 0 && 'node' in data[0];
    }

    const minValue = isMappedNodeMetricsArray(data)
      ? d3.min(data as MappedNodeMetrics[], (d) => {
        if (propertyName === 'cpuCurrentUsage') {
          return -0.00000001;
        }
        return +d[propertyName] / 4;
      })
      : d3.min(data as MappedPodMetrics[], (d) => {
        if (propertyName === 'cpuCurrentUsage') {
          return -0.00000001;
        }
        return +d[propertyName] / 4;
      });

    const maxValue = isMappedNodeMetricsArray(data)
      ? d3.max(data as MappedNodeMetrics[], (d) => +d[propertyName] * 1.2)
      : d3.max(data as MappedPodMetrics[], (d) => +d[propertyName] * 1.2);

    const yScale = d3
      .scaleLinear()
      .domain([minValue, maxValue])
      .range([+graph.attr('height') - room_for_axis, 0]);

    // const colorScale = d3
    //   .scaleTime()
    //   .domain([lookback, now])
    //   .range(['blue', 'red']);

    // const colorScale = d3
    //   .scaleTime()
    //   .domain([lookback, now])
    //   .range([0, 1]);

    const colorScale = d3
      .scaleTime<string, string>()
      .domain([lookback, now])
      .range(['blue', 'red']);

    circleGroup.selectAll('path').data(sumStat).exit().remove();
    graph.selectAll('text.pod-name').remove();
    graph.selectAll('.circle-pod-name').remove();

    graph.selectAll('.circlelegend')
      .data(sumStat)
      .join("circle")
      .attr('class', 'circle-pod-name')
      .attr("cx", width + 25)
      .attr("cy", function (d, i) { return 60 + i * 40 - 2 }) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("r", 5)
      .style("fill", function (d) { return color(d.key) })
    graph.selectAll('.pod-name-temp')
      .data(sumStat)
      .join('text')
      .attr('class', 'pod-name')
      .text(function (d) {
        return d.key
      })
      .style('fill', function (d) {
        return (color(d.key))
      })
      .attr('x', width + 28)
      .attr('y', function (d, i) {
        return 60 + i * 40
      })
      .attr('alignment-baseline', 'middle')
      .attr('dx', 5)
      .attr('font-size', 12)

    //subtracted 5 seconds from lookback to create additional buffer on the clip. 
    const adjustLookback = new Date(lookback)
    adjustLookback.setSeconds(adjustLookback.getSeconds() - 5);
    // specifes what date from the plot that is older than the lookback.
    const to_remove = data.filter((a) => a.timestamp < adjustLookback);
    circleGroup.selectAll('circle').data(to_remove).exit().remove();


    const valueLine = d3
      .line<MappedNodeMetrics | MappedPodMetrics>()
      .x((d) => {
        return xScale(d.timestamp);
      })
      .y((d) => {
        return yScale(d[propertyName]);
      });
    circleGroup
      .selectAll('.temp-path')
      .data(sumStat)
      .join('path')
      .attr('d', function (d) {
        return valueLine(d.values)
      })
      .attr("fill", "none")
      .attr("clip-path", "url(#rectangle-clip)") // clip the rectangle
      .attr("stroke", function (d) {
        return (color(d.key));
      })
      .attr("stroke-width", 4.5)

    // data = data.filter((a) => a.timestamp > adjustLookback);
    data = (data as Array<MappedPodMetrics | MappedNodeMetrics>).filter((a) => a.timestamp > adjustLookback);
    circleGroup
      .selectAll('g').data(data).enter().append('circle');

    circleGroup
      .selectAll('circle')
      .attr('cx', function (d: MappedPodMetrics | MappedNodeMetrics) {
        // cx = circle's x position (specific svg attribute)
        return xScale(d.timestamp); //tells us where on the graph that the plot should be relative to the chart's width.
      })
      .attr('cy', function (d: MappedPodMetrics | MappedNodeMetrics) {
        return yScale(d[propertyName]); // tells us where on the graph that the plot should be relative to chart's height.
      })
      .attr('r', radius)
      .attr('clip-path', 'url(#rectangle-clip)') // clip the rectangle
      .attr('fill', function (d: MappedPodMetrics | MappedNodeMetrics) {
        return colorScale(d.timestamp);
      });


    // const x_axis = d3.axisBottom().scale(xScale);
    const x_axis = d3.axisBottom(xScale);
    xScaleGroup
      // .transition()
      .attr(
        'transform',
        'translate(0,' + (+graph.attr('height') - room_for_axis) + ')'
      )
      .call(x_axis);

    // const y_axis = d3.axisLeft().scale(yScale);
    const y_axis = d3.axisLeft(yScale);
    yScaleGroup
      .attr('transform', 'translate(' + room_for_axis + ',0)')
      .call(y_axis);

    return data; // return the updated filter data.
  }

  useEffect(() => {
    // const scale = 0.2;
    const lookback_s = 30;

    // initialize
    let now = new Date();
    const width = 750;
    const graphVars = initialize(width, width * 0.6);

    let lookback = new Date(now); // creates a copy of now's date
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

  return (
    <div className='flex flex-col items-center justify-center'>
      <h2 className='text-2xl'>{title}</h2>
      <svg ref={svgRef}></svg>
    </div>
  )
};

export default LineGraph;
