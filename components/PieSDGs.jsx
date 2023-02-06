import { useRef, useEffect } from "react";
import * as d3 from "d3";

function drawChart(svgRef, data, setObjetivo) {

    const width = 450,
        height = 450,
        margin = 40;

    const radius = Math.min(width, height) / 2 - margin

    let svg = d3.select(svgRef.current);

    svg.selectAll("*").remove();

    svg = svg.attr("viewBox", `0 0 ${width} ${height}`)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    const pie = d3.pie()
        .value(d => d.valor)
        .padAngle(.03)
        .sort(null);

    svg
        .selectAll('path')
        .data(pie(data))
        .join('path')
        .attr('d', (d,i) => d3.arc()
            .innerRadius(100)
            .outerRadius(radius+d.data.radius)(d, i)
        )
        .attr('fill', d => d.data.color)
        .append("svg:title").text(function(d) { return d.data.nombre; })
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '.85')
        })
        .on('mouseout', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '1');
        })
        .on('click', function (i, d) {
            setObjetivo(d.data.nombre);
        });
}

export default function PieSDGs({ objetivos, setObjetivo }) {
    const svg = useRef(null);
    useEffect(() => {
        drawChart(svg, objetivos, setObjetivo);
    }, [svg, objetivos, setObjetivo]);

    return <svg ref={svg} />;
};
