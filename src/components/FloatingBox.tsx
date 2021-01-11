import React, { useState } from "react";
import styled from "styled-components/macro";

import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

const Box = styled.div`
  position: absolute;
  top: 50%;
  right: 30px;

  height: 90%;
  width: 330px;

  transform: translate(0, -50%);
  transition: transform 0.5s;

  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  background-color: white;

  border-radius: 10px;
  padding: 10px 25px;
  box-sizing: border-box;

  &.hidden {
    transform: translate(85%, -50%);
  }
`;

const Title = styled.h1`
  color: #212529;

  font-size: 1.4rem;
  text-align: center;

  margin: 3rem 0 1.5rem 0;
`;

const Description = styled.p`
  margin: 0.5rem 0;
  color: #343a40;
`;

const ShowHideButton = styled.button`
  display: flex;
  align-items: center;

  position: absolute;
  top: 10px;
  left: 10px;

  appearance: none;
  border: none;
  background: none;

  padding: 0;
  font-size: 1.1rem;
  color: #adb5bd;

  cursor: pointer;
`;

export default function FloatingBox() {
  const [showSidebar, setShowSidebar] = useState(true);

  function onToggleSidebar() {
    setShowSidebar(!showSidebar);
  }

  return (
    <Box className={showSidebar ? "" : "hidden"}>
      <ShowHideButton onClick={onToggleSidebar}>
        {showSidebar ? (
          <>
            <FaAngleRight /> Hide
          </>
        ) : (
          <>
            <FaAngleLeft /> Show
          </>
        )}
      </ShowHideButton>
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
