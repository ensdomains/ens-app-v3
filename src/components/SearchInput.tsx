import { useGetDomainFromInput } from "@app/hooks/useGetDomainFromInput";
import { useInitial } from "@app/hooks/useInitial";
import {
  Box,
  IconArrowCircle,
  IconCancelCircle,
  Input,
  Spinner,
  vars,
} from "@ensdomains/thorin";
import debounce from "lodash/debounce";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled from "styled-components";

const SearchArrowButton = styled(Box)<{ danger?: boolean }>`
  transition: all 0.15s ease-in-out;
  cursor: pointer;
  color: ${({ danger }) => (danger ? vars.colors.red : vars.colors.accent)};
  width: ${vars.space["7"]};
  height: ${vars.space["7"]};
  margin-right: ${vars.space["2"]};
  &:hover {
    filter: brightness(1.05);
    transform: translateY(-1px);
  }
`;

const setSearchedVal = debounce(
  (input: string, setFunc: (input: string) => void) => setFunc(input),
  500
);

export const SearchInput = () => {
  const initial = useInitial();
  const [searchedVal, _setSearchedVal] = useState("");
  const [inputVal, setInputVal] = useState("");
  const { domain, valid, loading } = useGetDomainFromInput(searchedVal);

  useEffect(() => {
    if (!initial) {
      setSearchedVal(inputVal, _setSearchedVal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputVal]);

  const SuffixElement = () => {
    if (domain && domain.name && searchedVal === inputVal && !loading) {
      if (valid && domain.state === "Owned") {
        return (
          <Link
            as={`/profile/${domain.name}`}
            href={{
              pathname: `/profile/${domain.name}`,
              query: { from: "/" },
            }}
          >
            <a>
              <SearchArrowButton as={IconArrowCircle} />
            </a>
          </Link>
        );
      }
      if (!valid && inputVal.length >= 3) {
        return (
          <Box onClick={() => setInputVal("")}>
            <SearchArrowButton as={IconCancelCircle} />
          </Box>
        );
      }
    }
    if (inputVal !== searchedVal || loading) {
      return (
        <Box opacity="50" marginRight="2">
          <Spinner color="foreground" />
        </Box>
      );
    }
    return null;
  };

  return (
    <Box paddingX={{ xs: "0", md: "12" }} width="full">
      <Box
        boxShadow="0.25"
        borderRadius="2.5xLarge"
        borderWidth="px"
        borderColor="borderTertiary"
        width="full"
      >
        <Input
          size="extraLarge"
          borderRadius="2.5xLarge"
          label="Name search"
          hideLabel
          placeholder="Search for a name"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          suffix={SuffixElement()}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />
      </Box>
    </Box>
  );
};
