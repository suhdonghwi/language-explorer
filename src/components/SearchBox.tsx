import React from "react";
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

interface SearchBoxProps<T> {
  title: string;
  options: Set<T>;
  isMulti: boolean;
  isClearable: boolean;

  selected: Option<T> | Option<T>[] | null;
  onChange(v: any): void;
  onSearch?(): void;
}

export default function SearchBox<T>({
  title,
  options,
  isMulti,
  isClearable,
  onChange,
  onSearch,
  selected,
}: SearchBoxProps<T>) {
  return (
    <Box>
      <Title>{title}</Title>
      <InputContainer>
        <SelectContainer>
          <VirtualizedSelect
            multi={isMulti}
            options={Array.from(options).map((v) => ({
              label: (v as unknown) as string,
              value: v,
            }))}
            onChange={onChange}
            value={selected === null ? [] : selected}
            clearable={isClearable}
          />
        </SelectContainer>
        {onSearch && (
          <SearchButton onClick={onSearch}>
            <FaSearch />
          </SearchButton>
        )}
      </InputContainer>
    </Box>
  );
}
