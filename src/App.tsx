import React, {
  useRef,
  useEffect,
  useState,
  useLayoutEffect,
  useMemo,
} from "react";

import { WebGLRenderer } from "sigma";
import { DirectedGraph } from "graphology";

import Layout from "./types/Layout";
import Option from "./types/Option";

import randomLayout from "graphology-layout/random";
import forceAtlas2 from "graphology-layout-forceatlas2";
import noverlap from "graphology-layout-noverlap";

import graphData from "./data/graph.json";

import Language from "./types/Language";
import FloatingBox from "./components/FloatingBox";

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderer, setRenderer] = useState<WebGLRenderer | null>(null);

  const [lang, setLang] = useState<Language | null>(null);
  const [layout, setLayout] = useState<Option<Layout>>({
    label: "Web",
    value: "web",
  });

  const defaultEdgeColor = "rgba(100, 100, 100, 0.5)";
  const defaultNodeColor = "rgba(100, 100, 100)";

  const defaultEdgeSize = 2.5;
  const activeEdgeSize = 4;

  const graph = useMemo(() => new DirectedGraph(), []);
  const [webLayout, setWebLayout] = useState<Record<
    string,
    { x: number; y: number }
  > | null>(null);

  useEffect(() => {
    graph.clear();
    graph.clearEdges();

    for (const node of graphData.nodes) {
      graph.addNode(node.id, {
        label: node.label,
        appeared: node.appeared,
      });
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

    for (const node of graphData.nodes) {
      graph.setNodeAttribute(
        node.id,
        "size",
        2.5 + 0.8 * Math.sqrt(graph.outDegree(node.id))
      );
    }

    if (layout.value === "web") {
      if (webLayout === null) {
        randomLayout.assign(graph);

        forceAtlas2.assign(graph, {
          iterations: 100,
          settings: { gravity: 5, barnesHutOptimize: true, adjustSizes: true },
        });
        noverlap.assign(graph, {
          maxIterations: 100,
        });

        const layout: Record<string, { x: number; y: number }> = {};
        graph.forEachNode((node) => {
          layout[node] = {
            x: graph.getNodeAttribute(node, "x"),
            y: graph.getNodeAttribute(node, "y"),
          };
        });
        setWebLayout(layout);
      } else {
        for (const key in webLayout) {
          graph.setNodeAttribute(key, "x", webLayout[key].x);
          graph.setNodeAttribute(key, "y", webLayout[key].y);
        }
      }
    } else {
      const nodeMap: Record<number, string[]> = {};

      graph.forEachNode((node) => {
        const appeared = graph.getNodeAttribute(node, "appeared");
        if (appeared === undefined) {
          graph.dropNode(node);
        } else {
          const year = parseInt(appeared.split(".")[0]);

          if (nodeMap[year] !== undefined) {
            nodeMap[year].push(node);
          } else {
            nodeMap[year] = [node];
          }
        }
      });

      for (const year in nodeMap) {
        const nodes = nodeMap[year];
        const sorted = nodes.sort(
          (a, b) => graph.outDegree(b) - graph.outDegree(a)
        );

        sorted.forEach((node, i) => {
          if (layout.value === "timeLR") {
            const x = parseInt(year),
              y = i % 2 === 0 ? i / 2 : -(i + 1) / 2;
            graph.setNodeAttribute(node, "x", x);
            graph.setNodeAttribute(node, "y", y * 2);
          } else {
            const x = i % 2 === 0 ? i / 2 : -(i + 1) / 2,
              y = -parseInt(year);
            graph.setNodeAttribute(node, "x", x * 2);
            graph.setNodeAttribute(node, "y", y);
          }
        });
      }
    }
  }, [graph, layout, webLayout]);

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

    render.on("clickNode", (e) => {
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

  function onSearch(id: string) {
    const lang = graphData.nodes.find((v) => v.id === id);
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
        layout={layout}
        onChangeLayout={(v) => setLayout(v)}
      />
    </div>
  );
}

export default App;
