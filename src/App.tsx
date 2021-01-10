import React, { useRef, useEffect } from "react";

import { WebGLRenderer } from "sigma";
import { DirectedGraph } from "graphology";
import randomLayout from "graphology-layout/random";
import forceAtlas2 from "graphology-layout-forceatlas2";

import graphData from "./data/graph.json";

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  const defaultEdgeColor = "rgba(100, 100, 100, 0.5)";
  const defaultNodeColor = "rgba(100, 100, 100)";

  const defaultEdgeSize = 2.5;
  const activeEdgeSize = 3.5;

  const graph = new DirectedGraph();
  for (const node of graphData.nodes) {
    graph.addNode(node.id, { label: node.label });
  }

  for (const edge of graphData.edges) {
    try {
      graph.addEdge(edge.source, edge.target, {
        arrow: "target",
        size: defaultEdgeSize,
      });
    } catch (e: any) {
      continue;
    }
  }

  graph.forEachNode((node) => {
    graph.updateNodeAttribute(
      node,
      "size",
      () => 2.5 + 0.8 * Math.sqrt(graph.outDegree(node))
    );
  });

  randomLayout.assign(graph);
  forceAtlas2.assign(graph, {
    iterations: 200,
    settings: { gravity: 20 },
  });

  useEffect(() => {
    const renderer = new WebGLRenderer(graph, containerRef.current, {
      defaultEdgeColor,
      defaultEdgeType: "arrow",
      defaultNodeColor,
    });

    renderer.on("enterNode", (e) => {
      for (const edge of graph.inEdges(e.node)) {
        graph.updateEdgeAttribute(edge, "color", () => "#ffa8a8");
        graph.updateEdgeAttribute(edge, "size", () => activeEdgeSize);
        graph.updateNodeAttribute(graph.source(edge), "color", () => "#ff6b6b");
      }

      for (const edge of graph.outEdges(e.node)) {
        graph.updateEdgeAttribute(edge, "color", () => "#74c0fc");
        graph.updateEdgeAttribute(edge, "size", () => activeEdgeSize);
        graph.updateNodeAttribute(graph.target(edge), "color", () => "#339af0");
      }

      graph.updateNodeAttribute(e.node, "color", () => "#20c997");
    });

    renderer.on("leaveNode", (e) => {
      for (const edge of graph.inEdges(e.node).concat(graph.outEdges(e.node))) {
        graph.updateEdgeAttribute(edge, "color", () => defaultEdgeColor);
        graph.updateEdgeAttribute(edge, "size", () => defaultEdgeSize);
        graph.updateNodeAttribute(
          graph.source(edge),
          "color",
          () => defaultNodeColor
        );
        graph.updateNodeAttribute(
          graph.target(edge),
          "color",
          () => defaultNodeColor
        );
      }

      graph.updateNodeAttribute(e.node, "color", () => defaultNodeColor);
    });
  });

  const height = document.body.clientHeight;
  return (
    <div>
      <div ref={containerRef} id="container" style={{ height }} />
    </div>
  );
}

export default App;
