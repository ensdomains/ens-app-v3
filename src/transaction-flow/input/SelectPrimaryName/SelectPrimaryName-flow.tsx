import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dialog, Heading, Typography, mq } from '@ensdomains/thorin'

import { InnerDialog } from '@app/components/@atoms/InnerDialog'
import { TaggedNameItem } from '@app/components/@atoms/NameDetailItem/TaggedNameItem'
import {
  NameTableHeader,
  SortDirection,
  SortType,
} from '@app/components/@molecules/NameTableHeader/NameTableHeader'
import { ScrollBoxWithSpinner, SpinnerRow } from '@app/components/@molecules/ScrollBoxWithSpinner'
import { useChainId } from '@app/hooks/useChainId'
import { useEns } from '@app/utils/EnsProvider'
import { RESOLVER_ADDRESSES, emptyAddress } from '@app/utils/constants'

import { useAvailablePrimaryNamesForAddress } from '../../../hooks/useAvailablePrimaryNamesForAddress'
import useDebouncedCallback from '../../../hooks/useDebouncedCallback'
import { makeIntroItem } from '../../intro/index'
import { makeTransactionItem } from '../../transaction'
import { TransactionDialogPassthrough } from '../../types'

const DEFAULT_PAGE_SIZE = 10

type Data = {
  address: string
  existingPrimary: string | null
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

const LoadingContainer = styled(InnerDialog)(
  ({ theme }) => css`
    min-height: ${theme.space['72']};
    justify-content: center;
    align-items: center;
    gap: 0;
  `,
)

const HeaderWrapper = styled.div(({ theme }) => [
  css`
    margin: 0 -${theme.space['4']};
  `,
  mq.sm.min(css``),
])

const ContentContainer = styled.div(({ theme }) => [
  css`
    width: 100%;
    max-height: 60vh;
    display: flex;
    flex-direction: column;
  `,
  mq.sm.min(css`
    width: calc(80vw - 2 * ${theme.space['6']});
    max-width: ${theme.space['128']};
  `),
])

const Divider = styled.div(({ theme }) => [
  css`
    width: calc(100% + 2 * ${theme.space['4']});
    margin: 0 -${theme.space['4']};
    height: ${theme.space.px};
    flex: 0 0 ${theme.space.px};
    background: ${theme.colors.border};
  `,
  mq.sm.min(css`
    width: calc(100% + 2 * ${theme.space['6']});
    margin: 0 -${theme.space['6']};
  `),
])

const NameTableHeaderWrapper = styled.div(({ theme }) => [
  css`
    margin: 0 -${theme.space['4']};
    > div {
      border-bottom: none;
    }
  `,
  mq.sm.min(css`
    margin: 0 -${theme.space['4.5']};
  `),
])

const StyledScrollBox = styled(ScrollBoxWithSpinner)(
  ({ theme }) => css`
    width: ${theme.space.full};

    & > div:nth-last-child(2) {
      border-bottom: none;
    }
  `,
)

const ErrorContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${theme.space['4']};
  `,
)

const SelectPrimaryName = ({ data: { address }, dispatch, onDismiss }: Props) => {
  const { t } = useTranslation('transactionFlow')

  const chainId = useChainId()
  const lastestResolverAddress = RESOLVER_ADDRESSES[`${chainId}`]?.[0]
  const { contracts, ready: isEnsReady, getResolver } = useEns()

  const [sortType, setSortType] = useState<SortType>('labelName')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, _setSearchQuery] = useState('')
  const setSearchQuery = useDebouncedCallback(_setSearchQuery, 300, [])

  const {
    names: currentPage,
    count: namesCount,
    loadMore: loadMoreNames,
    isLoading: isLoadingNames,
  } = useAvailablePrimaryNamesForAddress({
    address,
    sort: {
      type: sortType,
      orderDirection: sortDirection,
    },
    search: searchQuery,
    resultsPerPage: DEFAULT_PAGE_SIZE,
  })

  const isLoading = !isEnsReady || isLoadingNames

  const [selectedName, setSelectedName] = useState<string | undefined | any>(undefined)
  console.log('selectedName', selectedName)

  const handleSubmit = async () => {
    if (!selectedName || !isEnsReady || !contracts) return
    const isWrapped = !!selectedName.fuses
    console.log(selectedName)
    const resolver = await getResolver(selectedName.name)
    const hasResolver = !!resolver && resolver !== emptyAddress
    if (!hasResolver) {
      return dispatch({
        name: 'startFlow',
        key: 'ChangePrimaryName',
        payload: {
          intro: {
            title: ['intro.selectPrimaryName.noResolver.title', { ns: 'transactionFlow' }],
            content: makeIntroItem('GenericWithDescription', {
              description: t('intro.selectPrimaryName.noResolver.description'),
            }),
          },
          transactions: [
            makeTransactionItem('updateResolver', {
              name: selectedName.name,
              contract: isWrapped ? 'nameWrapper' : 'registry',
              resolver: lastestResolverAddress,
            }),
            makeTransactionItem('updateEthAddress', {
              address: address!,
              name: selectedName.name,
            }),
            makeTransactionItem('setPrimaryName', {
              address,
              name: selectedName.name!,
            }),
          ],
        },
      })
    }
    if (!selectedName.isResolvedAddress) {
      return dispatch({
        name: 'startFlow',
        key: 'ChangePrimaryName',
        payload: {
          intro: {
            title: ['intro.selectPrimaryName.updateEthAddress.title', { ns: 'transactionFlow' }],
            content: makeIntroItem('GenericWithDescription', {
              description: t('intro.selectPrimaryName.updateEthAddress.description'),
            }),
          },
          transactions: [
            makeTransactionItem('updateEthAddress', {
              address: address!,
              name: selectedName.name,
            }),
            makeTransactionItem('setPrimaryName', {
              address,
              name: selectedName.name!,
            }),
          ],
        },
      })
    }
    dispatch({
      name: 'setTransactions',
      payload: [
        makeTransactionItem('setPrimaryName', {
          address,
          name: selectedName.name!,
        }),
      ],
    })
    dispatch({
      name: 'setFlowStage',
      payload: 'transaction',
    })
  }

  if (isLoading)
    return (
      <LoadingContainer>
        <Heading>{t('loading', { ns: 'common' })}</Heading>
        <SpinnerRow />
      </LoadingContainer>
    )
  return (
    <>
      <HeaderWrapper>
        <Dialog.Heading title={t('input.selectPrimaryName.title')} />
      </HeaderWrapper>
      <ContentContainer>
        <Divider />
        {namesCount > DEFAULT_PAGE_SIZE && (
          <>
            <NameTableHeaderWrapper>
              <NameTableHeader
                mode="view"
                selectable={false}
                sortType={sortType}
                sortTypeOptionValues={['labelName', 'creationDate', 'expiryDate']}
                sortDirection={sortDirection}
                searchQuery={searchInput}
                selectedCount={0}
                onModeChange={() => {}}
                onSortTypeChange={(type) => setSortType(type as SortType)}
                onSortDirectionChange={setSortDirection}
                onSearchChange={(search) => {
                  setSearchInput(search)
                  setSearchQuery(search)
                }}
              />
            </NameTableHeaderWrapper>
            <Divider />
          </>
        )}
        <StyledScrollBox hideDividers onReachedBottom={loadMoreNames}>
          {!!currentPage && currentPage.length > 0 ? (
            <>
              {currentPage?.map((name) => (
                <TaggedNameItem
                  key={name.id}
                  {...name}
                  network={chainId}
                  mode="select"
                  selected={selectedName?.name === name.name}
                  onClick={() => {
                    setSelectedName(selectedName?.name === name.name ? undefined : name)
                  }}
                />
              ))}
            </>
          ) : (
            <ErrorContainer>
              <Typography fontVariant="bodyBold" color="grey">
                {namesCount > 0
                  ? t('input.selectPrimaryName.errors.noNamesFound')
                  : t('input.selectPrimaryName.errors.noEligibleNames')}
              </Typography>
            </ErrorContainer>
          )}
        </StyledScrollBox>
        <Divider />
      </ContentContainer>
      <Dialog.Footer
        leading={
          <Button colorStyle="accentSecondary" onClick={onDismiss}>
            {t('action.cancel', { ns: 'common' })}
          </Button>
        }
        trailing={
          <Button data-testid="primary-next" onClick={handleSubmit} disabled={!selectedName}>
            {t('action.next', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}

export default SelectPrimaryName
