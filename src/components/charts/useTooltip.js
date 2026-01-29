import * as d3 from "d3";

export const createTooltip = () => {
  return d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("background", "#111827")
    .style("color", "#fff")
    .style("padding", "8px 12px")
    .style("border-radius", "8px")
    .style("font-size", "12px")
    .style("opacity", 0)
    .style("pointer-events", "none");
};
