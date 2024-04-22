import {
  Dispatch,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import useTransition, { TransitionState } from 'react-transition-state'
import styled, { css } from 'styled-components'
import { isAddress } from 'viem'

import { BackdropSurface, mq, Portal, Typography } from '@ensdomains/thorin'

import { useLocalStorage } from '@app/hooks/useLocalStorage'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { useValidate } from '@app/hooks/useValidate'
import { useElementSize } from '@app/hooks/useWindowSize'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { thread } from '@app/utils/utils'

import { FakeSearchInputBox, SearchInputBox } from './SearchInputBox'
import { SearchResult } from './SearchResult'
import { HistoryItem, SearchItem } from './types'

type HandleSearch = (
  router: ReturnType<typeof useRouterWithHistory>,
  setHistory: ReturnType<typeof useLocalStorage<HistoryItem[]>>[1],
) => (arg: SearchItem) => void

const Container = styled.div<{ $size: 'medium' | 'extraLarge' }>(
  ({ $size }) => css`
    width: 100%;
    position: relative;
    ${$size === 'extraLarge' &&
    mq.sm.min(css`
      padding-left: 48px;
      padding-right: 48px;
    `)}
  `,
)

const SearchResultsContainer = styled.div<{
  $state: TransitionState
}>(
  ({ theme, $state }) => css`
    position: absolute;
    width: 100%;
    height: min-content;
    top: calc(100% + ${theme.space['3']});

    background-color: #f7f7f7;
    box-shadow: 0 2px 12px ${theme.colors.border};
    border-radius: ${theme.radii.extraLarge};
    border: ${theme.borderWidths.px} ${theme.borderStyles.solid} ${theme.colors.border};
    &[data-error='true'] {
      border-color: ${theme.colors.red};
    }

    overflow: hidden;

    opacity: 0;
    z-index: 1000;
    transform: translateY(-${theme.space['2']});
    transition:
      0.35s all cubic-bezier(1, 0, 0.22, 1.6),
      0s border-color linear 0s,
      0s width linear 0s;

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

const FloatingSearchContainer = styled.div<{ $state: TransitionState }>(
  ({ theme, $state }) => css`
    width: 95%;

    position: fixed;
    left: 2.5%;
    z-index: 9999;
    top: ${theme.space['4']};

    display: flex;
    flex-direction: column;

    opacity: 0;

    & > div:nth-child(2) {
      width: 95vw !important;
    }

    ${$state === 'entered' &&
    css`
      opacity: 1;
    `}
  `,
)

const InputAndCancel = styled.div(
  () => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  `,
)

const CancelButton = styled(Typography)(
  ({ theme }) => css`
    padding: ${theme.space['3']};
  `,
)

const MobileSearchInput = ({
  state,
  toggle,
  searchInputRef,
  SearchResultsElement,
  SearchInputElement,
}: {
  state: TransitionState
  toggle: (value: boolean) => void
  searchInputRef: RefObject<HTMLInputElement>
  SearchResultsElement: JSX.Element
  SearchInputElement: JSX.Element
}) => {
  const { t } = useTranslation('common')

  useEffect(() => {
    if (state === 'entered') {
      searchInputRef.current?.focus()
    }
  }, [searchInputRef, state])

  return (
    <>
      <FakeSearchInputBox
        onClick={(e) => {
          toggle(true)
          // MOBILE SAFARI FIX:
          // focus on the fake input first, then wait for the transition to finish and focus on the real input
          // this allows the keyboard to pop up
          e.currentTarget.focus()
          e.preventDefault()
          setTimeout(() => searchInputRef.current?.focus(), 350)
        }}
      />
      {state !== 'unmounted' && (
        <Portal>
          <BackdropSurface
            $empty={false}
            onClick={() => toggle(false)}
            $state={state}
            data-testid="search-input-backdrop"
          />
          <FloatingSearchContainer $state={state}>
            <InputAndCancel>
              {SearchInputElement}
              <CancelButton as="button" onClick={() => toggle(false)}>
                {t('action.cancel')}
              </CancelButton>
            </InputAndCancel>
            {SearchResultsElement}
          </FloatingSearchContainer>
        </Portal>
      )}
    </>
  )
}

const useAddEventListeners = (
  searchInputRef: React.RefObject<HTMLInputElement>,
  handleKeyDown: (e: KeyboardEvent) => void,
  handleFocusIn: () => void,
  handleFocusOut: () => void,
) => {
  useEffect(() => {
    const searchInput = searchInputRef.current
    if (searchInput) {
      searchInput?.addEventListener('keydown', handleKeyDown)
      searchInput?.addEventListener('focusin', handleFocusIn)
      searchInput?.addEventListener('focusout', handleFocusOut)
      return () => {
        searchInput?.removeEventListener('keydown', handleKeyDown)
        searchInput?.removeEventListener('focusin', handleFocusIn)
        searchInput?.removeEventListener('focusout', handleFocusOut)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleFocusIn, handleFocusOut, handleKeyDown, searchInputRef.current])
}

const handleKeyDown =
  (
    handleSearch: (searchItem: SearchItem) => void,
    setSelected: Dispatch<SetStateAction<number>>,
    dropdownItems: SearchItem[],
    selected: number,
  ) =>
  (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(dropdownItems[selected])
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected((prev: number) => (prev - 1 + dropdownItems.length) % dropdownItems.length)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected((prev: number) => (prev + 1) % dropdownItems.length)
    }
  }

const handleSearch: HandleSearch = (router, setHistory) => (searchItem: SearchItem) => {
  setHistory((historyItems: HistoryItem[]) => [
    ...historyItems.filter(
      (historyItem) =>
        !(historyItem.text === searchItem.text && historyItem.nameType === searchItem.nameType),
    ),
    { lastAccessed: Date.now(), ...searchItem },
  ])
  router.push(`/${searchItem.text}`)
}

const useSelectionManager = ({
  inputVal,
  setSelected,
  state,
}: {
  inputVal: string
  setSelected: Dispatch<SetStateAction<number>>
  state: TransitionState
}) => {
  useEffect(() => {
    if (inputVal === '') {
      setSelected(-1)
    } else {
      setSelected(0)
    }
  }, [inputVal, setSelected])

  useEffect(() => {
    if (state === 'unmounted') {
      setSelected(-1)
    }
  }, [state, setSelected])
}

const formatEthText = (name: string, isETH: boolean) => {
  if (!name) return ''
  if (isETH) return name
  if (name.includes('.')) return ''
  return `${name}.eth`
}
const addEthDropdownItem = (dropdownItems: SearchItem[], name: string, isETH: boolean) => [
  {
    text: formatEthText(name, isETH),
    nameType: 'eth',
  },
  ...dropdownItems,
]

const isBoxValid = (name: string) => {
  /*
    This regular expression will match any string that starts and ends with a letter or a digit, 
    does not have a hyphen in the third or fourth position, does not include a space, and 
    consists only of the characters a-z, A-Z, 0-9, and - in between, but does not start or end 
    with a hyphen.

    This is to comply with .box name rules. 
  */
  const regex = /^[a-zA-Z0-9]{2}(?!-)[a-zA-Z0-9-]*(?<!-)[a-zA-Z0-9]$/

  if (!name.endsWith('.box')) return false
  if (name.length > 63) return false
  if (!regex.test(name.slice(0, -4))) return false
  return true
}
const formatBoxText = (name: string) => {
  if (!name) return ''
  if (name?.endsWith('.box')) return name
  if (name.includes('.')) return ''
  return `${name}.box`
}
const addBoxDropdownItem = (dropdownItems: SearchItem[], name: string, isValid: boolean) => {
  const formattedBoxName = formatBoxText(name)
  return [
    {
      text: formattedBoxName,
      nameType: 'box',
      isValid: isValid && isBoxValid(formattedBoxName),
    },
    ...dropdownItems,
  ]
}

const formatTldText = (name: string) => {
  if (!name) return ''
  if (name.includes('.')) return ''
  return name
}
const addTldDropdownItem = (dropdownItems: SearchItem[], name: string) => [
  {
    text: formatTldText(name),
    nameType: 'tld',
  },
  ...dropdownItems,
]

const addAddressItem = (dropdownItems: SearchItem[], name: string, inputIsAddress: boolean) => [
  {
    text: inputIsAddress ? name : '',
    nameType: 'address',
  },
  ...dropdownItems,
]

const MAX_DROPDOWN_ITEMS = 6
const addHistoryDropdownItems = (dropdownItems: SearchItem[], history: HistoryItem[]) => {
  const historyItemDrawCount = MAX_DROPDOWN_ITEMS - dropdownItems.filter((item) => item.text).length

  if (historyItemDrawCount > 0) {
    const filteredHistoryItems = history.filter(
      (historyItem: HistoryItem) =>
        dropdownItems.findIndex(
          (dropdownItem) =>
            dropdownItem.nameType === historyItem.nameType &&
            dropdownItem.text === historyItem.text,
        ) === -1,
    )
    const historyItems = filteredHistoryItems?.slice(0, historyItemDrawCount)
    return [...historyItems, ...dropdownItems]
  }

  return dropdownItems
}

const formatDnsText = (name: string, isETH: boolean) => {
  if (!name) return ''
  if (!name.includes('.')) return ''
  if (name.endsWith('.box')) return ''
  if (isETH) return ''
  return name
}
const addDnsDropdownItem = (dropdownItems: SearchItem[], name: string, isETH: boolean) => [
  {
    text: formatDnsText(name, isETH),
    nameType: 'dns',
  },
  ...dropdownItems,
]

const addErrorDropdownItem = (dropdownItems: SearchItem[], name: string, isValid: boolean) =>
  isValid || name === ''
    ? dropdownItems
    : [
        {
          text: 'Invalid name',
          nameType: 'error',
        },
      ]

const useBuildDropdownItems = (inputVal: string, history: string): SearchItem[] => {
  const inputIsAddress = useMemo(() => isAddress(inputVal), [inputVal])

  const { isValid, isETH, name } = useValidate({
    input: inputVal,
    enabled: !inputIsAddress && !inputVal,
  })

  return thread(
    [],
    [addDnsDropdownItem, name, isETH],
    [addAddressItem, inputVal, inputIsAddress],
    [addEthDropdownItem, name, isETH],
    [addBoxDropdownItem, name, isValid],
    [addTldDropdownItem, name],
    [addHistoryDropdownItems, history],
    [addErrorDropdownItem, name, isValid],
  )
    .reverse()
    .filter((item: SearchItem) => item.text)
}

export const SearchInput = ({ size = 'extraLarge' }: { size?: 'medium' | 'extraLarge' }) => {
  const router = useRouterWithHistory()
  const breakpoints = useBreakpoint()

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
  const { width } = useElementSize(searchInputContainerRef.current)

  const [selected, setSelected] = useState(0)

  const [history, setHistory] = useLocalStorage<HistoryItem[]>('search-history', [])

  const handleFocusIn = useCallback(() => toggle(true), [toggle])
  const handleFocusOut = useCallback(() => toggle(false), [toggle])

  const dropdownItems = useBuildDropdownItems(inputVal, history)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearchCb = useCallback(handleSearch(router, setHistory), [router, setHistory])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleKeyDownCb = useCallback(
    handleKeyDown(handleSearchCb, setSelected, dropdownItems, selected),
    [handleSearch, setSelected, dropdownItems.length, selected],
  )

  useAddEventListeners(searchInputRef, handleKeyDownCb, handleFocusIn, handleFocusOut)

  useSelectionManager({ inputVal, setSelected, state })

  const SearchInputElement = (
    <SearchInputBox
      containerRef={searchInputContainerRef}
      ref={searchInputRef}
      input={inputVal}
      setInput={setInputVal}
      size={size}
    />
  )

  const SearchResultsElement = (
    <SearchResultsContainer
      style={{
        width: width === Infinity ? undefined : width,
      }}
      onMouseLeave={() => inputVal === '' && setSelected(0)}
      $state={state}
      data-testid="search-input-results"
      // data-error={!isValid && !inputIsAddress && inputVal !== ''}
    >
      {dropdownItems.map((searchItem, index) => (
        <SearchResult
          clickCallback={handleSearchCb}
          hoverCallback={setSelected}
          index={index}
          selected={index === selected}
          key={`${searchItem.nameType}-${searchItem.text}`}
          searchItem={searchItem}
        />
      ))}
    </SearchResultsContainer>
  )

  if (breakpoints.sm) {
    return (
      <Container data-testid="search-input-desktop" $size={size}>
        {SearchInputElement}
        {state !== 'unmounted' && SearchResultsElement}
      </Container>
    )
  }

  return (
    <Container data-testid="search-input-mobile" $size="extraLarge">
      <MobileSearchInput
        {...{
          SearchInputElement,
          SearchResultsElement,
          searchInputRef,
          state,
          toggle,
        }}
      />
    </Container>
  )
}
