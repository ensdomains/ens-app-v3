/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import { useExists } from '@app/hooks/useExists'
import { useInitial } from '@app/hooks/useInitial'
import { useValidate } from '@app/hooks/useValidate'
import mq from '@app/mediaQuery'
import {
  ArrowCircleSVG,
  CancelCircleSVG,
  Input,
  Spinner,
} from '@ensdomains/thorin'
import debounce from 'lodash/debounce'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
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

const SearchArrowButton = styled.div<{ $danger?: boolean }>`
  ${({ $danger, theme }) => `
  display: block;
  transition: all 0.15s ease-in-out;
  cursor: pointer;
  color: ${$danger ? theme.colors.red : theme.colors.accent};
  width: ${theme.space['7']};
  height: ${theme.space['7']};
  margin-right: ${theme.space['2']};
  &:hover {
    filter: brightness(1.05);
    transform: translateY(-1px);
  }
  `}
`

const SearchInputWrapper = styled.div<{ $size: 'large' | 'extraLarge' }>`
  ${({ theme, $size }) => `
    box-shadow: ${theme.boxShadows['0.25']};
    border-radius: ${theme.radii['2.5xLarge']};
    border-width: 1px;
    border-color: ${theme.colors.borderTertiary};
    width: 100%;
    ${
      $size === 'large' &&
      `
      transition: all 0.35s cubic-bezier(1, 0, 0.1, 1.6);
      max-width: ${theme.space['80']};
      &:focus-within {
        max-width: calc(${theme.space['80']} + ${theme.space['24']});
      }
      box-shadow: ${theme.boxShadows['0.25']};
      & input::placeholder {
        color: ${theme.colors.textTertiary};
      }
    `
    }
  `}
`

const StyledInputParent = (size: 'large' | 'extraLarge') => css`
  ${({ theme }) => `
    border-radius: ${theme.radii['2.5xLarge']};
    background-color: ${
      size === 'large'
        ? theme.colors.background
        : theme.colors.backgroundSecondary
    };
  `}
`

const setSearchedVal = debounce(
  (input: string, setFunc: (input: string) => void) => setFunc(input),
  500,
)

type ButtonState = 'none' | 'loading' | 'danger' | 'success'

export const SearchInput = ({
  size = 'extraLarge',
}: {
  size?: 'large' | 'extraLarge'
}) => {
  const router = useRouter()
  const initial = useInitial()

  const [searchedVal, _setSearchedVal] = useState('')
  const [inputVal, setInputVal] = useState('')

  const { valid, name } = useValidate(
    searchedVal,
    searchedVal === '' || inputVal === '',
  )
  const {
    exists: nameExists,
    loading,
    status,
  } = useExists(name, !name || name === '')

  const searchInputRef = useRef<HTMLInputElement>(null)

  const buttonState: ButtonState = useMemo(() => {
    if (inputVal === '') return 'none'
    if (nameExists && searchedVal === inputVal && !loading && valid)
      return 'success'
    if (
      (!nameExists &&
        searchedVal === inputVal &&
        !loading &&
        (status === 'success' || status === 'error')) ||
      valid === false
    )
      return 'danger'
    return 'loading'
  }, [inputVal, loading, nameExists, searchedVal, status, valid])

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
    switch (buttonState) {
      case 'loading':
        return (
          <div style={{ opacity: 0.5, marginRight: '8px' }}>
            <Spinner color="foreground" />
          </div>
        )
      case 'success':
        return (
          <div role="button" onClick={handleSearch}>
            <SearchArrowButton
              data-testid="search-button"
              as={ArrowCircleSVG}
            />
          </div>
        )
      case 'danger':
        return (
          <div onClick={() => setInputVal('')}>
            <SearchArrowButton
              $danger
              data-testid="search-invalid"
              as={CancelCircleSVG}
            />
          </div>
        )
      default:
        return null
    }
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
            nameExists &&
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
