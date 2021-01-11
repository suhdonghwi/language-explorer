import React, { useState, useEffect } from "react";
import styled from "styled-components/macro";

import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";

import wiki from "wikijs";

import Language from "../types/Language";

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

const LangTitle = styled(Title)`
  font-size: 1.7rem;
  margin: 3rem 0 0.5rem 0;
`;

const LangTable = styled.table`
  border-spacing: 0 1rem;
`;

const LangTableRow = styled.tr``;

const LangTableProp = styled.td`
  font-weight: bold;
  text-align: center;

  color: #343a40;
`;

const LangTableValue = styled.td`
  padding-left: 20px;

  color: #495057;
`;

const LangLink = styled.a`
  word-break: break-all;
  color: #228be6;
`;

const Summary = styled.p`
  color: #868e96;
  font-style: italic;

  margin: 1.2rem 0 0.5rem 0;
`;

interface FloatingBoxProps {
  lang: Language | null;
  onBack: () => void;
}

export default function FloatingBox({ lang, onBack }: FloatingBoxProps) {
  const [showSidebar, setShowSidebar] = useState(true);
  const [summary, setSummary] = useState<string | null>(null);

  function onToggleSidebar() {
    setShowSidebar(!showSidebar);
  }

  useEffect(() => {
    setShowSidebar(true);

    async function fetch() {
      if (lang !== null) {
        setSummary(null);

        const page = await wiki({
          apiUrl: "https://en.wikipedia.org/w/api.php",
        }).findById(lang.id);
        let summary = await page.summary();
        summary = summary.replaceAll("()", "");

        setSummary(
          summary.slice(0, 200).concat(summary.length > 100 ? "..." : "")
        );
      }
    }

    fetch();
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
    </>
  );

  const languageContent =
    lang !== null ? (
      <>
        <LangTitle>{lang.label}</LangTitle>
        {summary === null ? (
          <Skeleton count={5} />
        ) : (
          <Summary>{summary}</Summary>
        )}
        <LangTable>
          <tbody>
            {lang.paradigm && (
              <LangTableRow>
                <LangTableProp>Paradigm</LangTableProp>
                <LangTableValue>{lang.paradigm.join(", ")}</LangTableValue>
              </LangTableRow>
            )}

            {lang.typing && (
              <LangTableRow>
                <LangTableProp>Type</LangTableProp>
                <LangTableValue>{lang.typing.join(", ")}</LangTableValue>
              </LangTableRow>
            )}

            {lang.appeared && (
              <LangTableRow>
                <LangTableProp>Appeared</LangTableProp>
                <LangTableValue>
                  {lang.appeared.replaceAll("-", ".")}
                </LangTableValue>
              </LangTableRow>
            )}

            {lang.website && (
              <LangTableRow>
                <LangTableProp>Website</LangTableProp>
                <LangTableValue>
                  <LangLink href={lang.website}>{lang.website}</LangLink>
                </LangTableValue>
              </LangTableRow>
            )}

            <LangTableRow>
              <LangTableProp>Wikipedia</LangTableProp>
              <LangTableValue>
                <LangLink href={"http://en.wikipedia.org/?curid=" + lang.id}>
                  Visit
                </LangLink>
              </LangTableValue>
            </LangTableRow>
          </tbody>
        </LangTable>
      </>
    ) : null;

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
      {lang === null ? defaultContent : languageContent}
    </Box>
  );
}
