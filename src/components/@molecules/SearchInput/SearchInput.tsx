import { QueryClient, useQueryClient } from '@tanstack/react-query'
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
import { TFunction, useTranslation } from 'react-i18next'
import useTransition, { TransitionState } from 'react-transition-state'
import styled, { css } from 'styled-components'
import { match } from 'ts-pattern'
import { Address, isAddress } from 'viem'
import { useAccount, useChainId } from 'wagmi'

import {
  GetExpiryReturnType,
  GetPriceReturnType,
  GetWrapperDataReturnType,
} from '@ensdomains/ensjs/public'
import { BackdropSurface, Portal, Typography } from '@ensdomains/thorin'

import { SupportedChain } from '@app/constants/chains'
import {
  UseDotBoxAvailabilityOnchainQueryKey,
  UseDotBoxAvailabilityOnchainReturnType,
} from '@app/hooks/dotbox/useDotBoxAvailabilityOnchain'
import {
  UseAddressRecordQueryKey,
  UseAddressRecordReturnType,
} from '@app/hooks/ensjs/public/useAddressRecord'
import { UseExpiryQueryKey } from '@app/hooks/ensjs/public/useExpiry'
import { UseOwnerQueryKey, UseOwnerReturnType } from '@app/hooks/ensjs/public/useOwner'
import { UsePriceQueryKey } from '@app/hooks/ensjs/public/usePrice'
import { UseWrapperDataQueryKey } from '@app/hooks/ensjs/public/useWrapperData'
import { useLocalStorage } from '@app/hooks/useLocalStorage'
import { createQueryKey } from '@app/hooks/useQueryOptions'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { useValidate, validate } from '@app/hooks/useValidate'
import { useElementSize } from '@app/hooks/useWindowSize'
import { CreateQueryKey, GenericQueryKey } from '@app/types'
import { sendEvent } from '@app/utils/analytics/events'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { getRegistrationStatus } from '@app/utils/registrationStatus'
import { thread, yearsToSeconds } from '@app/utils/utils'

import { FakeSearchInputBox, SearchInputBox } from './SearchInputBox'
import { getBoxNameStatus, SearchResult } from './SearchResult'
import { HistoryItem, SearchHandler, SearchItem } from './types'

