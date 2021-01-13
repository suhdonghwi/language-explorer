import React, { useState, useEffect } from "react";
import styled from "styled-components/macro";

import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

import Language from "../types/Language";
import LanguageView from "./LanguageView";
import SearchBox from "./SearchBox";
import Layout from "../types/Layout";

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

  layout: Option<Layout>;
  onChangeLayout(v: Option<Layout>): void;
}

export default function FloatingBox({
  lang,
  onBack,
  onSearch,
  onHighlight,
  layout,
  onChangeLayout,
}: FloatingBoxProps) {
  const [showSidebar, setShowSidebar] = useState(true);

  function onToggleSidebar() {
    setShowSidebar(!showSidebar);
  }

  useEffect(() => {
    setShowSidebar(true);
  }, [lang]);

  const languageList = new Set<string>();
  const paradigmList = new Set<string>();
  const typingList = new Set<string>();
  const layoutList = new Set<Layout>([
    "Timeline (Up-down)",
    "Timeline (Left-right)",
    "Web",
  ]);

  for (const lang of graphData.nodes) {
    languageList.add(lang.label);

    if (lang.paradigm !== undefined) {
      for (const p of lang.paradigm) paradigmList.add(p);
    }

    if (lang.typing !== undefined) {
      for (const t of lang.typing) typingList.add(t);
    }
  }

  function onSearchLanguage() {
    if (language === null) return;
    onSearch(language.value);
  }

  function onChangeParadigm(paradigm: Option<string>[]) {
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

  function onChangeTyping(typing: Option<string>[]) {
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

  const [language, setLanguage] = useState<Option<string> | null>(null);
  const [paradigm, setParadigm] = useState<Option<string>[]>([]);
  const [typing, setTyping] = useState<Option<string>[]>([]);

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
        title="Layout"
        options={layoutList}
        isMulti={false}
        isClearable={false}
        selected={layout}
        onChange={(v) => onChangeLayout(v)}
      />
      <SearchBox
        title="Search by name"
        options={languageList}
        isMulti={false}
        isClearable={true}
        selected={language}
        onChange={(v) => setLanguage(v)}
        onSearch={onSearchLanguage}
      />
      <SearchBox
        title="Search by paradigm"
        options={paradigmList}
        isMulti={true}
        isClearable={true}
        selected={paradigm}
        onChange={onChangeParadigm}
      />
      <SearchBox
        title="Search by typing discipline"
        options={typingList}
        isMulti={true}
        isClearable={true}
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
