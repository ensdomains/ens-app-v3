/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import { useLocalStorage } from '@app/hooks/useLocalStorage'
import {
  parseInputType,
  validateName,
} from '@ensdomains/ensjs/dist/cjs/utils/validation'
import { mq } from '@ensdomains/thorin'
import debounce from 'lodash/debounce'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useTransition, { TransitionState } from 'react-transition-state'
import styled, { css } from 'styled-components'
import { SearchInputBox } from './SearchInputBox'
import { SearchResult } from './SearchResults'
import { AnyItem, HistoryItem, SearchItem } from './types'

const Container = styled.div<{ $size: 'large' | 'extraLarge' }>(
  ({ $size }) => css`
    width: 100%;
    position: relative;
    ${$size === 'extraLarge' &&
    mq.md.min(css`
      padding-left: 48px;
      padding-right: 48px;
    `)}
  `,
)

const SearchResultsContainer = styled.div<{
  $state: TransitionState
  $error?: boolean
}>(
  ({ theme, $state, $error }) => css`
    position: absolute;
    width: 100%;
    height: min-content;
    top: calc(100% + ${theme.space['3']});

    background-color: #f7f7f7;
    box-shadow: 0px 2px 12px rgba(${theme.shadesRaw.foreground}, 0.04);
    border-radius: ${theme.radii.extraLarge};
    border: ${theme.borderWidths.px} ${theme.borderStyles.solid}
      ${$error ? theme.colors.red : theme.colors.borderTertiary};

    overflow: hidden;

    opacity: 0;
    z-index: 1;
    transform: translateY(-${theme.space['2']});
    transition: 0.35s all cubic-bezier(1, 0, 0.22, 1.6),
      0s border-color linear 0s, 0s width linear 0s;

    ${$state === 'entered'
      ? css`
          opacity: 1;
          transform: translateY(0px);
        `
      : css`
          & > div {
            cursor: default;
          }
        `}
  `,
)

const debouncer = debounce((setFunc: () => void) => setFunc(), 500)

