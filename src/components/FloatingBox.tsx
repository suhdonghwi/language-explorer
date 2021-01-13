import React, { useState, useEffect } from "react";
import styled from "styled-components/macro";

import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

import Language from "../types/Language";
import LanguageView from "./LanguageView";
import SearchBox from "./SearchBox";

import Option from "../types/Option";

import graphData from "../data/graph.json";

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
  onBack(): void;
  onSearch(s: string): void;
  onHighlight(v: string[]): void;
}

export default function FloatingBox({
  lang,
  onBack,
  onSearch,
  onHighlight,
}: FloatingBoxProps) {
  const [showSidebar, setShowSidebar] = useState(true);

  function onToggleSidebar() {
    setShowSidebar(!showSidebar);
  }

  useEffect(() => {
    setShowSidebar(true);
  }, [lang]);

  const languageList = new Set<Option>();
  const paradigmList = new Set<Option>();
  const typingList = new Set<Option>();

  for (const lang of graphData.nodes) {
    languageList.add({ label: lang.label, value: lang.id });

    if (lang.paradigm !== undefined) {
      for (const p of lang.paradigm) paradigmList.add({ label: p, value: p });
    }

    if (lang.typing !== undefined) {
      for (const t of lang.typing) typingList.add({ label: t, value: t });
    }
  }

  function onSearchLanguage() {
    if (language === null) return;
    onSearch(language.value);
  }

  function onChangeParadigm(paradigm: Option[]) {
    setParadigm(paradigm);
    setTyping([]);

    const result = [];
    for (const p of paradigm) {
      result.push(
        ...graphData.nodes
          .filter(
            (n) => n.paradigm !== undefined && n.paradigm.includes(p.label)
          )
          .map((n) => n.id)
      );
    }

    onHighlight(result);
  }

  function onChangeTyping(typing: Option[]) {
    setTyping(typing);
    setParadigm([]);

    const result = [];
    for (const t of typing) {
      result.push(
        ...graphData.nodes
          .filter((n) => n.typing !== undefined && n.typing.includes(t.label))
          .map((n) => n.id)
      );
    }

    onHighlight(result);
  }

  const [language, setLanguage] = useState<Option | null>(null);
  const [paradigm, setParadigm] = useState<Option[]>([]);
  const [typing, setTyping] = useState<Option[]>([]);

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
      <SearchBox
        propName="name"
        options={languageList}
        isMulti={false}
        selected={language}
        onChange={(v) => setLanguage(v)}
        onSearch={onSearchLanguage}
      />
      <SearchBox
        propName="paradigm"
        options={paradigmList}
        isMulti={true}
        selected={paradigm}
        onChange={onChangeParadigm}
      />
      <SearchBox
        propName="typing discipline"
        options={typingList}
        isMulti={true}
        selected={typing}
        onChange={onChangeTyping}
      />
    </>
  );

  return (
    <Box className={showSidebar ? "" : "hidden"}>
      <TopButton onClick={() => (lang === null ? onToggleSidebar() : onBack())}>
        {lang === null ? (
          showSidebar ? (
            <div>
              <FaAngleRight /> Hide
            </div>
          ) : (
            <div>
              <FaAngleLeft /> Show
            </div>
          )
        ) : (
          <div>
            <FaAngleLeft /> Back
          </div>
        )}
      </TopButton>
      {lang === null ? defaultContent : <LanguageView lang={lang} />}
    </Box>
  );
}
