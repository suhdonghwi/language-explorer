import React from "react";
import { Sigma, SigmaEnableWebGL, RandomizeNodePositions, RelativeSize } from "react-sigma";

function App() {
  let myGraph = {
    nodes: [
      { id: "n1", label: "Alice" },
      { id: "n2", label: "Rabbit" },
    ],
    edges: [{ id: "e1", source: "n1", target: "n2", label: "SEES" }],
  };

  const height = document.body.clientHeight;

  return (
    <div>
      <Sigma
        graph={myGraph}
        style={{ height }}
        settings={{ drawEdges: true, clone: false }}
      >
        <RelativeSize initialSize={15} />
        <RandomizeNodePositions />
      </Sigma>
    </div>
  );
}

export default App;
