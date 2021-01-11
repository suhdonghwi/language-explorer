import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import Skeleton from "react-loading-skeleton";

import wiki from "wikijs";

import Language from "../types/Language";

const LangTitle = styled.h1`
  color: #212529;

  font-size: 1.7rem;
  text-align: center;

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

interface LanguageViewProps {
  lang: Language;
}

export default function LanguageView({ lang }: LanguageViewProps) {
  const [summary, setSummary] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
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

    fetch();
  }, [lang]);

  return (
    <>
      <LangTitle>{lang.label}</LangTitle>
      {summary === null ? <Skeleton count={5} /> : <Summary>{summary}</Summary>}
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
  );
}