export const SearchInput = ({
  size = 'extraLarge',
  setSearchState,
}: {
  size?: 'large' | 'extraLarge'
  setSearchState?: (value: TransitionState) => void
}) => {
  const router = useRouter()

  const [inputVal, setInputVal] = useState('')

  const [state, toggle] = useTransition({
    enter: true,
    exit: true,
    preEnter: true,
    preExit: true,
    mountOnEnter: true,
    unmountOnExit: true,
    timeout: {
      enter: 0,
      exit: 350,
    },
  })

  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchInputContainerRef = useRef<HTMLDivElement>(null)

  const [selected, setSelected] = useState(0)
  const [usingPlaceholder, setUsingPlaceholder] = useState(false)

  const [history, setHistory] = useLocalStorage<HistoryItem[]>(
    'search-history',
    [],
  )

  const [normalisedName, isValid, inputType, isEmpty, isTLD] = useMemo(() => {
    if (inputVal) {
      let _normalisedName: string
      let _inputType: any
      let _isValid = true
      try {
        _normalisedName = validateName(inputVal)
        _inputType = parseInputType(_normalisedName)
      } catch (e) {
        _normalisedName = ''
        _isValid = false
        _inputType = {
          type: 'unknown',
          info: 'unsupported',
        }
      }

      return [
        _normalisedName,
        _isValid &&
          _inputType.type !== 'unknown' &&
          _inputType.info !== 'unsupported' &&
          _inputType.info !== 'short',
        _inputType,
        false,
        !_normalisedName.includes('.'),
      ]
    }
    return ['', true, { type: 'name', info: 'supported' }, true, false]
  }, [inputVal])

  const searchItem: SearchItem = useMemo(() => {
    if (isEmpty) {
      return {
        type: 'text',
        value: 'Type a name or address to search...',
      }
    }
    if (!isValid) {
      if (inputType.info === 'short') {
        return {
          type: 'error',
          value: 'Name too short',
        }
      }
      return {
        type: 'error',
        value: 'Invalid format for name',
      }
    }
    if (inputType.type === 'address') {
      return {
        type: 'address',
      }
    }
    if (isTLD) {
      return {
        type: 'nameWithDotEth',
      }
    }
    return {
      type: 'name',
    }
  }, [inputType.info, inputType.type, isValid, isEmpty, isTLD])

  const extraItems = useMemo(() => {
    if (history.length > 0) {
      if (normalisedName === '') {
        return history
      }
      return history.filter(
        (item) =>
          item.value !== normalisedName &&
          item.value.includes(normalisedName) &&
          (searchItem.type === 'nameWithDotEth'
            ? item.value !== `${normalisedName}.eth`
            : true),
      )
    }
    return []
  }, [normalisedName, searchItem.type, history])

  const searchItems: AnyItem[] = useMemo(() => {
    const _searchItem = { ...searchItem, isHistory: false }
    const _extraItems = extraItems.map((item) => ({ ...item, isHistory: true }))
    if (searchItem.type === 'error') {
      return [_searchItem]
    }
    if (searchItem.type === 'text') {
      if (extraItems.length > 0) {
        return [..._extraItems]
      }
      return [_searchItem]
    }
    const _searchItems: SearchItem[] =
      _searchItem.type === 'nameWithDotEth'
        ? [_searchItem, { type: 'name', isHistory: false }]
        : [_searchItem]
    return [
      ..._searchItems.map((item) => ({ ...item, isHistory: false })),
      ...extraItems.map((item) => ({ ...item, isHistory: true })),
    ]
  }, [searchItem, extraItems])

  const handleFocusIn = useCallback(() => toggle(true), [toggle])
  const handleFocusOut = useCallback(() => toggle(false), [toggle])

  const handleSearch = useCallback(() => {
    let selectedItem = searchItems[selected] as SearchItem
    if (selectedItem.type === 'error' || selectedItem.type === 'text') return
    if (selectedItem.type === 'nameWithDotEth') {
      selectedItem = {
        type: 'name',
        value: `${normalisedName}.eth`,
      }
    }
    if (!selectedItem.value) {
      selectedItem.value = normalisedName
    }
    const path =
      selectedItem.type === 'address'
        ? `/address/${selectedItem.value}`
        : `/profile/${selectedItem.value}`
    setHistory((prev) =>
      [
        ...prev.filter(
          (item) =>
            !(
              item.value === selectedItem.value &&
              item.type === selectedItem.type
            ),
        ),
        selectedItem as HistoryItem,
      ]
        .reverse()
        .slice(0, 5),
    )
    setInputVal('')
    searchInputRef.current?.blur()
    router.push(
      {
        pathname: path,
        query: {
          from: router.asPath,
        },
      },
      path,
    )
  }, [normalisedName, router, searchItems, selected, setHistory])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        return handleSearch()
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelected(
          (prev) => (prev - 1 + searchItems.length) % searchItems.length,
        )
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelected((prev) => (prev + 1) % searchItems.length)
      }
    },
    [handleSearch, searchItems.length],
  )

  const handleHover = (index: number) => {
    if (selected !== index) {
      setSelected(index)
    }
  }

  useEffect(() => {
    if (inputVal === '') {
      setSelected(-1)
    } else {
      setSelected(0)
    }
  }, [inputVal])

  useEffect(() => {
    if (state === 'unmounted') {
      setSelected(-1)
    }
  }, [state])

  useEffect(() => {
    debouncer(() => setUsingPlaceholder(false))
    setUsingPlaceholder(true)
  }, [inputVal])

  useEffect(() => {
    if (setSearchState) {
      setSearchState(state)
    }
  }, [setSearchState, state])

  useEffect(() => {
    const searchInput = searchInputRef.current
    searchInput?.addEventListener('keydown', handleKeyDown)
    searchInput?.addEventListener('focusin', handleFocusIn)
    searchInput?.addEventListener('focusout', handleFocusOut)
    return () => {
      searchInput?.removeEventListener('keydown', handleKeyDown)
      searchInput?.removeEventListener('focusin', handleFocusIn)
      searchInput?.removeEventListener('focusout', handleFocusOut)
    }
  }, [handleFocusIn, handleFocusOut, handleKeyDown, searchInputRef])

  return (
    <Container $size={size}>
      <SearchInputBox
        containerRef={searchInputContainerRef}
        ref={searchInputRef}
        input={inputVal}
        setInput={setInputVal}
        size={size}
      />
      {state !== 'unmounted' && (
        <SearchResultsContainer
          style={{
            width: searchInputContainerRef.current?.offsetWidth,
          }}
          onMouseLeave={() => inputVal === '' && setSelected(-1)}
          $state={state}
          $error={!isValid && inputVal !== ''}
        >
          {searchItems.map((item, index) => (
            <SearchResult
              clickCallback={handleSearch}
              hoverCallback={handleHover}
              index={index}
              selected={selected}
              type={item.type}
              usingPlaceholder={item.isHistory ? false : usingPlaceholder}
              key={`${item.type}-${item.value}`}
              value={item.value || normalisedName}
            />
          ))}
        </SearchResultsContainer>
      )}
    </Container>
  )
}
