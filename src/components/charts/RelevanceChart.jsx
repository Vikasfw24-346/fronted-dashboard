import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { createTooltip } from "./useTooltip";
import { FaStar, FaChartPie, FaDatabase } from "react-icons/fa";

/*Relevance Pie Chart */

function RelevanceChart({ data }) {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const tooltip = createTooltip();

    const width = 560;
    const height = 270;
    const radius = 110;

    svg.attr("width", width).attr("height", height);

    const grouped = d3.rollups(
      data.filter((d) => d.relevance !== null && d.relevance !== ""),
      (v) => v.length,
      (d) => d.relevance,
    );

    const pie = d3.pie().value((d) => d[1]);
    const arc = d3.arc().innerRadius(40).outerRadius(radius);

    const color = d3.scaleOrdinal(d3.schemeSet3);

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Animation
    g.selectAll("path")
      .data(pie(grouped))
      .enter()
      .append("path")
      .attr("fill", (_, i) => color(i))
      .transition()
      .duration(1000)
      .attrTween("d", (d) => {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return (t) => arc(i(t));
      });

    // Tooltip
    g.selectAll("path")
      .on("mouseover", (event, d) => {
        tooltip.style("opacity", 1).html(`
            <strong>Relevance:</strong> ${d.data[0]}<br/>
            <strong>Count:</strong> ${d.data[1]}
          `);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => tooltip.style("opacity", 0));
  }, [data]);

  return <svg ref={ref} />;
}

/*Relevance Card*/

export default function RelevanceCard({ data }) {
  const totalRecords = data?.length || 0;

  const avgRelevance = d3.mean(data, (d) => Number(d.relevance))?.toFixed(1);

  const relevanceGroups = d3.group(data, (d) => d.relevance);
  const relevanceLevels = relevanceGroups.size;

  return (
    <div className="col-12 col-md-6 col-xxl-4 d-flex justify-content-start p-2">
      <div
        className="card shadow-lg border-0"
        style={{
          maxWidth: "600px",
          background: "linear-gradient(135deg, #4c1d95, #8b5cf6)",
          color: "#fff",
          borderRadius: "12px",
          padding: "1rem",
        }}
      >
        {/* Header */}
        <div className="card-header border-0 bg-transparent">
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "8px",
              textAlign: "center",
            }}
          >
            <FaChartPie size={28} className="fs-2" />
            Relevance Status
          </h3>
        </div>

        {/* Chart */}
        <div className="card-body">
          <div className="mb-3 d-flex justify-content-center">
            <RelevanceChart data={data} />
          </div>

          {/* Stats */}
          <div className="d-flex justify-content-around align-items-center mt-3 flex-wrap gap-3">
            {/* Total Records */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "8px",
                textAlign: "center",
                marginTop: "4px",
              }}
            >
              <FaDatabase size={20} className="mb-1" />
              <span className="fw-bold">Records:</span>
              <span className="fs-5">{totalRecords}</span>
            </div>

            {/* Avg Relevance */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "8px",
                textAlign: "center",
                marginTop: "4px",
              }}
            >
              <FaStar size={20} className="mb-1" />
              <span className="fw-bold">Avg Relevance:</span>
              <span className="fs-5">{avgRelevance || "N/A"}</span>
            </div>

            {/* Levels */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "8px",
                textAlign: "center",
                marginTop: "4px",
              }}
            >
              <FaChartPie size={20} className="mb-1" />
              <span className="fw-bold">Levels:</span>
              <span className="fs-5">{relevanceLevels}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
