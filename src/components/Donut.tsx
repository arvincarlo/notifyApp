import { useRef, useEffect } from "react";
import * as d3 from "d3";

const DonutChart = ({ data, containerId }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();

    const width = 300;
    const height = 300;
    const margin = 20;

    const baseFontSize = Math.max(width * 0.035, 10);

    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const pie = d3
      .pie()
      .value((d) => d.value)
      .sort(null);

    const arc = d3
      .arc()
      .innerRadius(radius * 0.2)
      .outerRadius(radius);

    const labelArc = d3
      .arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 0.6);

    const arcs = svg
      .selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => d.data.color)
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("transition", "opacity 0.3s");
    const MIN_FONT_SIZE = 8;
    const MAX_FONT_SIZE = 12;
    const PERCENTAGE_FONT_MULTIPLIER = 0.8;

    const labels = svg
      .selectAll("text")
      .data(pie(data))
      .enter()
      .append("text")
      .attr("transform", (d) => `translate(${labelArc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .each(function (d) {
        const text = d3.select(this);

        // 计算字体大小，确保不小于最小值
        const nameLength = d.data.name.length;
        const calculatedSize = (radius * 0.8) / (nameLength * 0.5);
        const nameFontSize = Math.max(
          MIN_FONT_SIZE,
          Math.min(MAX_FONT_SIZE, calculatedSize)
        );
        const percentageFontSize = nameFontSize * PERCENTAGE_FONT_MULTIPLIER;

        // 添加名称
        text
          .append("tspan")
          .attr("x", 0)
          .attr("dy", 0)
          .style("font-size", `${nameFontSize}px`)
          .style("font-weight", "bold")
          .text(d.data.name);

        // 添加百分比值
        text
          .append("tspan")
          .attr("x", 0)
          .attr("dy", nameFontSize * 1.2)
          .style("font-size", `${percentageFontSize}px`)
          .style("font-weight", "bold")
          .text(`${d.data.value}%`);
      });

    arcs
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("transform", function (d) {
            const dist = radius * 0.05;
            const midAngle = (d.startAngle + d.endAngle) / 2;
            const x = Math.sin(midAngle) * dist;
            const y = -Math.cos(midAngle) * dist;
            return `translate(${x},${y})`;
          });
      })
      .on("mouseout", function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("transform", "translate(0,0)");
      });

    arcs
      .transition()
      .duration(1000)
      .attrTween("d", function (d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arc(interpolate(t));
        };
      });

    const handleResize = () => {
      const container = svgRef.current.parentElement;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      d3.select(svgRef.current)
        .attr("width", newWidth)
        .attr("height", newHeight);

      svg.selectAll("text").each(function (d) {
        const nameLength = d.data.name.length;
        const calculatedSize = (radius * 0.8) / (nameLength * 0.5);
        const nameFontSize = Math.max(
          MIN_FONT_SIZE,
          Math.min(MAX_FONT_SIZE, calculatedSize)
        );
        const percentageFontSize = nameFontSize * PERCENTAGE_FONT_MULTIPLIER;

        const text = d3.select(this);
        text
          .select("tspan:nth-child(1)")
          .style("font-size", `${nameFontSize}px`);
        text
          .select("tspan:nth-child(2)")
          .style("font-size", `${percentageFontSize}px`);
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [data, containerId]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default DonutChart;
