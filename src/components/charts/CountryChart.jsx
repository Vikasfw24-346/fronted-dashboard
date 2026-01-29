import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { createTooltip } from "./useTooltip";
import { FaGlobeAsia, FaDatabase, FaLayerGroup } from "react-icons/fa";

/*Country Chart*/

function CountryChart({ data }) {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const tooltip = createTooltip();

    const width = 580;
    const height = 270;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };

    svg.attr("width", width).attr("height", height);

    const countries = d3.rollups(
      data.filter((d) => d.country),
      (v) => v.length,
      (d) => d.country,
    );

    const x = d3
      .scaleBand()
      .domain(countries.map((d) => d[0]))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(countries, (d) => d[1]) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg
      .selectAll("rect")
      .data(countries)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d[0]))
      .attr("y", height - margin.bottom)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("fill", "#0ea5e9")
      .transition()
      .duration(900)
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => height - margin.bottom - y(d[1]));

    svg
      .selectAll("rect")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill", "#0369a1");
        tooltip.style("opacity", 1).html(`
            <strong>Country:</strong> ${d[0]}<br/>
            <strong>Records:</strong> ${d[1]}
          `);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", "#0ea5e9");
        tooltip.style("opacity", 0);
      });
  }, [data]);

  return <svg ref={ref} />;
}

/*Country Card*/

export default function CountryCard({ data }) {
  const totalRecords = data?.length || 0;

  const avgRelevance = d3.mean(data, (d) => Number(d.relevance))?.toFixed(1);

  const uniqueCountries = new Set(
    data.filter((d) => d.country).map((d) => d.country),
  ).size;

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
            <FaGlobeAsia size={28} className="fs-2" />
            Country Distribution
          </h3>
        </div>

        {/* Chart */}
        <div className="card-body">
          <div className="mb-3 d-flex justify-content-start">
            <CountryChart data={data} />
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
              <FaLayerGroup size={20} className="mb-1" />
              <span className="fw-bold">Avg Country:</span>
              <span className="fs-5">{avgRelevance || "N/A"}</span>
            </div>

            {/* Levels / Countries */}
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
              <FaGlobeAsia size={20} className="mb-1" />
              <span className="fw-bold">Countries:</span>
              <span className="fs-5">{uniqueCountries}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
