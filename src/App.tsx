import React, { useRef, useEffect } from "react";

import { WebGLRenderer } from "sigma";
import { DirectedGraph } from "graphology";
import randomLayout from "graphology-layout/random";

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

  randomLayout.assign(graph);

  useEffect(() => {
    const renderer = new WebGLRenderer(graph, containerRef.current, {
      defaultEdgeType: "arrow",
    });
    renderer.on("enterNode", (e) => {
      for (const edge of graph.inEdges(e.node)) {
        console.log(edge);
        graph.updateEdgeAttribute(edge, "color", () => "#f00");
      }
      console.log("wow");
    });
    console.log(renderer.settings);
  });

  const height = document.body.clientHeight;
  return (
    <div>
      <div ref={containerRef} id="container" style={{ height }} />
    </div>
  );
}

export default App;
