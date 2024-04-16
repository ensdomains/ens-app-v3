import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import debounce from 'lodash/debounce'
import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useTransition, { TransitionState } from 'react-transition-state'
import usePrevious from 'react-use/lib/usePrevious'
import styled, { css } from 'styled-components'
import { isAddress } from 'viem'
import { useAccount, useChainId, useEnsAvatar } from 'wagmi'

import {
  GetExpiryReturnType,
  GetOwnerReturnType,
  GetPriceReturnType,
  GetWrapperDataReturnType,
} from '@ensdomains/ensjs/public'
import { normalise } from '@ensdomains/ensjs/utils'
import { BackdropSurface, mq, Portal, Typography } from '@ensdomains/thorin'

import { useBasicName } from '@app/hooks/useBasicName'
import { useDebounce } from '@app/hooks/useDebounce'
import { useLocalStorage } from '@app/hooks/useLocalStorage'
import { createQueryKey } from '@app/hooks/useQueryOptions'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { useValidate, validate, ValidationResult } from '@app/hooks/useValidate'
import { useElementSize } from '@app/hooks/useWindowSize'
import { useZorb } from '@app/hooks/useZorb'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { ensAvatarConfig } from '@app/utils/query/ipfsGateway'
import { getRegistrationStatus } from '@app/utils/registrationStatus'
import { yearsToSeconds } from '@app/utils/utils'

import { FakeSearchInputBox, SearchInputBox } from './SearchInputBox'
import { SearchResult } from './SearchResult'
import { AnyItem, HistoryItem } from './types'

/* eslint-disable jsx-a11y/click-events-have-key-events */

/* eslint-disable jsx-a11y/no-static-element-interactions */

/* eslint-disable jsx-a11y/interactive-supports-focus */

const BOX_SEARCH_ENDPOINT = 'https://dotbox-worker.ens-cf.workers.dev/search'

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

const debouncer = debounce((setFunc: () => void) => setFunc(), 500)

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

const useGetDotBox = (normalisedOutput: any) => {
  const searchParam = useDebounce(normalisedOutput, 500)
  console.log('serachParam: ', searchParam)

  const { data, status } = useQuery({
    queryKey: [searchParam],
    queryFn: async () => {
      const response = await fetch(`${BOX_SEARCH_ENDPOINT}?domain=${searchParam}`)
      return response.json()
    },
    staleTime: 10 * 1000,
    enabled: !!searchParam,
  })

  return { data, status }
}

const useEthSearchResult = (name: string, isValid: boolean, isETH?: boolean) => {
  const _name = isValid ? name : ''
  const { data: avatar } = useEnsAvatar({ ...ensAvatarConfig, name: _name })
  const zorb = useZorb(_name, 'name')
  const { registrationStatus, isLoading, beautifiedName } = useBasicName({ name: _name })

  return {
    image: avatar || zorb,
    registrationStatus,
    text: beautifiedName,
    isLoading,
  }
}

const useSearchResult = (normalisedOutput: any, inputVal: any) => {
  const searchParam = useDebounce(normalisedOutput, 500)
  // const prevSearchParam = usePrevious(searchParam)

  // const { isValid, isETH, is2LD, isShort, type, name } = useValidate({
  //   input: inputVal,
  //   enabled: !inputIsAddress && !isEmpty,
  // })

  const { data, status } = useQuery({
    queryKey: [searchParam],
    queryFn: async () => {
      const response = await fetch(`${BOX_SEARCH_ENDPOINT}?domain=${searchParam}`)

      const validationResult = validate(searchParam)
      console.log('validationResult: ', validationResult)

      return response.json()
    },
    staleTime: 10 * 1000,
    enabled: !!searchParam,
  })
}

const useAddEventListeners = (
  searchInputRef: any,
  handleKeyDown: any,
  handleFocusIn: any,
  handleFocusOut: any,
) => {
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
}

const handleKeyDown =
  (handleSearch: any, setSelected: any, searchItems: any) => (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      return handleSearch()
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected((prev) => (prev - 1 + searchItems.length) % searchItems.length)
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected((prev) => (prev + 1) % searchItems.length)
    }
  }

