import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Button, PlusSVG, Spinner, Typography, mq } from '@ensdomains/thorin'

import {
  NameTableHeader,
  SortDirection,
  SortType,
} from '@app/components/@molecules/NameTableHeader/NameTableHeader'
import { Card } from '@app/components/Card'
import { Outlink } from '@app/components/Outlink'
import { TabWrapper } from '@app/components/pages/profile/TabWrapper'
import { SubnameSortType, useSubnameInfiniteQuery } from '@app/hooks/useSubnameInfiniteQuery'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import useDebouncedCallback from '../../../../../hooks/useDebouncedCallback'
import { InfiniteScrollContainer } from '../../../../@atoms/InfiniteScrollContainer/InfiniteScrollContainer'
import { TaggedNameItem } from '../../../../@atoms/NameDetailItem/TaggedNameItem'

const TabWrapperWithButtons = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    width: 100%;
    gap: ${theme.space['4']};
  `,
)

const StyledTabWrapper = styled(TabWrapper)(() => css``)

const Footer = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: ${theme.space['8']};
    border-top: 1px solid ${theme.colors.border};
  `,
)

const NoMoreResultsContainer = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['2']};
    display: flex;
    align-items: center;
    justify-content: center;
    height: ${theme.space['15']};
  `,
)

const AddSubnamesCard = styled(Card)(
  ({ theme }) => css`
    padding: ${theme.space['6']};
    flex-direction: column;
    text-align: center;
    gap: ${theme.space['4']};

    & > button {
      width: 100%;
    }

    ${mq.md.min(css`
      flex-direction: row;
      text-align: left;
      & > button {
        width: min-content;
      }
    `)}
  `,
)

const PlusPrefix = styled.svg(
  ({ theme }) => css`
    display: block;
    stroke-width: ${theme.space['0.75']};
    height: ${theme.space['5']};
    width: ${theme.space['5']};
  `,
)

const SpinnerContainer = styled.div<{ $showBorder?: boolean }>(
  ({ theme, $showBorder }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: ${theme.space['15']};
    ${$showBorder && `border-top: 1px solid ${theme.colors.border};`}
  `,
)

export const SubnamesTab = ({
  name,
  network,
  canEdit,
  isWrapped,
}: {
  name: string
  network: number
  canEdit: boolean
  isWrapped: boolean
}) => {
  const router = useRouter()
  const { t } = useTranslation('profile')
  const { address } = useAccount()
  const { showDataInput } = useTransactionFlow()

  const [sortType, setSortType] = useState<SubnameSortType | undefined>()
  const [sortDirection, setSortDirection] = useState(SortDirection.desc)
  const [searchInput, setSearchInput] = useState((router.query.search as string) || '')

  const searchQuery = (router.query.search as string) || ''
  const [_searchQuery, setSearchQuery] = useState(searchQuery)
  const debouncedSetSearch = useDebouncedCallback(setSearchQuery, 500)

  useEffect(() => {
    const url = new URL(router.asPath, window.location.origin)
    url.searchParams.set('search', _searchQuery)
    router.replace(url.toString(), undefined, { shallow: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_searchQuery])

  const { subnames, isLoading, isFetching, fetchNextPage, hasNextPage } = useSubnameInfiniteQuery(
    name,
    sortType,
    sortDirection,
    searchQuery,
  )

  const [isIntersecting, setIsIntersecting] = useState(false)
  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetching) {
      fetchNextPage()
    }
  }, [isIntersecting, fetchNextPage, hasNextPage, isFetching])

  const createSubname = () =>
    showDataInput(`make-subname-${name}`, 'CreateSubname', {
      parent: name,
      isWrapped,
    })

  let InnerContent: ReactNode
  if (isLoading) {
    InnerContent = (
      <SpinnerContainer>
        <Spinner size="small" color="accent" />
      </SpinnerContainer>
    )
  } else if (subnames.length === 0 && searchQuery === '') {
    InnerContent = (
      <NoMoreResultsContainer>{t('details.tabs.subnames.empty')}</NoMoreResultsContainer>
    )
  } else if (subnames.length === 0) {
    InnerContent = (
      <NoMoreResultsContainer>{t('details.tabs.subnames.noResults')}</NoMoreResultsContainer>
    )
  } else if (subnames.length > 0) {
    InnerContent = (
      <InfiniteScrollContainer onIntersectingChange={setIsIntersecting}>
        <div>
          {subnames.map((subname) => (
            <TaggedNameItem
              key={subname.name}
              name={subname.name}
              truncatedName={subname.truncatedName}
              network={network}
              mode="view"
              isController={subname.owner ? subname.owner === address?.toLowerCase() : undefined}
              fuses={subname.fuses}
              expiryDate={subname.expiryDate}
            />
          ))}
        </div>
        {isFetching && (
          <SpinnerContainer $showBorder>
            <Spinner size="small" color="accent" />
          </SpinnerContainer>
        )}
      </InfiniteScrollContainer>
    )
  } else {
    InnerContent = `${subnames.length}`
  }

  return (
    <TabWrapperWithButtons>
      {canEdit && (
        <AddSubnamesCard>
          <Typography>
            {t('details.tabs.subnames.addSubname.title')}{' '}
            <Outlink href="/faq/managing-a-name#what-is-the-difference-between-a-name-and-a-subname">
              {t('details.tabs.subnames.addSubname.learn')}
            </Outlink>
          </Typography>
          <Button
            data-testid="add-subname-action"
            onClick={createSubname}
            prefix={<PlusPrefix as={PlusSVG} />}
          >
            {t('details.tabs.subnames.addSubname.action')}
          </Button>
        </AddSubnamesCard>
      )}
      <StyledTabWrapper>
        <NameTableHeader
          selectable={false}
          sortType={sortType}
          sortTypeOptionValues={[SortType.creationDate, SortType.labelName]}
          sortDirection={sortDirection}
          searchQuery={searchInput}
          mode="view"
          onSortTypeChange={(value: SortType) => {
            if (['creationDate', 'labelName'].includes(value)) setSortType(value as SubnameSortType)
          }}
          onSortDirectionChange={setSortDirection}
          onSearchChange={(s) => {
            setSearchInput(s)
            debouncedSetSearch(s)
          }}
        />
        <div>{InnerContent}</div>
        <Footer />
      </StyledTabWrapper>
    </TabWrapperWithButtons>
  )
}
