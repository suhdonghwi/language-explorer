import React, { useRef, useEffect } from "react";

import { WebGLRenderer } from "sigma";
import { DirectedGraph } from "graphology";
import randomLayout from "graphology-layout/random";
import forceAtlas2 from "graphology-layout-forceatlas2";

import graphData from "./data/graph.json";

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  const graph = new DirectedGraph();
  for (const node of graphData.nodes) {
    graph.addNode(node.id, { label: node.label });
  }

  for (const edge of graphData.edges) {
    try {
      graph.addEdge(edge.source, edge.target, { arrow: "target" });
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

  const defaultEdgeColor = "rgba(100, 100, 100, 0.5)";

  useEffect(() => {
    const renderer = new WebGLRenderer(graph, containerRef.current, {
      defaultEdgeColor,
      defaultEdgeType: "arrow",
    });

    renderer.on("enterNode", (e) => {
      for (const edge of graph.inEdges(e.node)) {
        graph.updateEdgeAttribute(edge, "color", () => "#f00");
      }
    });

    renderer.on("leaveNode", (e) => {
      for (const edge of graph.inEdges(e.node)) {
        graph.updateEdgeAttribute(edge, "color", () => defaultEdgeColor);
      }
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
