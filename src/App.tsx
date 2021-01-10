import React from "react";
import {
  Sigma,
  SigmaEnableWebGL,
  ForceAtlas2,
  LoadJSON,
  RandomizeNodePositions,
  RelativeSize,
} from "react-sigma";

function App() {
  const height = document.body.clientHeight;

  return (
    <div>
      <Sigma style={{ height }} settings={{ drawEdges: true, clone: false }}>
        <LoadJSON path="/data.json">
          <RelativeSize initialSize={15} />
          <RandomizeNodePositions />
        </LoadJSON>
      </Sigma>
    </div>
  );
}

export default App;