const Container = styled.div<{ $size: 'medium' | 'extraLarge' }>(
  ({ $size, theme }) => css`
    width: 100%;
    position: relative;
    ${$size === 'extraLarge' &&
    ` @media (min-width: ${theme.breakpoints.sm}px) {
       padding-left: 48px;
      padding-right: 48px;
    }`}
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

    background-color: ${theme.colors.background};
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
          transform: translateY(0);
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

type MobileSearchInputProps = {
  state: TransitionState
  toggle: (value: boolean) => void
  searchInputRef: RefObject<HTMLInputElement>
  SearchResultsElement: JSX.Element
  SearchInputElement: JSX.Element
}

const MobileSearchInput = ({
  state,
  toggle,
  searchInputRef,
  SearchResultsElement,
  SearchInputElement,
}: MobileSearchInputProps) => {
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
          <BackdropSurface $empty={false} onClick={() => toggle(false)} $state={state} />
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

const createCachedQueryDataGetter =
  ({
    queryClient,
    chainId,
    address,
  }: {
    queryClient: QueryClient
    chainId: SupportedChain['id']
    address: Address | undefined
  }) =>
  <TData, TQueryKey extends GenericQueryKey<'standard'>>({
    functionName,
    params,
  }: {
    functionName: TQueryKey[4]
    params: TQueryKey[0]
  }) => {
    return queryClient.getQueryData<
      TData,
      CreateQueryKey<typeof params, typeof functionName, 'standard'>
    >(
      createQueryKey({
        address,
        chainId,
        functionName,
        queryDependencyType: 'standard',
        params,
      }),
    )
  }

const getRouteForSearchItem = ({
  address,
  chainId,
  queryClient,
  selectedItem,
}: {
  address: Address | undefined
  chainId: SupportedChain['id']
  queryClient: QueryClient
  selectedItem: Exclude<SearchItem, { nameType: 'error' } | { nameType: 'text' }>
}) => {
  if (selectedItem.nameType === 'address') return `/address/${selectedItem.text}`

  const getCachedQueryData = createCachedQueryDataGetter({ queryClient, chainId, address })
  if (selectedItem.nameType === 'box') {
    const isAvailableOnchain = getCachedQueryData<
      UseDotBoxAvailabilityOnchainReturnType,
      UseDotBoxAvailabilityOnchainQueryKey
    >({
      functionName: 'getDotBoxAvailabilityOnchain',
      params: { name: selectedItem.text, isValid: selectedItem.isValid },
    })
    const boxStatus = getBoxNameStatus({
      isValid: selectedItem.isValid,
      isAvailable: isAvailableOnchain,
    })
    if (boxStatus === 'available') return `/dotbox/${selectedItem.text}`
  }

  if (selectedItem.nameType === 'eth' || selectedItem.nameType === 'dns') {
    const ownerData = getCachedQueryData<UseOwnerReturnType, UseOwnerQueryKey>({
      functionName: 'getOwner',
      params: { name: selectedItem.text },
    })
    const wrapperData = getCachedQueryData<GetWrapperDataReturnType, UseWrapperDataQueryKey>({
      functionName: 'getWrapperData',
      params: { name: selectedItem.text },
    })
    const expiryData = getCachedQueryData<GetExpiryReturnType, UseExpiryQueryKey>({
      functionName: 'getExpiry',
      params: { name: selectedItem.text },
    })
    const priceData = getCachedQueryData<GetPriceReturnType, UsePriceQueryKey>({
      functionName: 'getPrice',
      params: { nameOrNames: selectedItem.text, duration: yearsToSeconds(1) },
    })
    const addrData = getCachedQueryData<UseAddressRecordReturnType, UseAddressRecordQueryKey>({
      functionName: 'getAddressRecord',
      params: { name: selectedItem.text },
    })

    if (typeof ownerData !== 'undefined') {
      const registrationStatus = getRegistrationStatus({
        timestamp: Date.now(),
        validation: validate(selectedItem.text),
        ownerData,
        wrapperData,
        expiryData,
        priceData,
        addrData,
        supportedTLD: true,
      })
      if (registrationStatus === 'available') return `/register/${selectedItem.text}`
      if (registrationStatus === 'notImported') return `/import/${selectedItem.text}`
    }
  }

  return `/profile/${selectedItem.text}`
}

type CreateSearchHandlerProps = {
  address: Address | undefined
  chainId: SupportedChain['id']
  dropdownItems: SearchItem[]
  router: ReturnType<typeof useRouterWithHistory>
  searchInputRef: RefObject<HTMLInputElement>
  setHistory: Dispatch<SetStateAction<HistoryItem[]>>
  setInputVal: Dispatch<SetStateAction<string>>
  queryClient: QueryClient
}

const createSearchHandler =
  ({
    address,
    chainId,
    dropdownItems,
    router,
    searchInputRef,
    setHistory,
    setInputVal,
    queryClient,
  }: CreateSearchHandlerProps): SearchHandler =>
  (index: number) => {
    if (index === -1) return

    const selectedItem = dropdownItems[index]
    if (!selectedItem?.text) return

    const { text, nameType } = selectedItem
    if (nameType === 'error' || nameType === 'text') return

    setHistory((prev: HistoryItem[]) => [
      ...prev.filter((item) => !(item.text === text && item.nameType === nameType)),
      { lastAccessed: Date.now(), nameType, text, isValid: selectedItem.isValid },
    ])

    const path = getRouteForSearchItem({ address, chainId, queryClient, selectedItem })

    const searchType = match(path)
      .with(`/register/${text}`, () => 'eth' as const)
      .with(`/dotbox/${text}`, () => 'box' as const)
      .with(`/import/${text}`, () => 'dns' as const)
      .otherwise(() => undefined)

    if (searchType)
      sendEvent('search:select', {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ens_name_type: searchType,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ens_name: text,
      })

    setInputVal('')
    searchInputRef.current?.blur()
    router.pushWithHistory(path)
  }

type UseAddEventListenersProps = {
  searchInputRef: RefObject<HTMLInputElement>
  handleKeyDown: (e: KeyboardEvent) => void
  handleFocusIn: (e: FocusEvent) => void
  handleFocusOut: (e: FocusEvent) => void
}

const useAddEventListeners = ({
  searchInputRef,
  handleKeyDown,
  handleFocusIn,
  handleFocusOut,
}: UseAddEventListenersProps) => {
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

type HandleKeyDownProps = {
  dropdownItems: SearchItem[]
  handleSearch: SearchHandler
  selected: number
  setSelected: Dispatch<SetStateAction<number>>
}

const handleKeyDown =
  ({ dropdownItems, handleSearch, selected, setSelected }: HandleKeyDownProps) =>
  (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(selected)
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

const formatEthText = ({ name, isETH }: { name: string; isETH: boolean | undefined }) => {
  if (!name) return ''
  if (isETH) return name
  if (name.includes('.')) return ''
  if (name === '[root]') return ''
  return `${name}.eth`
}
const addEthDropdownItem =
  ({ name, isETH }: { name: string; isETH: boolean | undefined }) =>
  (dropdownItems: SearchItem[]): SearchItem[] => {
    const formattedEthName = formatEthText({ name, isETH })
    if (formattedEthName === '') return dropdownItems
    return [
      {
        text: formattedEthName,
        nameType: 'eth',
      } as const,
      ...dropdownItems,
    ]
  }

const isBoxValid = (name: string) => {
  /*
    This regular expression will match any string that starts and ends with a letter or a digit, 
    does not have a hyphen in the third or fourth position, does not include a space, and 
    consists only of the characters a-z, A-Z, 0-9, and - in between, but does not start or end 
    with a hyphen.

    This is to comply with .box name rules. 
  */
  const regex = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/

  if (!name.endsWith('.box')) return false
  if (name.length > 63) return false
  if (!regex.test(name.slice(0, -4))) return false
  return true
}
const formatBoxText = (name: string) => {
  if (!name) return ''
  if (name?.endsWith('.box')) return name
  if (name.includes('.')) return ''
  if (name === '[root]') return ''
  return `${name}.box`
}
const addBoxDropdownItem =
  ({ name, isValid }: { name: string; isValid: boolean | undefined }) =>
  (dropdownItems: SearchItem[]): SearchItem[] => {
    const formattedBoxName = formatBoxText(name)
    if (!formattedBoxName) return dropdownItems
    return [
      ...dropdownItems,
      {
        text: formattedBoxName,
        nameType: 'box',
        isValid: isValid && isBoxValid(formattedBoxName),
      } as const,
    ]
  }

const formatTldText = (name: string) => {
  if (!name) return ''
  if (name.includes('.')) return ''
  return name
}
const addTldDropdownItem =
  ({ name }: { name: string }) =>
  (dropdownItems: SearchItem[]): SearchItem[] => {
    const formattedTld = formatTldText(name)
    if (!formattedTld) return dropdownItems
    return [
      ...dropdownItems,
      {
        text: formattedTld,
        nameType: 'tld',
      } as const,
    ]
  }

const addAddressItem =
  ({ name, inputIsAddress }: { name: string; inputIsAddress: boolean }) =>
  (dropdownItems: SearchItem[]): SearchItem[] => {
    if (!inputIsAddress) return dropdownItems
    return [
      {
        text: name,
        nameType: 'address',
      } as const,
      ...dropdownItems,
    ]
  }

const MAX_DROPDOWN_ITEMS = 6
const addHistoryDropdownItems =
  ({ name, history }: { name: string; history: HistoryItem[] }) =>
  (dropdownItems: SearchItem[]): SearchItem[] => {
    const historyItemDrawCount = MAX_DROPDOWN_ITEMS - dropdownItems.length

    if (historyItemDrawCount > 0) {
      const filteredHistoryItems = history
        .filter(
          (historyItem: HistoryItem) =>
            historyItem.text.includes(name) &&
            dropdownItems.findIndex(
              (dropdownItem) =>
                dropdownItem.nameType === historyItem.nameType &&
                dropdownItem.text === historyItem.text,
            ) === -1,
        )
        .sort((a, b) => b.lastAccessed - a.lastAccessed)

      const historyItems = filteredHistoryItems?.slice(0, historyItemDrawCount).map((item) => ({
        nameType: item.nameType,
        text: item.text,
        isHistory: true,
      }))

      return [...dropdownItems, ...historyItems]
    }

    return dropdownItems
  }

const formatDnsText = ({ name, isETH }: { name: string; isETH: boolean | undefined }) => {
  if (!name) return ''
  if (!name.includes('.')) return ''
  if (name.endsWith('.box')) return ''
  if (isETH) return ''
  if (name === '[root]') return ''
  return name
}
const addDnsDropdownItem =
  ({ name, isETH }: { name: string; isETH: boolean | undefined }) =>
  (dropdownItems: SearchItem[]): SearchItem[] => {
    const formattedDnsName = formatDnsText({ name, isETH })
    if (!formattedDnsName) return dropdownItems
    return [
      ...dropdownItems,
      {
        text: formattedDnsName,
        nameType: 'dns',
      } as const,
    ]
  }

const addErrorDropdownItem =
  ({ name, isValid }: { name: string; isValid: boolean | undefined }) =>
  (dropdownItems: SearchItem[]): SearchItem[] => {
    if (isValid || name === '') return dropdownItems
    return [
      {
        text: 'Invalid name',
        nameType: 'error',
      } as const,
    ]
  }

const addInfoDropdownItem =
  ({ t }: { t: TFunction }) =>
  (dropdownItems: SearchItem[]): SearchItem[] => {
    if (dropdownItems.length) return dropdownItems
    return [
      {
        text: t('search.emptyText'),
        nameType: 'text',
      } as const,
    ]
  }

const useBuildDropdownItems = (inputVal: string, history: HistoryItem[]) => {
  const { t } = useTranslation('common')

  const inputIsAddress = useMemo(() => isAddress(inputVal), [inputVal])

  const { isValid, isETH, name } = useValidate({
    input: inputVal,
  })

  return useMemo(
    () =>
      thread(
        [],
        addEthDropdownItem({ name, isETH }),
        addBoxDropdownItem({ name, isValid }),
        addDnsDropdownItem({ name, isETH }),
        addAddressItem({ name, inputIsAddress }),
        addTldDropdownItem({ name }),
        addHistoryDropdownItems({ name, history }),
        addErrorDropdownItem({ name, isValid }),
        addInfoDropdownItem({ t }),
      ),
    [inputIsAddress, name, isETH, isValid, history, t],
  )
}

const debounce = (func: (...args: any[]) => void, delay?: number) => {
  let timerId: NodeJS.Timeout
  let shouldInvoke: boolean

  return (...args: any[]) => {
    shouldInvoke = true

    clearTimeout(timerId)

    timerId = setTimeout(() => shouldInvoke && func(...args), delay)
  }
}

const debouncer = debounce((setFunc: () => void) => setFunc(), 250)

export const SearchInput = ({ size = 'extraLarge' }: { size?: 'medium' | 'extraLarge' }) => {
  const router = useRouterWithHistory()
  const queryClient = useQueryClient()
  const breakpoints = useBreakpoint()

  const { address } = useAccount()
  const chainId = useChainId()

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
  const [usingPlaceholder, setUsingPlaceholder] = useState(false)

  const [history, setHistory] = useLocalStorage<HistoryItem[]>('search-history-v2', [])

  const handleFocusIn = useCallback(() => toggle(true), [toggle])
  const handleFocusOut = useCallback(() => toggle(false), [toggle])

  const dropdownItems = useBuildDropdownItems(inputVal, history)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    createSearchHandler({
      address,
      chainId,
      dropdownItems,
      queryClient,
      router,
      searchInputRef,
      setHistory,
      setInputVal,
    }),
    [address, chainId, dropdownItems, queryClient, router, searchInputRef, setHistory, setInputVal],
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleKeyDownCb = useCallback(
    handleKeyDown({ dropdownItems, handleSearch, selected, setSelected }),
    [handleSearch, setSelected, dropdownItems.length, selected],
  )

  useAddEventListeners({
    searchInputRef,
    handleKeyDown: handleKeyDownCb,
    handleFocusIn,
    handleFocusOut,
  })

  useSelectionManager({ inputVal, setSelected, state })

  const setInput = (val: string) => {
    setInputVal(val)
    setUsingPlaceholder(true)
    debouncer(() => setUsingPlaceholder(false))
  }

  const SearchInputElement = (
    <SearchInputBox
      containerRef={searchInputContainerRef}
      ref={searchInputRef}
      input={inputVal}
      setInput={setInput}
      size={size}
    />
  )

  const SearchResultsElement = (
    <SearchResultsContainer
      style={{
        width: width === Infinity ? undefined : width,
      }}
      onMouseLeave={() => inputVal === '' && setSelected(-1)}
      $state={state}
      data-testid="search-input-results"
    >
      {dropdownItems.map((searchItem, index) => (
        <SearchResult
          clickCallback={handleSearch}
          hoverCallback={setSelected}
          index={index}
          selected={index === selected}
          searchItem={searchItem}
          key={
            searchItem.isHistory
              ? `${searchItem.nameType}-${searchItem.text}`
              : `${searchItem.nameType}`
          }
          usingPlaceholder={searchItem.isHistory ? false : usingPlaceholder}
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
