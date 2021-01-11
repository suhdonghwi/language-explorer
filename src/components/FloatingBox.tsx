import React from "react";
import styled from "styled-components/macro";

const Box = styled.div`
  position: absolute;
  top: 50%;
  right: 30px;

  height: 90%;
  width: 300px;

  transform: translate(0, -50%);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  background-color: white;

  border-radius: 10px;
  padding: 10px 25px;
  box-sizing: border-box;
`;

const Title = styled.h1`
  color: #212529;

  font-size: 1.4rem;
  text-align: center;

  margin: 1.5rem 0;
`;

const Description = styled.p`
  margin: 0.5rem 0;
  color: #343a40;
`;

export default function FloatingBox() {
  return (
    <Box>
      <Title>🌎 language-explorer</Title>
      <Description>
        Explore 650+ programming languages, visualized based on paradigm
        influence relationships between languages.
      </Description>
      <Description>
        <span style={{ color: "#ff6b6b", fontWeight: "bold" }}>Red line</span>{" "}
        represents "influenced by", and{" "}
        <span style={{ color: "#339af0", fontWeight: "bold" }}>blue line</span>{" "}
        represents "influenced".
      </Description>
    </Box>
  );
}
