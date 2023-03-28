import { ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useInfiniteQuery } from 'wagmi'

import { decryptName } from '@ensdomains/ensjs/utils/labels'
import { Button, Dialog, Heading, RadioButton, RadioButtonGroup, mq } from '@ensdomains/thorin'

import { TaggedNameItem } from '@app/components/@atoms/NameDetailItem/TaggedNameItem'
import { NamePill } from '@app/components/@molecules/NamePill'
import {
  NameTableHeader,
  SortDirection,
  SortType,
} from '@app/components/@molecules/NameTableHeader/NameTableHeader'
import {
  LoadingContainer,
  ScrollBoxWithSpinner,
  SpinnerRow,
} from '@app/components/@molecules/ScrollBoxWithSpinner'
import { useChainId } from '@app/hooks/useChainId'
import { useEns } from '@app/utils/EnsProvider'

import { useAvailablePrimaryNamesForAddress } from '../../hooks/useAvailablePrimaryNamesForAddress'
import useDebouncedCallback from '../../hooks/useDebouncedCallback'
import { makeIntroItem } from '../intro/index'
import { makeTransactionItem } from '../transaction'
import { TransactionDialogPassthrough } from '../types'

const DEFAULT_PAGE_SIZE = 10

type Data = {
  address: string
  existingPrimary: string | null
  action: 'reset' | 'select'
}

type Domain = {
  id: string
  name: string
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

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

const NamePillWrapper = styled.div`
  width: 100%;
  display: inline-block;
`

const NameList = styled.div(
  () => css`
    padding-top: 0.5rem;
    input {
      margin-top: 8px;
    }
  `,
)

const querySize = 50

const SelectPrimaryName = ({ data: { address, existingPrimary }, dispatch, onDismiss }: Props) => {
  const { t } = useTranslation('transactionFlow')

  const chainId = useChainId()
  const { gqlInstance, getResolver } = useEns()

  const [sortType, setSortType] = useState<SortType>('labelName')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [search, _setSearch] = useState('')
  const setSearch = useDebouncedCallback(_setSearch, 300, [])
  const {
    names: currentPage,
    count: namesCount,
    loadMore: loadMoreNames,
  } = useAvailablePrimaryNamesForAddress({
    address,
    sort: {
      type: sortType,
      orderDirection: sortDirection,
    },
    search,
    resultsPerPage: 10,
    page: 1,
  })

  const { data, fetchNextPage, isLoading } = useInfiniteQuery(
    [address, 'primaryNameOptions'],
    async ({ pageParam }: { pageParam?: string }) => {
      const { domains } = await gqlInstance.client.request(
        gqlInstance.gql`
      query getEthRecordAvailableNames($address: String!, $lastID: String, $size: Int!) {
        domains(first: $size, where: { id_gt: $lastID, resolvedAddress: $address }) {
          id
          name
        }
      }
    `,
        {
          address: address.toLowerCase(),
          lastID: pageParam || '0',
          size: querySize,
        },
      )

      if (!domains) return []
      return domains
        .map((domain: any) => {
          const decryptedName = decryptName(domain.name)
          if (decryptedName.includes('[')) return null
          return {
            ...domain,
            name: decryptedName,
          }
        })
        .filter((domain: any) => domain) as Domain[]
    },
    {
      keepPreviousData: true,
      getNextPageParam: (lastPage) => lastPage[lastPage.length - 1]?.id,
    },
  )

  const unfilteredNames = data?.pages?.reduce((prev, curr) => [...prev, ...curr], [] as Domain[])

  const names = unfilteredNames?.filter((name) => name.name !== existingPrimary)

  const hasNextPage = data?.pages[data.pages.length - 1].length === querySize

  const [selectedName, setSelectedName] = useState<string | undefined | any>(undefined)

  const handleSubmit = async () => {
    if (!selectedName) return
    const isWrapped = !!selectedName.fuses
    const hasResolver = !!(await getResolver(selectedName.name))
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
              resolver: '',
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

  let Content: ReactNode

  if (isLoading) {
    Content = (
      <LoadingContainer>
        <Heading>{t('section.primary.input.loading')}</Heading>
        <SpinnerRow />
      </LoadingContainer>
    )
  } else if (names && names.length > 0) {
    Content = (
      <StyledScrollBox showSpinner={hasNextPage} onReachedBottom={() => fetchNextPage()}>
        <NameList>
          <RadioButtonGroup value={selectedName} onChange={(e) => setSelectedName(e.target.value)}>
            {names.map((name) => (
              <RadioButton
                label={
                  <NamePillWrapper>
                    <NamePill
                      name={name.name}
                      truncatedName={name.name}
                      network={chainId}
                      key={name.id}
                    />
                  </NamePillWrapper>
                }
                key={name.id}
                name={name.name}
                value={name.name}
              />
            ))}
          </RadioButtonGroup>
        </NameList>
      </StyledScrollBox>
    )
  } else {
    Content = (
      <LoadingContainer>
        <Heading>
          {unfilteredNames && unfilteredNames.length > 0
            ? t('section.primary.input.noOtherNames')
            : t('section.primary.input.noNames')}
        </Heading>
      </LoadingContainer>
    )
  }

  console.log('selectedName', selectedName)

  return (
    <>
      <HeaderWrapper>
        <Dialog.Heading title="Select a primary name" />
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
                sortTypeOptionValues={['expiryDate', 'labelName', 'creationDate']}
                sortDirection={sortDirection}
                searchQuery={search}
                selectedCount={0}
                onModeChange={() => {}}
                onSortTypeChange={setSortType}
                onSortDirectionChange={setSortDirection}
                onSearchChange={setSearch}
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
                  network={1337}
                  mode="select"
                  selected={selectedName?.name === name.name}
                  onClick={() => setSelectedName(name)}
                />
              ))}
            </>
          ) : (
            <div style={{ height: '100px' }}> No names </div>
          )}
        </StyledScrollBox>
        <Divider />
      </ContentContainer>
      {/* <InnerDialog>{Content}</InnerDialog> */}
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
