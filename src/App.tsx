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

import Language from "./types/Language";
import FloatingBox from "./components/FloatingBox";

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderer, setRenderer] = useState<WebGLRenderer | null>(null);

  const [lang, setLang] = useState<Language | null>(null);

  const defaultEdgeColor = "rgba(100, 100, 100, 0.5)";
  const defaultNodeColor = "rgba(100, 100, 100)";

  const defaultEdgeSize = 2.5;
  const activeEdgeSize = 4;

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

  let highlightNode = useMemo(() => new Set<string>(), []);

  useEffect(() => {
    let influencedBy = new Set<string>();
    let influencedByNode = new Set<string>();

    let influencedTo = new Set<string>();
    let influencedToNode = new Set<string>();

    let currentNode: string | null = null;

    const edgeReducer = (edge: string, data: any) => {
      if (influencedBy.has(edge)) {
        return { ...data, color: "#ff8787", size: activeEdgeSize };
      } else if (influencedTo.has(edge)) {
        return { ...data, color: "#4dabf7", size: activeEdgeSize };
      } else {
        return { ...data, color: defaultEdgeColor, size: defaultEdgeSize };
      }
    };

    const nodeReducer = (node: string, data: any) => {
      if (highlightNode.size > 0) {
        if (highlightNode.has(node))
          return {
            ...data,
            color: "#20c997",
            size: Math.max(data.size + 1, 4),
          };
        else return { ...data, color: defaultEdgeColor };
      } else if (node === currentNode) {
        return { ...data, color: "#20c997" };
      } else if (influencedByNode.has(node)) {
        return { ...data, color: "#ff6b6b" };
      } else if (influencedToNode.has(node)) {
        return { ...data, color: "#339af0" };
      } else {
        return { ...data, color: defaultNodeColor };
      }
    };

    const render = new WebGLRenderer(graph, containerRef.current, {
      defaultEdgeColor,
      defaultEdgeType: "arrow",
      defaultNodeColor,
      edgeReducer,
      nodeReducer,
    });

    render.on("enterNode", (e) => {
      document.body.style.cursor = "pointer";

      influencedBy.clear();
      influencedByNode.clear();
      for (const edge of graph.inEdges(e.node)) {
        influencedBy.add(edge);
        influencedByNode.add(graph.source(edge));
      }

      influencedTo.clear();
      influencedToNode.clear();
      for (const edge of graph.outEdges(e.node)) {
        influencedTo.add(edge);
        influencedToNode.add(graph.target(edge));
      }

      currentNode = e.node;

      render.refresh();
    });

    render.on("leaveNode", () => {
      document.body.style.cursor = "default";

      influencedTo.clear();
      influencedToNode.clear();

      influencedBy.clear();
      influencedByNode.clear();

      currentNode = null;

      render.refresh();
    });

    render.on("downNode", (e) => {
      const lang: Language = graphData.nodes.find(
        ({ id }) => id === e.node.toString()
      )!;
      setLang(lang);
    });

    setRenderer(render);
  }, [graph, highlightNode]);

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

  function onSearch(name: string) {
    const lang = graphData.nodes.find((v) => v.label === name);
    if (lang === undefined || renderer === null) return;

    setLang(lang);
  }

  function onHighlight(target: string[]) {
    highlightNode.clear();
    for (const t of target) {
      highlightNode.add(t);
    }

    if (renderer !== null) renderer.refresh();
  }

  return (
    <div>
      <div
        ref={containerRef}
        id="container"
        style={{ width: size.width, height: size.height }}
      />
      <FloatingBox
        lang={lang}
        onBack={() => setLang(null)}
        onSearch={onSearch}
        onHighlight={onHighlight}
      />
    </div>
  );
}

export default App;
