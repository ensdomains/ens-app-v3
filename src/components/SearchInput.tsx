import { useGetDomainFromInput } from '@app/hooks/useGetDomainFromInput'
import { useInitial } from '@app/hooks/useInitial'
import {
  Box,
  IconArrowCircle,
  IconCancelCircle,
  Input,
  Spinner,
  vars,
} from '@ensdomains/thorin'
import debounce from 'lodash/debounce'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const SearchArrowButton = styled(Box)<{ danger?: boolean }>`
  transition: all 0.15s ease-in-out;
  cursor: pointer;
  color: ${({ danger }) => (danger ? vars.colors.red : vars.colors.accent)};
  width: ${vars.space['7']};
  height: ${vars.space['7']};
  margin-right: ${vars.space['2']};
  &:hover {
    filter: brightness(1.05);
    transform: translateY(-1px);
  }
`

const SearchInputWrapper = styled(Box)<{ $size: 'large' | 'extraLarge' }>`
  box-shadow: ${vars.shadows['0.25']} ${vars.colors.foregroundSecondary};
  border-radius: ${vars.radii['2.5xLarge']};
  border-width: 1px;
  border-color: ${vars.colors.borderTertiary};
  width: 100%;

  ${({ $size }) =>
    $size === 'large' &&
    `
    transition: all 0.35s cubic-bezier(1, 0, 0.1, 1.6);
    max-width: ${vars.space['80']};
    &:focus-within {
      max-width: calc(${vars.space['80']} + ${vars.space['24']});
    }
    box-shadow: ${vars.shadows['0.25']} ${vars.colors.foregroundSecondary};
    & input::placeholder {
      color: ${vars.colors.textTertiary};
    }
  `}
`

const setSearchedVal = debounce(
  (input: string, setFunc: (input: string) => void) => setFunc(input),
  500,
)

export const SearchInput = ({
  size = 'extraLarge',
}: {
  size?: 'large' | 'extraLarge'
}) => {
  const router = useRouter()
  const initial = useInitial()

  const [searchedVal, _setSearchedVal] = useState('')
  const [inputVal, setInputVal] = useState('')
  const { domain, valid, loading } = useGetDomainFromInput(
    searchedVal,
    searchedVal === '' || inputVal === '',
  )
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!initial) {
      setSearchedVal(inputVal, _setSearchedVal)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputVal])

  const handleSearch = () =>
    router
      .push(
        {
          pathname: `/profile/${domain.name}`,
        },
        `/profile/${domain.name}`,
      )
      .then(() => {
        setInputVal('')
        _setSearchedVal('')
        searchInputRef.current?.blur()
      })

  const SuffixElement = () => {
    if (inputVal === '') return null
    if (domain && domain.name && searchedVal === inputVal && !loading) {
      if (valid && domain.state === 'Owned') {
        return (
          <Box role="button" onClick={handleSearch}>
            <SearchArrowButton as={IconArrowCircle} />
          </Box>
        )
      }
      if (!valid && inputVal.length >= 3) {
        return (
          <Box onClick={() => setInputVal('')}>
            <SearchArrowButton as={IconCancelCircle} />
          </Box>
        )
      }
    }
    return (
      <Box opacity="50" marginRight="2">
        <Spinner color="foreground" />
      </Box>
    )
  }

  return (
    <Box
      paddingX={size === 'extraLarge' ? { xs: '0', md: '12' } : '0'}
      width="full"
    >
      <SearchInputWrapper $size={size}>
        <Input
          size={size}
          borderRadius="2.5xLarge"
          label="Name search"
          hideLabel
          placeholder="Search for a name"
          value={inputVal}
          onKeyDown={(e) =>
            e.key === 'Enter' &&
            domain &&
            domain.name &&
            searchedVal === inputVal &&
            !loading &&
            handleSearch
          }
          onChange={(e) => setInputVal(e.target.value)}
          ref={searchInputRef}
          suffix={SuffixElement()}
          autoComplete="off"
          autoCorrect="off"
          backgroundColor={
            size === 'large' ? 'background' : 'backgroundSecondary'
          }
          spellCheck="false"
        />
      </SearchInputWrapper>
    </Box>
  )
}
