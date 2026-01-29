import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { createTooltip } from "./useTooltip";
import { FaTags, FaDatabase, FaHashtag } from "react-icons/fa";

/*Topic Chart*/

function TopicChart({ data }) {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const tooltip = createTooltip();

    const width = 580;
    const height = 270;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };

    svg.attr("width", width).attr("height", height);

    const topics = d3.rollups(
      data.filter((d) => d.topic),
      (v) => v.length,
      (d) => d.topic,
    );

    const x = d3
      .scaleBand()
      .domain(topics.map((d) => d[0]))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(topics, (d) => d[1]) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg
      .selectAll("rect")
      .data(topics)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d[0]))
      .attr("y", height - margin.bottom)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("fill", "#f97316")
      .transition()
      .duration(800)
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => height - margin.bottom - y(d[1]));

    svg
      .selectAll("rect")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill", "#c2410c");
        tooltip.style("opacity", 1).html(`
            <strong>Topic:</strong> ${d[0]}<br/>
            <strong>Records:</strong> ${d[1]}
          `);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", "#f97316");
        tooltip.style("opacity", 0);
      });
  }, [data]);

  return <svg ref={ref} />;
}

/*Topic Card*/

export default function TopicCard({ data }) {
  const totalRecords = data?.length || 0;

  const topicsMap = d3.group(data, (d) => d.topic);
  const uniqueTopics = topicsMap.size;

  const topTopic = [...topicsMap.entries()].sort(
    (a, b) => b[1].length - a[1].length,
  )[0]?.[0];

  return (
    <div className="col-12 col-md-6 col-xxl-4 d-flex justify-content-start bg-black p-2">
      <div
        className="card shadow-lg border-0"
        style={{
          maxWidth: "600px",
          background: "linear-gradient(135deg, #7c2d12, #f97316)",
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
            <FaTags size={28} className="fs-4" />
            Topic Distribution
          </h3>
        </div>

        {/* Chart */}
        <div className="card-body">
          <div className="mb-3 d-flex justify-content-start">
            <TopicChart data={data} />
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

            {/* Unique Topics */}
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
              <FaHashtag size={20} className="mb-1" />
              <span className="fw-bold">Topics:</span>
              <span className="fs-5">{uniqueTopics}</span>
            </div>

            {/* Top Topic */}
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
              <FaTags size={20} className="mb-1" />
              <span className="fw-bold">Top Topic:</span>
              <span className="fs-6 text-center">{topTopic || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
