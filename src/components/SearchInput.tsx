/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import { useGetDomainFromInput } from '@app/hooks/useGetDomainFromInput'
import { useInitial } from '@app/hooks/useInitial'
import mq from '@app/mediaQuery'
import {
  ArrowCircleSVG,
  CancelCircleSVG,
  Input,
  Spinner,
  tokens,
} from '@ensdomains/thorin'
import debounce from 'lodash/debounce'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

const Container = styled.div<{ $size: 'large' | 'extraLarge' }>`
  width: 100%;
  ${({ $size }) =>
    $size === 'extraLarge' &&
    mq.medium.min`
    padding-left: 48px;
    padding-right: 48px;
  `}
`

const SearchArrowButton = styled.div<{ danger?: boolean }>`
  display: block;
  transition: all 0.15s ease-in-out;
  cursor: pointer;
  color: ${({ danger, theme }) =>
    danger ? tokens.colors[theme.mode].red : tokens.colors[theme.mode].accent};
  width: ${tokens.space['7']};
  height: ${tokens.space['7']};
  margin-right: ${tokens.space['2']};
  &:hover {
    filter: brightness(1.05);
    transform: translateY(-1px);
  }
`

const SearchInputWrapper = styled.div<{ $size: 'large' | 'extraLarge' }>`
  box-shadow: ${({ theme }) => tokens.boxShadows[theme.mode]['0.25']};
  border-radius: ${tokens.radii['2.5xLarge']};
  border-width: 1px;
  border-color: ${({ theme }) => tokens.colors[theme.mode].borderTertiary};
  width: 100%;

  ${({ $size, theme }) =>
    $size === 'large' &&
    `
    transition: all 0.35s cubic-bezier(1, 0, 0.1, 1.6);
    max-width: ${tokens.space['80']};
    &:focus-within {
      max-width: calc(${tokens.space['80']} + ${tokens.space['24']});
    }
    box-shadow: ${tokens.boxShadows[theme.mode]['0.25']};
    & input::placeholder {
      color: ${tokens.colors[theme.mode].textTertiary};
    }
  `}
`

const StyledInputParent = (size: 'large' | 'extraLarge') => css`
  border-radius: ${tokens.radii['2.5xLarge']};
  background-color: ${({ theme }) =>
    size === 'large'
      ? tokens.colors[theme.mode].background
      : tokens.colors[theme.mode].backgroundSecondary};
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
  const { profile, valid, loading, name } = useGetDomainFromInput(
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
          pathname: `/profile/${name}`,
        },
        `/profile/${name}`,
      )
      .then(() => {
        setInputVal('')
        _setSearchedVal('')
        searchInputRef.current?.blur()
      })

  const SuffixElement = () => {
    if (inputVal === '') return null
    if (profile && searchedVal === inputVal && !loading) {
      if (valid) {
        return (
          <div role="button" onClick={handleSearch}>
            <SearchArrowButton
              data-testid="search-button"
              as={ArrowCircleSVG}
            />
          </div>
        )
      }
      if (!valid && inputVal.length >= 3) {
        return (
          <div onClick={() => setInputVal('')}>
            <SearchArrowButton
              data-testid="search-invalid"
              as={CancelCircleSVG}
            />
          </div>
        )
      }
    }
    return (
      <div style={{ opacity: 0.5, marginRight: '8px' }}>
        <Spinner color="foreground" />
      </div>
    )
  }

  return (
    <Container $size={size}>
      <SearchInputWrapper $size={size}>
        <Input
          size={size}
          label="Name search"
          hideLabel
          placeholder="Search for a name"
          value={inputVal}
          onKeyDown={(e) =>
            e.key === 'Enter' &&
            name &&
            profile &&
            searchedVal === inputVal &&
            !loading &&
            handleSearch
          }
          onChange={(e) => setInputVal(e.target.value)}
          ref={searchInputRef}
          suffix={SuffixElement()}
          autoComplete="off"
          autoCorrect="off"
          parentStyles={StyledInputParent(size)}
          spellCheck="false"
        />
      </SearchInputWrapper>
    </Container>
  )
}
