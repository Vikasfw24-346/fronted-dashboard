import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { createTooltip } from "./useTooltip";
import { FaChartArea, FaCalendarAlt, FaSignal } from "react-icons/fa";

/*Likelihood Chart*/

function LikelihoodChart({ data }) {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const tooltip = createTooltip();

    const width = 580;
    const height = 275;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };

    svg.attr("width", width).attr("height", height);

    const filtered = data.filter(
      (d) => d.start_year && !isNaN(Number(d.likelihood)),
    );

    const x = d3
      .scalePoint()
      .domain(filtered.map((d) => d.start_year))
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(filtered, (d) => Number(d.likelihood)) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3
      .line()
      .x((d) => x(d.start_year))
      .y((d) => y(Number(d.likelihood)));

    // Line
    const path = svg
      .append("path")
      .datum(filtered)
      .attr("fill", "none")
      .attr("stroke", "#22c55e")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Animation
    const length = path.node().getTotalLength();
    path
      .attr("stroke-dasharray", length)
      .attr("stroke-dashoffset", length)
      .transition()
      .duration(1000)
      .attr("stroke-dashoffset", 0);

    // Dots + Tooltip
    svg
      .selectAll("circle")
      .data(filtered)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.start_year))
      .attr("cy", (d) => y(Number(d.likelihood)))
      .attr("r", 5)
      .attr("fill", "#16a34a")
      .on("mouseover", (event, d) => {
        tooltip.style("opacity", 1).html(`
            <strong>Year:</strong> ${d.start_year}<br/>
            <strong>Likelihood:</strong> ${d.likelihood}
          `);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => tooltip.style("opacity", 0));

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  }, [data]);

  return <svg ref={ref} />;
}

/*Likelihood Card*/
export default function LikelihoodCard({ data }) {
  const totalRecords = data?.length || 0;

  const avgLikelihood = d3.mean(data, (d) => Number(d.likelihood))?.toFixed(1);

  const uniqueYears = new Set(
    data.filter((d) => d.start_year).map((d) => d.start_year),
  ).size;

  return (
    <div className="col-12 col-md-6 col-xxl-4 d-flex justify-content-start bg-black p-2">
      <div
        className="card shadow-lg border-0"
        style={{
          maxWidth: "600px",
          background: "linear-gradient(135deg, #064e3b, #22c55e)",
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
            <FaChartArea size={28} className="fs-2" />
            Likelihood Trend
          </h3>
        </div>

        {/* Chart */}
        <div className="card-body">
          <div className="mb-3 d-flex justify-content-start">
            <LikelihoodChart data={data} />
          </div>

          {/* Stats */}
          <div className="d-flex justify-content-around align-items-center mt-3">
            {/* Records */}
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
              <FaSignal size={20} className="mb-1" />
              <span className="fw-bold">Records:</span>
              <span className="fs-5">{totalRecords}</span>
            </div>

            {/* Average Likelihood */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "8px",
                textAlign: "center",
              }}
            >
              <FaChartArea size={20} className="mb-1" />
              <span className="fw-bold">Avg Likelihood:</span>
              <span className="fs-5">{avgLikelihood || "N/A"}</span>
            </div>

            {/* Years */}
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
              <FaCalendarAlt size={20} className="mb-1" />
              <span className="fw-bold">Years:</span>
              <span className="fs-5">{uniqueYears}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
