import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { createTooltip } from "./useTooltip";
import { FaMapMarkedAlt, FaDatabase, FaLayerGroup } from "react-icons/fa";

/*Region Chart*/

function RegionChart({ data, onSelectRegion }) {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const tooltip = createTooltip();

    const width = 580;
    const height = 270;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };

    svg.attr("width", width).attr("height", height);

    const regions = d3.rollups(
      data.filter((d) => d.region),
      (v) => v.length,
      (d) => d.region,
    );

    const x = d3
      .scaleBand()
      .domain(regions.map((d) => d[0]))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(regions, (d) => d[1]) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg
      .selectAll("rect")
      .data(regions)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d[0]))
      .attr("y", height - margin.bottom)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("fill", "#0ea5e9")
      .style("cursor", "pointer")
      .transition()
      .duration(900)
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => height - margin.bottom - y(d[1]));

    svg
      .selectAll("rect")
      .on("mouseover", function (e, d) {
        d3.select(this).attr("fill", "#0369a1");
        tooltip.style("opacity", 1).html(
          `<strong>Region:</strong> ${d[0]}<br/>
           <strong>Records:</strong> ${d[1]}`,
        );
      })
      .on("mousemove", (e) => {
        tooltip
          .style("left", e.pageX + 10 + "px")
          .style("top", e.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", "#0ea5e9");
        tooltip.style("opacity", 0);
      })
      .on("click", (_, d) => {
        onSelectRegion?.((prev) => (prev === d[0] ? null : d[0]));
      });
  }, [data, onSelectRegion]);

  return <svg ref={ref} />;
}

/*Region Card*/

export default function RegionCard({ data }) {
  const totalRecords = data?.length || 0;

  const regionsSet = new Set(data.filter((d) => d.region).map((d) => d.region));
  const totalRegions = regionsSet.size;

  const avgIntensity = d3.mean(data, (d) => Number(d.intensity))?.toFixed(1);

  return (
    <div className="col-12 col-md-6 col-xxl-4 d-flex justify-content-start bg-black p-2">
      <div
        className="card shadow-lg border-0"
        style={{
          maxWidth: "600px",
          background: "linear-gradient(135deg, #082f49, #0ea5e9)",
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
            <FaMapMarkedAlt size={28} className="fs-2" />
            Region Distribution
          </h3>
        </div>

        {/* Chart */}
        <div className="card-body">
          <div className="mb-3 d-flex justify-content-start">
            <RegionChart data={data} />
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
              <FaDatabase size={20} className="mb-1" />
              <span className="fw-bold">Records:</span>
              <span className="fs-5">{totalRecords}</span>
            </div>

            {/* Avg Intensity */}
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
              <FaLayerGroup size={20} className="mb-1" />
              <span className="fw-bold">Avg Intensity:</span>
              <span className="fs-5">{avgIntensity || "N/A"}</span>
            </div>

            {/* Regions */}
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
              <FaMapMarkedAlt size={20} className="mb-1" />
              <span className="fw-bold">Regions:</span>
              <span className="fs-5">{totalRegions}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
