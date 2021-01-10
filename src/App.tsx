import React, { useRef, useEffect } from "react";

import { WebGLRenderer } from "sigma";
import { DirectedGraph } from "graphology";
import randomLayout from "graphology-layout/random";

import graphData from "./data/graph.json";

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  const graph = new DirectedGraph();
  for (const node of graphData.nodes) {
    console.log(node.id);
    graph.addNode(node.id, { label: node.label });
  }

  for (const edge of graphData.edges) {
    try {
      graph.addEdge(edge.source, edge.target);
    } catch (e: any) {
      continue;
    }
  }

  useEffect(() => {
    randomLayout.assign(graph);
    const renderer = new WebGLRenderer(graph, containerRef.current);
  });

  const height = document.body.clientHeight / 2;
  return (
    <div>
      <div ref={containerRef} id="container" style={{ height }} />
    </div>
  );
}

export default App;