const handleSearch =
  ({
    normalisedOutput,
    queryClient,
    router,
    searchItems,
    selected,
    setHistory,
    chainId,
    address,
  }: {
    normalisedOutput: string
    queryClient: QueryClient
    router: any
    searchItems: any
    selected: boolean
    setHistory: () => void
    chainId: number
    address: string
  }) =>
  () => {
    let selectedItem = searchItems[selected] as SearchItem
    if (!selectedItem) return
    if (selectedItem.type === 'error' || selectedItem.type === 'text') return
    if (selectedItem.type === 'nameWithDotEth') {
      selectedItem = {
        type: 'name',
        value: `${normalisedOutput}.eth`,
      }
    }
    if (!selectedItem.value) {
      selectedItem.value = normalisedOutput
    }
    if (selectedItem.type === 'name') {
      const labels = selectedItem.value.split('.')
      const isDotETH = labels.length === 2 && labels[1] === 'eth'
      if (isDotETH && labels[0].length < 3) {
        return
      }
    }
    let path =
      selectedItem.type === 'address'
        ? `/address/${selectedItem.value}`
        : `/profile/${selectedItem.value}`
    if (selectedItem.type === 'nameWithDotEth' || selectedItem.type === 'name') {
      const currentValidation =
        queryClient.getQueryData<ValidationResult>(
          createQueryKey({
            queryDependencyType: 'independent',
            functionName: 'validate',
            params: { input: selectedItem.value },
          }),
        ) || validate(selectedItem.value)
      if (currentValidation.is2LD && currentValidation.isETH && currentValidation.isShort) {
        return
      }
      const ownerData = queryClient.getQueryData<GetOwnerReturnType>(
        createQueryKey({
          address,
          chainId,
          functionName: 'getOwner',
          queryDependencyType: 'standard',
          params: { name: selectedItem.value },
        }),
      )
      const wrapperData = queryClient.getQueryData<GetWrapperDataReturnType>(
        createQueryKey({
          address,
          chainId,
          functionName: 'getWrapperData',
          queryDependencyType: 'standard',
          params: { name: selectedItem.value },
        }),
      )
      const expiryData = queryClient.getQueryData<GetExpiryReturnType>(
        createQueryKey({
          address,
          chainId,
          functionName: 'getExpiry',
          queryDependencyType: 'standard',
          params: { name: selectedItem.value },
        }),
      )
      const priceData = queryClient.getQueryData<GetPriceReturnType>(
        createQueryKey({
          address,
          chainId,
          functionName: 'getPrice',
          queryDependencyType: 'standard',
          params: { name: selectedItem.value, duration: yearsToSeconds(1) },
        }),
      )
      if (ownerData) {
        const registrationStatus = getRegistrationStatus({
          timestamp: Date.now(),
          validation: currentValidation,
          ownerData,
          wrapperData,
          expiryData,
          priceData,
        })
        if (registrationStatus === 'available') {
          path = `/register/${selectedItem.value}`
        }
      }
    }
    if ('isHistory' in selectedItem) {
      delete (selectedItem as SearchItem & { isHistory?: boolean }).isHistory
    }

    setHistory((prev) => [
      ...prev
        .filter((item) => !(item.value === selectedItem.value && item.type === selectedItem.type))
        .slice(0, 25),
      { ...selectedItem, lastAccessed: Date.now() } as HistoryItem,
    ])

    setInputVal('')
    searchInputRef.current?.blur()
    router.pushWithHistory(path)
  }

