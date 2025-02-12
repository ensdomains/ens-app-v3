import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { match, P } from 'ts-pattern'
import type { Address } from 'viem'

import { Name } from '@ensdomains/ensjs/subgraph'
import { Button, Spinner } from '@ensdomains/thorin'

import FastForwardSVG from '@app/assets/FastForward.svg'
import { InfiniteScrollContainer } from '@app/components/@atoms/InfiniteScrollContainer/InfiniteScrollContainer'
import { TaggedNameItem } from '@app/components/@atoms/NameDetailItem/TaggedNameItem'
import {
  NameTableHeader,
  NameTableMode,
  SortDirection,
  SortType,
} from '@app/components/@molecules/NameTableHeader/NameTableHeader'
import { TabWrapper } from '@app/components/pages/profile/TabWrapper'
import { usePrefetchBlockTimestamp } from '@app/hooks/chain/useBlockTimestamp'
import { useNamesForAddress } from '@app/hooks/ensjs/subgraph/useNamesForAddress'
import useDebouncedCallback from '@app/hooks/useDebouncedCallback'
import { useQueryParameterState } from '@app/hooks/useQueryParameterState'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

const EmptyDetailContainer = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['4']};
    display: flex;
    justify-content: center;
    align-items: center;
  `,
)

const TabWrapperWithButtons = styled(TabWrapper)(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: normal;
    justify-content: flex-start;
    width: 100%;
    max-width: 100%;
    background: ${theme.colors.backgroundPrimary};
  `,
)

const Footer = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: ${theme.space['8']};
    border-top: 1px solid ${theme.colors.border};
  `,
)

type NameListViewProps = {
  address: Address | undefined
  selfAddress: Address | undefined
  setError?: (isError: boolean) => void
  setLoading?: (isLoading: boolean) => void
}

export const NameListView = ({ address, selfAddress, setError, setLoading }: NameListViewProps) => {
  const { t } = useTranslation('names')
  /**
   * Normal useQueries are in idle state until it reaches the client side, but useInfiniteQuery does not and
   * starts in success state when it has persistent data. This causes a hydration error
   */
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const [mode, setMode] = useState<NameTableMode>('view')
  const [selectedNames, setSelectedNames] = useState<Name[]>([])

  const [sortType, setSortType] = useQueryParameterState<SortType>('sort', 'expiryDate')
  const [sortDirection, setSortDirection] = useQueryParameterState<SortDirection>(
    'direction',
    'asc',
  )
  const [searchQuery, setSearchQuery] = useQueryParameterState<string>('search', '')
  const debouncedSetSearch = useDebouncedCallback(setSearchQuery)
  const [searchInput, setSearchInput] = useState(searchQuery)

  const {
    infiniteData: names,
    nameCount,
    isLoading: isNamesLoading,
    isFetching,
    isError,
    fetchNextPage,
    hasNextPage,
  } = useNamesForAddress({
    address: address!,
    orderBy: sortType,
    orderDirection: sortDirection,
    pageSize: 20,
    filter: {
      searchString: searchQuery,
      searchType: 'name',
      resolvedAddress: false,
    },
  })

  // useBlockTimestamp() is used in:
  // <TaggedNameItem />
  // => <NameDetailItem />
  //   => <ShortExpiry />
  usePrefetchBlockTimestamp()

  useEffect(() => {
    setError?.(isError)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError])

  useEffect(() => {
    setLoading?.(isNamesLoading)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNamesLoading])

  const { usePreparedDataInput, getTransactionFlowStage } = useTransactionFlow()
  const showExtendNamesInput = usePreparedDataInput('ExtendNames')

  const [isIntersecting, setIsIntersecting] = useState(false)
  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetching) {
      fetchNextPage()
    }
  }, [isIntersecting, fetchNextPage, hasNextPage, isFetching])

  const handleExtend = () => {
    if (selectedNames.length === 0) return
    showExtendNamesInput(`extend-names-${selectedNames.join('-')}`, {
      names: selectedNames.map((n) => n.name!),
      isSelf: selectedNames.every(
        (n) => n.registrant === selfAddress || n.wrappedOwner === selfAddress,
      ),
    })
  }

  const stage = getTransactionFlowStage(`extend-names-${selectedNames.join('-')}`)
  useEffect(() => {
    if (stage === 'completed') {
      setSelectedNames([])
      setMode('view')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage])

  const isNameExtendable = (name: Name) =>
    name.parentName === 'eth' && !!name.name && !name.name.includes('Invalid ENS Name')

  const isNameDisabled = useCallback(
    (name: Name) => {
      if (mode !== 'select') return false
      return !isNameExtendable(name)
    },
    [mode],
  )

  const handleClickName = (name: Name) => () => {
    if (!isNameExtendable(name)) return

    const isExists = selectedNames.find((n) => n.id === name.id)

    const _selectedNames = isExists
      ? selectedNames.filter((n) => n.id !== name.id)
      : [...selectedNames, name]
    setSelectedNames(_selectedNames)
    setMode(_selectedNames.length ? 'select' : 'view')
  }

  const isLoading = isNamesLoading || !address

  return (
    <TabWrapperWithButtons>
      <NameTableHeader
        mode={mode}
        sortType={sortType}
        sortTypeOptionValues={['expiryDate', 'labelName', 'createdAt']}
        sortDirection={sortDirection}
        searchQuery={searchInput}
        selectedCount={selectedNames.length}
        onModeChange={(value) => {
          setMode(value)
          setSelectedNames(value === 'view' ? [] : [...names].filter(isNameExtendable))
        }}
        onSortDirectionChange={setSortDirection}
        onSortTypeChange={setSortType}
        onSearchChange={(s) => {
          setSearchInput(s)
          debouncedSetSearch(s)
        }}
      >
        {mode === 'select' && (
          <Button
            size="small"
            onClick={handleExtend}
            data-testid="extend-names-button"
            prefix={FastForwardSVG}
            disabled={selectedNames.length === 0}
          >
            {t('action.extend', { ns: 'common' })}
          </Button>
        )}
      </NameTableHeader>
      <div data-testid="names-list">
        {match([isMounted, isLoading, nameCount, searchQuery])
          .with([false, P._, P._, P._], () => null)
          .with([true, true, P._, P._], () => (
            <EmptyDetailContainer>
              <Spinner color="accent" />
            </EmptyDetailContainer>
          ))
          .with([true, false, 0, ''], () => (
            <EmptyDetailContainer>{t('empty')}</EmptyDetailContainer>
          ))
          .with([true, false, 0, P._], () => (
            <EmptyDetailContainer>{t('empty')}</EmptyDetailContainer>
          ))
          .with([true, false, P.when((_nameCount) => _nameCount), P._], () => (
            <InfiniteScrollContainer onIntersectingChange={setIsIntersecting}>
              <div>
                {names.map((name) => (
                  <TaggedNameItem
                    key={name.id}
                    {...name}
                    mode={mode}
                    selected={
                      !!selectedNames?.find((selectedName) => selectedName.name === name.name!)
                    }
                    disabled={isNameDisabled(name)}
                    onClick={handleClickName(name)}
                  />
                ))}
              </div>
              {isFetching && (
                <EmptyDetailContainer>
                  <Spinner color="accent" />
                </EmptyDetailContainer>
              )}
            </InfiniteScrollContainer>
          ))
          .otherwise(() => `${names.length}`)}
      </div>
      <Footer />
    </TabWrapperWithButtons>
  )
}
