// https://github.com/erikbrinkman/d3-dag
// https://erikbrinkman.github.io/d3-dag/
// https://codepen.io/brinkbot/pen/oNZJXqK
import { useEffect } from "react";

import Logo from "./Logo";
import {
  layeringChoices,
  spacingChoices,
  splineChoices,
  useDagContext,
} from "./hooks/useDag";

const d3 = window.d3;

type D3node = {
  data: {
    id: number;
  };
  DataChildren: Array<Object>;
  x?: number;
  y?: number;
};
type D3point = {
  x: number;
  y: number;
};

interface DagProps {}
const Dag: React.FC<DagProps> = () => {
  const {
    activeLayeringIndex,
    activeSpacingIndex,
    activeSplineIndex,
    dagData,
  } = useDagContext();
  const data = dagData;
  const layering = layeringChoices[activeLayeringIndex].layering;
  const spacing = spacingChoices[activeSpacingIndex].name;
  const spline = splineChoices[activeSplineIndex].spline;
  const areArrowsShown = splineChoices[activeSplineIndex].areArrowsShown;

  useEffect(() => {
    const dag = d3.dagStratify()(data);
    const nodeRadius = 30;
    const nodeSpacingDefault = () => [
      1.2 * nodeRadius * 2 * 1.5,
      nodeRadius * 2 * 1.5,
    ];
    const nodeSpacingCompact = (node: D3node) => [
      (node ? 3.6 : 0.25) * nodeRadius,
      3 * nodeRadius,
    ];
    const layout = d3
      .sugiyama() // base layout
      .layering(layering)
      .decross(d3.decrossOpt()) // minimize number of crossings
      .nodeSize(
        spacing === "Compact" ? nodeSpacingCompact : nodeSpacingDefault
      );
    const { width, height } = layout(dag);

    // --------------------------------
    // This code only handles rendering
    // --------------------------------
    const svgSelection = d3.select("svg");
    svgSelection.attr("viewBox", [0, 0, width, height].join(" "));
    const defs = svgSelection.append("defs"); // For gradients

    // How to draw edges
    const line = d3
      .line()
      .curve(spline)
      .x((d: D3point) => d.x)
      .y((d: D3point) => d.y);

    // clean-up (for re-renders)
    svgSelection.selectAll("g").remove();
    svgSelection.selectAll("path").remove();

    // Plot edges
    svgSelection
      .append("g")
      .selectAll("path")
      .data(dag.links())
      .enter()
      .append("path")
      .attr("d", ({ points }: { points: D3point[] }) => line(points))
      .attr("fill", "none")
      .attr("stroke-width", 3)
      .attr(
        "stroke",
        ({ source, target }: { source: D3node; target: D3node }) => {
          const gradId = encodeURIComponent(
            `${source.data.id}--${target.data.id}`
          );
          const grad = defs
            .append("linearGradient")
            .attr("id", gradId)
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", source.x)
            .attr("x2", target.x)
            .attr("y1", source.y)
            .attr("y2", target.y);
          grad
            .append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#4e3e80");
          grad
            .append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#1a0d36");
          return `url(#${gradId})`;
        }
      );

    // Select nodes
    const nodes = svgSelection
      .append("g")
      .selectAll("g")
      .data(dag.descendants())
      .enter()
      .append("g")
      .attr(
        "transform",
        ({ x, y }: { x: number; y: number }) => `translate(${x}, ${y})`
      );

    // Plot node circles
    nodes.append("circle").attr("r", nodeRadius).attr("fill", "#4e3e80");

    if (areArrowsShown) {
      const arrowSize = (nodeRadius * nodeRadius) / 20.0;
      const arrowLen = Math.sqrt((4 * arrowSize) / Math.sqrt(3));
      const arrow = d3.symbol().type(d3.symbolTriangle).size(arrowSize);
      svgSelection
        .append("g")
        .selectAll("path")
        .data(dag.links())
        .enter()
        .append("path")
        .attr("d", arrow)
        .attr(
          "transform",
          ({
            source,
            target,
            points,
          }: {
            source: D3node;
            target: D3node;
            points: D3point[];
          }) => {
            const [end, start] = points.slice().reverse();
            // This sets the arrows the node radius (20) + a little bit (3) away from the node center, on the last line segment of the edge. This means that edges that only span ine level will work perfectly, but if the edge bends, this will be a little off.
            const dx = start.x - end.x;
            const dy = start.y - end.y;
            const scale = (nodeRadius * 1.15) / Math.sqrt(dx * dx + dy * dy);
            // This is the angle of the last line segment
            const angle = (Math.atan2(-dy, -dx) * 180) / Math.PI + 90;
            return `translate(${end.x + dx * scale}, ${
              end.y + dy * scale
            }) rotate(${angle})`;
          }
        )
        // .attr("fill", ({ target }) => colorMap[target.data.id])
        .attr("fill", "#4e3e80")
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", `${arrowLen},${arrowLen}`);
    }

    // Add text to nodes
    nodes
      .append("text")
      .text((d: D3node) => d.data.id)
      .style("dominant-baseline", "central")
      .attr("font-weight", "bold")
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("fill", "white");
  }, [areArrowsShown, data, layering, spacing, spline]);
  // return <svg className="dag-svg"></svg>;
  return (
    <div className="dag-svg-container">
      <svg className="dag-svg"></svg>
      <Logo />
    </div>
  );
};

export default Dag;
