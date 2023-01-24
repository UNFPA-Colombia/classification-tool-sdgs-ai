import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import styles from "../../../styles/DocumentosComponentes.module.css"


function drawChartGauge(svgRef, number) {
  var pi = Math.PI,
    rad = pi / 180,
    deg = 180 / pi;

  var properties = {

    width: 1150,
    height: 550,
    margin: 0,

    rotation: 0,
    thickness: 0.15,
    arc: 1.15,
    ticks: 11,

    color_scheme: "interpolateRdYlGn",
    color_step: 150,
    tick_color: "#FFFFFF",
    needle_color: "#BB345B"

  };

  var needlePercent = number,
    center = {},
    radii = {},
    angles = {},
    ticks = {},
    gradient = [],
    scales = {};

  center.x = (properties.width) / 2,
    center.y = properties.height - properties.margin;


  var base = properties.height - (2 * properties.margin) - 90;

  radii.base = base,
    radii.cap = base / 15,
    radii.inner = base * (1 - properties.thickness),
    radii.outer_tick = base + 5,
    radii.tick_label = base + 15;

  var arc_complement = 1 - properties.arc;

  angles.arc_complement = arc_complement,
    angles.start_angle = (-pi / 2) + (pi * arc_complement / 2) + (properties.rotation * rad),
    angles.end_angle = (pi / 2) - (pi * arc_complement / 2) + (properties.rotation * rad);



  var sub_arc = (angles.end_angle - angles.start_angle) / (properties.ticks - 1),
    tick_pct = 100 / (properties.ticks - 1);

  ticks = d3.range(properties.ticks).map(function (d) {
    var sub_angle = angles.start_angle + (sub_arc * d);
    return {
      label: (tick_pct * d).toFixed(0) + '%',
      angle: sub_angle,
      coordinates: [[sub_angle, radii.inner],
      [sub_angle, radii.outer_tick]]
    }
  })


  var c = d3[properties.color_scheme],
    samples = properties.color_step,
    total_arc = angles.end_angle - angles.start_angle,
    sub_arc = total_arc / (samples);

  gradient = d3.range(samples).map(function (d) {
    var sub_color = d / (samples - 1),
      sub_start_angle = angles.start_angle + (sub_arc * d),
      sub_end_angle = sub_start_angle + sub_arc;
    return {
      fill: c(sub_color),
      start: sub_start_angle,
      end: sub_end_angle
    }
  });


  scales.lineRadial = d3.lineRadial();

  scales.subArcScale = d3.arc()
    .innerRadius(radii.inner + 1)
    .outerRadius(radii.base)
    .startAngle(d => d.start)
    .endAngle(d => d.end);

  scales.needleScale = d3.scaleLinear()
    .domain([0, 1])
    .range([angles.start_angle, angles.end_angle]);


  var svg = d3.select(svgRef.current);
  svg.selectAll("*").remove();
  svg = svg
    .attr("viewBox", [0, 40, properties.width - 45, properties.height + 135])

  var gauge = svg.append("g")
    .attr("transform", `translate(${center.x - 80}, ${center.y + 15})`)
    .attr("class", "gauge-container");

  gauge.append("g")
    .attr("class", "gauge-arc")
    .selectAll("path")
    .data(gradient)
    .enter()
    .append("path")
    .attr("d", scales.subArcScale)
    .attr("fill", d => d.fill)
    .attr("stroke-width", 0.5)
    .attr("stroke", d => d.fill);


  gauge.append("g")
    .attr("class", "gauge-ticks")
    .selectAll("path")
    .data(ticks)
    .enter()
    .append("g")
    .attr("class", "tick")
    .append("path")
    .attr("d", d => scales.lineRadial(d.coordinates))
    .attr("stroke", properties.tick_color)
    .attr("stroke-width", 2)
    .attr("stroke-linecap", "round")
    .attr("fill", "none");

  gauge.select("g.gauge-ticks")
    .selectAll("text")
    .data(ticks)
    .enter()
    .append("g")
    .attr("class", "tick-label")
    .append("text")
    .attr("transform", d =>
      `translate(${radii.tick_label * Math.sin(d.angle) - 3},
                   ${-radii.tick_label * Math.cos(d.angle) - 15})
          rotate(${d.angle * deg - pi})`)
    .attr("dy", "0.35em")
    .attr("text-anchor", "middle")
    .attr("font-size", "40px")
    .text(d => d.label);

  gauge.append("g")
    .attr("class", "needle")
    .selectAll("path")
    .data([needlePercent])
    .enter()
    .append("path")
    .attr("d", d => scales.lineRadial([[0, 0], [scales.needleScale(d), radii.outer_tick]]))
    .attr("stroke", properties.needle_color)
    .attr("stroke-width", 6)
    .attr("stroke-linecap", "round");

  gauge.select("g.needle")
    .append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", radii.cap)
    .attr("stroke", properties.needle_color)
    .attr("stroke-width", 6)
    .style("fill", "white");


}

export default function Gauge({ number }) {
  const [svg, setSvg] = useState(useRef(null))
  useEffect(() => {
    drawChartGauge(svg, number);
  }, [svg, number]);
  return <div className={styles.center}><svg ref={svg} /><p className={styles.text3} style={{ marginBottom: 0 }} >Nivel de coherencia: {Number((number) * 100).toFixed(4)}%</p> </div>;
}

