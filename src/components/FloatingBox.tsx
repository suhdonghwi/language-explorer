import React, { useState, useEffect } from "react";
import styled from "styled-components/macro";

import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

import Language from "../types/Language";
import LanguageView from "./LanguageView";
import SearchBox from "./SearchBox";

const Box = styled.div`
  position: absolute;
  top: 50%;
  right: 30px;

  height: 90%;
  width: 330px;

  transform: translate(0, -50%);

  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  background-color: white;

  border-radius: 10px;
  padding: 10px 25px;
  box-sizing: border-box;

  overflow: scroll;
  transition: all 0.5s;

  &.hidden {
    transform: translate(85%, -50%);
  }

  @media screen and (max-width: 520px) {
    width: 310px;
    right: 50%;
    transform: translate(50%, -50%);

    &.hidden {
      transform: translate(140%, -50%);
    }
  }
`;

const Title = styled.h1`
  color: #212529;

  font-size: 1.7rem;
  text-align: center;

  margin: 3rem 0 1.5rem 0;
`;

const Description = styled.p`
  margin: 0.5rem 0;
  color: #343a40;
`;

const TopButton = styled.button`
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
interface FloatingBoxProps {
  lang: Language | null;
  onBack: () => void;
}

export default function FloatingBox({ lang, onBack }: FloatingBoxProps) {
  const [showSidebar, setShowSidebar] = useState(true);

  function onToggleSidebar() {
    setShowSidebar(!showSidebar);
  }

  useEffect(() => {
    setShowSidebar(true);
  }, [lang]);

  const defaultContent = (
    <>
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
      <SearchBox propName="name" propList={["a", "b", "c"]} />
      <SearchBox propName="paradigm" propList={["a", "b", "c"]} />
      <SearchBox propName="typing discipline" propList={["a", "b", "c"]} />
    </>
  );

  return (
    <Box className={showSidebar ? "" : "hidden"}>
      <TopButton onClick={() => (lang === null ? onToggleSidebar() : onBack())}>
        {lang === null ? (
          showSidebar ? (
            <>
              <FaAngleRight /> Hide
            </>
          ) : (
            <>
              <FaAngleLeft /> Show
            </>
          )
        ) : (
          <>
            <FaAngleLeft /> Back
          </>
        )}
      </TopButton>
      {lang === null ? defaultContent : <LanguageView lang={lang} />}
    </Box>
  );
}
