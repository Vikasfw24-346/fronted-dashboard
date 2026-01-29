import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { createTooltip } from "./useTooltip";
import { FaDatabase, FaChartLine, FaGlobe } from "react-icons/fa";

/*Country Chart*/

function IntensityChart({ data }) {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const tooltip = createTooltip();
    const width = 590;

    const height = 270;
    const margin = { top: 20, right: 20, bottom: 40, left: 20 };

    svg.attr("width", width).attr("height", height);

    const x = d3
      .scaleBand()
      .domain(data.map((_, i) => i))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => Number(d.intensity)) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (_, i) => x(i))
      .attr("y", height - margin.bottom)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("fill", "url(#barGradient)")
      .transition()
      .duration(800)
      .delay((_, i) => i * 2)
      .attr("y", (d) => y(Number(d.intensity) || 0))
      .attr("height", (d) => {
        const val = Number(d.intensity);
        return isNaN(val) ? 0 : height - margin.bottom - y(val);
      });

    svg
      .selectAll("rect")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill", "#4338ca");
        tooltip.style("opacity", 1).html(`
            <strong>Intensity:</strong> ${d.intensity ?? "N/A"}<br/>
            <strong>Topic:</strong> ${d.topic ?? "N/A"}<br/>
            <strong>Country:</strong> ${d.country ?? "N/A"}
          `);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", "url(#barGradient)");
        tooltip.style("opacity", 0);
      });

    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", "barGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#6366f1");
    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#ffffff");
  }, [data]);

  return <svg ref={ref} />;
}

// IntensityCard
export default function IntensityCard({ data }) {
  const totalRecords = data?.length || 0;
  const meanValue = d3.mean(data, (d) => Number(d.intensity));
  const avgIntensity = meanValue !== undefined ? meanValue.toFixed(1) : "N/A";
  const topCountry =
    data && data.length > 0 ? d3.group(data, (d) => d.country) : new Map();
  const countriesCount = topCountry.size;

  return (
    <div className="col-12 col-md-6 col-xxl-4 d-flex justify-content-start bg-black p-2">
      <div
        className="card shadow-lg border-0"
        style={{
          maxWidth: "600px",
          background: "linear-gradient(135deg, #2a2a2a, #3b82f6)",
          color: "#fff",
          backdropFilter: "blur(6px)",
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
            <FaChartLine size={28} className="fs-4" /> {/* larger icon */}
            Intensity Status
          </h3>
        </div>

        {/* Chart */}
        <div className="card-body">
          <div className="mb-3 d-flex justify-content-start">
            <IntensityChart data={data} />
          </div>

          {/* Stats section */}
          <div className="d-flex justify-content-around align-items-center mt-3">
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
              <span className="fw-bold"> Total Records: </span>
              <span className="fs-5">{totalRecords}</span>
            </div>

            {/* Average Intensity */}
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
              <FaChartLine size={20} className="mb-1" />

              <span className="fw-bold bg-gradient"> Average Intensity: </span>
              <span className="fs-5">{avgIntensity}</span>
            </div>

            {/* Countries */}
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
              <FaGlobe size={20} className="mb-1" />
              <span className="fw-bold"> Countries: </span>
              <span className="fs-5">{countriesCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
