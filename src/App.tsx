import React from "react";
import {
  Sigma,
  LoadJSON,
  ForceAtlas2,
  RandomizeNodePositions,
  RelativeSize,
} from "react-sigma";

function App() {
  const height = document.body.clientHeight;

  return (
    <div>
      <Sigma
        style={{ height }}
        renderer="canvas"
        settings={{
          drawEdges: true,
          clone: false,
          defaultEdgeColor: "rgba(0, 0, 0, 0.1)",
          edgeColor: "default",
          defaultEdgeType: "arrow",
          minArrowSize: 5,
        }}
      >
        <LoadJSON path="/data.json">
          <RelativeSize initialSize={100} />
          <RandomizeNodePositions />
          <ForceAtlas2 />
        </LoadJSON>
      </Sigma>
    </div>
  );
}

export default App;
