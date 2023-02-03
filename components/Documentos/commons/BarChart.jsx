import React, { useEffect, useRef } from 'react'
import { scaleBand, scaleLinear } from 'd3-scale';
// import {howto, altplot} from "@d3/example-components"
// import { transition } from 'd3-transition';
import * as d3 from "d3";


function drawChart(svgRef, data) {

  // given d in data, returns the (ordinal) x-value

  var y = d => d.value; // given d in data, returns the (quantitative) y-value
  var title = "Topico 1 "; // given d in data, returns the title text
  var marginTop = 20;// the top margin, in pixels
  var marginRight = 0; // the right margin, in pixels
  var marginBottom = 30; // the bottom margin, in pixels
  var marginLeft = 40; // the left margin, in pixels
  var width = 600; // the outer width of the chart, in pixels
  var height = 400; // the outer height of the chart, in pixels
  var xRange = [marginLeft, width - marginRight]; // [left, right]
  var yType = d3.scaleLinear; // y-scale type
  var yRange = [height - 50 - marginBottom, marginTop]; // [bottom, top]
  // var xPadding = 0.1; // amount of x-range to reserve to separate bars
  var yFormat = ""; // a format specifier string for the y-axis
  var yLabel = "Importancia"; // a label for the y-axis
  var color = "currentColor";// bar fill color

  let X = [];
  let Y = [];
  for (let i = 0; i < data.length; i++) {
    X.push(data[i].text);
    Y.push(data[i].value);
  }

  var xDomain = X; // an array of (ordinal) x-values
  xDomain = new d3.InternSet(xDomain);

  var yDomain = [0, d3.max(Y)]; // [ymin, ymax]


  // Omit any data not present in the x-domain.
  const I = d3.range(X.length).filter(i => xDomain.has(X[i]));

  // // Construct scales, axes, and formats.
  const xScale = d3.scaleBand(xDomain, xRange).padding(0.3);
  const yScale = yType(yDomain, yRange);
  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);


  let svg = d3.select(svgRef.current);

  svg.selectAll("*").remove();

  svg = svg
    .attr("width", width)
    .attr("height", "auto")
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(yAxis)
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
      .attr("x2", width - marginLeft - marginRight + 50)
      .attr("stroke-opacity", 0.1))
    .call(g => g.append("text")
      .attr("x", -marginLeft)
      .attr("y", 10)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .style("font-size", "1.5em")
      .style("font-weight", "600")
      .text(yLabel));

  const bar = svg.append("g")
    .attr("fill", color)
    .selectAll("rect")
    .data(I)
    .join("rect")
    .style("font-size", "5.2em")
    .style("font-weight", "500")
    .attr("x", i => xScale(X[i]) + 10)
    .attr("y", i => yScale(Y[i]))
    .attr("height", i => yScale(0) - yScale(Y[i]))
    .attr("width", xScale.bandwidth());

  if (title) bar.append("title")
    .text(title);

  svg.append("g")
    .attr("transform", `translate(0,${height - 50 - marginBottom})`)
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .style("font-size", "1.85em")
    .style("font-weight", "600")
    .attr("dx", "-.5em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-35)");

  return svg.node();
}

export default function BarChart({ data }) {
  const svg = useRef(null);
  useEffect(() => {
    drawChart(svg, data);
  }, [svg]);

  return <svg ref={svg} />;
};
