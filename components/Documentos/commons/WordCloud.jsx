import React, { useEffect, useMemo, useRef } from "react";
import cloud from "d3-cloud";
import * as d3 from "d3";

function drawChart(svgRef, myWords) {
  //variables para adaptarse al texto: 
  let max = -2
  for (var i = 0; i < myWords.length; i++) {
    if (myWords[i].value > max) {
      max = myWords[i].value
    }
  }

  const factor = Math.floor(35 / max);
  console.log("esto es", factor);
  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 450 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  let svg = d3.select(svgRef.current);

  svg.selectAll("*").remove();
  svg = svg
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
  // Wordcloud features that are different from one text to the other must be here
  var layout = cloud()
    .size([width, height])
    .words(myWords.map(function (d) { return { text: d.text, size: ((d.value * factor) + "") }; }))
    .padding(5)        //space between words
    .rotate(function () { return ~~(Math.random() * 2) * 90; })
    .fontSize(function (d) { return d.size; })      // font size of words
    .on("end", draw);
  layout.start();

  // This function takes the output of 'layout' above and draw the words
  // Wordcloud features that are THE SAME from one word to the other can be here
  function draw(words) {
    svg
      .append("g")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
      .selectAll("text")
      .data(words)
      .enter().append("text")
      .style("font-size", function (d) { return d.size; })
      .style("fill", "rgb(" + Math.floor(Math.random() * 101) + "," + Math.floor(Math.random() * 101) + "," + Math.floor(Math.random() * 101) + ")")
      .attr("text-anchor", "middle")
      .style("font-family", "Impact")
      .attr("transform", function (d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function (d) { return d.text; });
  }
  return svg.node();
}

export default function WordCloud(props) {
  const svg = useRef(null);
  useEffect(() => {
    drawChart(svg, props.data);
  }, [svg]);

  return <div style={{ position: "relative", top: "-90px" }}> <svg ref={svg} /> </div>;
};

//Codigo base:https://d3-graph-gallery.com/graph/wordcloud_size.html