import React, {
  useRef,
  useEffect,
  useState,
  useLayoutEffect,
  useMemo,
} from "react";

import { WebGLRenderer } from "sigma";
import { DirectedGraph } from "graphology";
import randomLayout from "graphology-layout/random";
import forceAtlas2 from "graphology-layout-forceatlas2";

import graphData from "./data/graph.json";

import FloatingBox from "./components/FloatingBox";

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderer, setRenderer] = useState<WebGLRenderer | null>(null);

  const defaultEdgeColor = "rgba(100, 100, 100, 0.5)";
  const defaultNodeColor = "rgba(100, 100, 100)";

  const defaultEdgeSize = 2.5;
  const activeEdgeSize = 3.5;

  const graph = useMemo(() => {
    const g = new DirectedGraph();
    for (const node of graphData.nodes) {
      g.addNode(node.id, { label: node.label });
    }

    for (const edge of graphData.edges) {
      try {
        g.addEdge(edge.source, edge.target, {
          arrow: "target",
          size: defaultEdgeSize,
        });
      } catch (e: any) {
        continue;
      }
    }

    g.forEachNode((node) => {
      g.updateNodeAttribute(
        node,
        "size",
        () => 2.5 + 0.8 * Math.sqrt(g.outDegree(node))
      );
    });

    randomLayout.assign(g);
    forceAtlas2.assign(g, {
      iterations: 200,
      settings: { gravity: 20 },
    });

    return g;
  }, []);

  useEffect(() => {
    const render = new WebGLRenderer(graph, containerRef.current, {
      defaultEdgeColor,
      defaultEdgeType: "arrow",
      defaultNodeColor,
    });

    render.on("enterNode", (e) => {
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

    render.on("leaveNode", (e) => {
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

    setRenderer(render);
  }, [graph]);

  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useLayoutEffect(() => {
    function updateSize() {
      if (renderer !== null) {
        setSize({ width: window.innerWidth, height: window.innerHeight });
        renderer.resize(window.innerWidth, window.innerHeight);
      }
    }

    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [renderer]);

  return (
    <div>
      <div
        ref={containerRef}
        id="container"
        style={{ width: size.width, height: size.height }}
      />
      <FloatingBox />
    </div>
  );
}

export default App;
