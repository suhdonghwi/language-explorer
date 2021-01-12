import React, { useState } from "react";
import styled from "styled-components/macro";

import { FaSearch } from "react-icons/fa";

import "react-select/dist/react-select.css";
import "react-virtualized/styles.css";
import "react-virtualized-select/styles.css";

import VirtualizedSelect from "react-virtualized-select";
import Option from "../types/Option";

const Box = styled.div`
  margin: 2rem 0;
`;

const Title = styled.h2`
  color: #495057;
  font-size: 1.2rem;
`;

const InputContainer = styled.div`
  display: flex;
`;

const SelectContainer = styled.div`
  flex: 1;
  margin-right: 10px;
`;

const SearchButton = styled.button`
  appearance: none;
  border: none;
  cursor: pointer;

  background-color: #4dabf7;
  font-size: 1rem;
  color: white;
  border-radius: 3px;

  padding: 6px 8px 2px 7px;
`;

interface SearchBoxProps {
  propName: string;
  propList: string[];
  isMulti: boolean;

  selected: Option | Option[] | null;
  onChange(v: any): void;
  onSearch?(): void;
}

export default function SearchBox({
  propName,
  propList,
  isMulti,
  onChange,
  onSearch,
  selected,
}: SearchBoxProps) {
  return (
    <Box>
      <Title>Search by {propName}</Title>
      <InputContainer>
        <SelectContainer>
          <VirtualizedSelect
            multi={isMulti}
            options={propList.map((v) => ({ value: v, label: v }))}
            onChange={onChange}
            value={selected === null ? [] : selected}
          />
        </SelectContainer>
        {!isMulti && (
          <SearchButton onClick={onSearch}>
            <FaSearch />
          </SearchButton>
        )}
      </InputContainer>
    </Box>
  );
}