const useSelectionManager = ({
  inputVal,
  setSelected,
  state,
}: {
  inputVal: any
  setSelected: any
  state: any
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

const thread = (operator, first, ...args) => {
  let isThreadFirst: boolean
  switch (operator) {
    case '->>':
      isThreadFirst = false
      break
    case '->':
      isThreadFirst = true
      break
    default:
      throw new Error('Operator not supported')
      break
  }
  return args.reduce((prev, next) => {
    if (Array.isArray(next)) {
      const [head, ...tail] = next
      return isThreadFirst ? head.apply(this, [prev, ...tail]) : head.apply(this, tail.concat(prev))
    }

    return next.call(this, prev)
  }, first)
}

interface SearchItem {
  isLoading: boolean
  isFromHistory: boolean
  nameType: 'eth-name' | 'addresss' | 'dns'
  value?: string
}

const formatEthText = (name: string, isETH: boolean) => {
  if (!name) return ''
  if (isETH) return name
  if (name.includes('.')) return ''
  return `${name}.eth`
}
const addEthDropdownItem = (
  dropdownItems: SearchItem[],
  name: any,
  ethSearchResult: any,
  isETH: boolean,
) => [
  {
    text: formatEthText(name, isETH),
    isFromHistory: false,
    nameType: 'eth',
  },
  ...dropdownItems,
]

const formatBoxText = (name: string) => {
  if (!name) return ''
  if (name?.endsWith('.box')) return name
  if (name.includes('.')) return ''
  return `${name}.box`
}
const addBoxDropdownItem = (dropdownItems: SearchItem[], name: string, isValid: boolean) => [
  {
    text: formatBoxText(name),
    nameType: 'box',
    isValid,
  },
  ...dropdownItems,
]

const formatTldText = (name: string) => {
  if (!name) return ''
  if (name.includes('.')) return ''
  return name
}
const addTldDropdownItem = (dropdownItems: SearchItem[], name: string) => [
  {
    text: formatTldText(name),
    isLoading: true,
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
const addHistoryDropdownItems = (dropdownItems: SearchItem[], history: any) => {
  console.log('history: ', history)
  const historyItemDrawCount = MAX_DROPDOWN_ITEMS - dropdownItems.length
  const historyItems = history?.slice(0, historyItemDrawCount + 1).map((item) => ({
    text: item.value,
    nameType: 'eth',
  }))

  if (historyItemDrawCount > 0) {
    return [...historyItems, ...dropdownItems]
  }

  return dropdownItems
}

const useBuildDropdownItems = (inputVal: string, history: any): SearchItem[] => {
  const inputIsAddress = useMemo(() => isAddress(inputVal), [inputVal])

  const { isValid, isETH, name } = useValidate({
    input: inputVal,
    enabled: !inputIsAddress && !inputVal,
  })

  // const normalisedName = useMemo(
  //   () => (inputIsAddress ? inputVal : name),
  //   [inputIsAddress, inputVal, name],
  // )

  return thread(
    '->',
    [],
    [addAddressItem, name, inputIsAddress],
    [addEthDropdownItem, name, isETH],
    [addBoxDropdownItem, name, isValid],
    [addTldDropdownItem, name],
    [addHistoryDropdownItems, history],
  )
    .reverse()
    .filter((item) => item.text)
}

const handleSearchh = () => {}

export const SearchInput = ({ size = 'extraLarge' }: { size?: 'medium' | 'extraLarge' }) => {
  const { t } = useTranslation('common')
  const router = useRouterWithHistory()
  const breakpoints = useBreakpoint()
  const queryClient = useQueryClient()
  const chainId = useChainId()
  const { address } = useAccount()

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
  // const [usingPlaceholder, setUsingPlaceholder] = useState(false)
  console.log('selected: ', selected)

  const [history, setHistory] = useLocalStorage<HistoryItem[]>('search-history', [])

  const isEmpty = inputVal === ''
  // const inputIsAddress = useMemo(() => isAddress(inputVal), [inputVal])
  // const { isValid, isETH, is2LD, isShort, type, name } = useValidate({
  //   input: inputVal,
  //   enabled: !inputIsAddress && !isEmpty,
  // })
  // const normalisedOutput = useMemo(
  //   () => (inputIsAddress ? inputVal : name),
  //   [inputIsAddress, inputVal, name],
  // )

  // useSearchResult(normalisedOutput, inputVal)

  // const boxSearchResult = useGetDotBox(normalisedOutput)
  // const ethSearchResult = useEthSearchResult(normalisedOutput, inputVal)

  /*
  const ethSearchItem: SearchItem = useMemo(() => {
    if (isEmpty) {
      return {
        type: 'text',
        value: t('search.emptyText'),
      }
    }
    if (inputIsAddress) {
      return {
        type: 'address',
      }
    }
    if (!isValid) {
      return {
        type: 'error',
        value: t('search.errors.invalid'),
      }
    }
    if (isETH && is2LD && isShort) {
      return {
        type: 'error',
        value: t('search.errors.tooShort'),
      }
    }
    if (type === 'label') {
      return {
        type: 'nameWithDotEth',
      }
    }
    return {
      type: 'name',
    }
  }, [isEmpty, inputIsAddress, isValid, isETH, is2LD, isShort, type, t])
  */

  // const extraItems = useMemo(() => {
  //   if (history.length > 0) {
  //     let historyRef = history
  //     if (normalisedOutput !== '') {
  //       historyRef = history.filter(
  //         (item) =>
  //           item.value !== normalisedOutput &&
  //           item.value.includes(normalisedOutput) &&
  //           (ethSearchItem.type === 'nameWithDotEth'
  //             ? item.value !== `${normalisedOutput}.eth`
  //             : true),
  //       )
  //     }
  //     return historyRef
  //       .sort((a, b) => b.lastAccessed - a.lastAccessed)
  //       .map((item) => ({ ...item, isHistory: true }))
  //   }
  //   return []
  // }, [history, normalisedOutput, ethSearchItem.type])

  // const searchItems: AnyItem[] = useMemo(() => {
  //   const _searchItem = { ...ethSearchItem, isHistory: false }
  //   const boxSearchItemData = boxSearchResult.data
  //   console.log('boxSearchItemData: ', boxSearchItemData)
  //   const boxSearchItem = {
  //     type: 'name',
  //     value: boxSearchItemData?.data.domain,
  //   }
  //   const _extraItems = extraItems
  //   if (ethSearchItem.type === 'error') {
  //     return [_searchItem]
  //   }
  //   if (ethSearchItem.type === 'text') {
  //     if (extraItems.length > 0) {
  //       return [..._extraItems.slice(0, 5)]
  //     }
  //     return [_searchItem]
  //   }
  //   const _searchItems: AnyItem[] =
  //     _searchItem.type === 'nameWithDotEth'
  //       ? [_searchItem, { type: 'name', isHistory: false }]
  //       : [_searchItem]
  //   return [boxSearchItem, ..._searchItems, ...extraItems].slice(0, 5)
  // }, [ethSearchItem, extraItems, boxSearchResult])

  const handleFocusIn = useCallback(() => toggle(true), [toggle])
  const handleFocusOut = useCallback(() => toggle(false), [toggle])

  const dropdownItems = useBuildDropdownItems(inputVal, history)
  console.log('dropdownItems: ', dropdownItems)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  /*
  const handleSearchCb = useCallback(
    handleSearch({
      normalisedOutput,
      queryClient,
      router,
      dropdownItems,
      selected,
      setHistory,
      chainId,
      address,
    }),
    [normalisedOutput, queryClient, router, dropdownItems, selected, setHistory, chainId, address],
  )
  */

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleKeyDownCb = useCallback(handleKeyDown(handleSearch, setSelected, dropdownItems), [
    handleSearch,
    setSelected,
    dropdownItems.length,
  ])

  useAddEventListeners(searchInputRef, handleKeyDownCb, handleFocusIn, handleFocusOut)

  const handleHoverCb = useCallback(
    (index: number) => {
      if (selected !== index) {
        setSelected(index)
      }
    },
    [setSelected, selected],
  )

  useSelectionManager({ inputVal, setSelected, state })

  // useEffect(() => {
  //   debouncer(() => setUsingPlaceholder(false))
  //   setUsingPlaceholder(true)
  // }, [inputVal])

  // useEffect(() => {
  //   if (setSearchState) {
  //     setSearchState(state)
  //   }
  // }, [setSearchState, state])

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
      onMouseLeave={() => inputVal === '' && setSelected(-1)}
      $state="entered"
      // $state={state}
      data-testid="search-input-results"
      // data-error={!isValid && !inputIsAddress && inputVal !== ''}
    >
      {dropdownItems.map((item, index) => (
        <SearchResult
          // clickCallback={handleSearch}
          hoverCallback={handleHoverCb}
          index={index}
          selected={index === selected}
          type={item.type}
          isLoading={item.isLoading}
          key={`${item.nameType}-${item.text}`}
          key={index}
          text={item.text}
          registrationStatus={item.registrationStatus}
          nameType={item.nameType}
        />
      ))}
    </SearchResultsContainer>
  )

  console.log('state: ', state)

  if (breakpoints.sm) {
    return (
      <Container data-testid="search-input-desktop" $size={size}>
        {SearchInputElement}
        {/* {state !== 'unmounted' && SearchResultsElement} */}
        {SearchResultsElement}
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
