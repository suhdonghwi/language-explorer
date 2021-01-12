import React from "react";
import styled from "styled-components/macro";

import { FaSearch } from "react-icons/fa";

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

const SearchInput = styled.input`
  flex: 1;

  appearance: none;
  border: 1px solid #ced4da;
  border-radius: 3px;

  margin-right: 0.3rem;

  font-size: 1.1rem;
  padding: 0.3rem 0.5rem;
  box-sizing: border-radius;

  color: #343a40;
`;

const SearchButton = styled.button`
  appearance: none;
  border: none;
  cursor: pointer;

  background-color: #4dabf7;
  font-size: 1rem;
  color: white;
  border-radius: 3px;

  padding: 3px 7px 0 7px;
`;

interface SearchBoxProps {
  propName: string;
  propList: string[];
}

export default function SearchBox({ propName, propList }: SearchBoxProps) {
  return (
    <Box>
      <Title>Search by {propName}</Title>
      <InputContainer>
        <SearchInput type="input" list="suggestions" />
        <datalist id="suggestions">
          {propList.map((s) => (
            <option value={s} />
          ))}
        </datalist>

        <SearchButton>
          <FaSearch />
        </SearchButton>
      </InputContainer>
    </Box>
  );
}
