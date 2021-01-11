import React from "react";
import styled from "styled-components/macro";

const Box = styled.div`
  position: absolute;
  top: 50%;
  right: 30px;

  height: 90%;
  width: 300px;

  transform: translate(0, -50%);
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  background-color: white;

  border-radius: 10px;
  padding: 30px 25px;
  box-sizing: border-box;
`;

export default function FloatingBox() {
  return <Box> hello world</Box>;
}
