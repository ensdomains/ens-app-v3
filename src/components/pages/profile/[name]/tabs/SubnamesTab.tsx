import { ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { GetSubnamesParameters } from '@ensdomains/ensjs/subgraph'
import { Button, PlusSVG, Spinner, Typography } from '@ensdomains/thorin'

import { DisabledButtonWithTooltip } from '@app/components/@molecules/DisabledButtonWithTooltip'
import {
  NameTableHeader,
  SortDirection,
  SortType,
} from '@app/components/@molecules/NameTableHeader/NameTableHeader'
import { Card } from '@app/components/Card'
import { Outlink } from '@app/components/Outlink'
import { TabWrapper } from '@app/components/pages/profile/TabWrapper'
import { useSubnames } from '@app/hooks/ensjs/subgraph/useSubnames'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { emptyAddress } from '@app/utils/constants'
import { getSupportLink } from '@app/utils/supportLinks'

import useDebouncedCallback from '../../../../../hooks/useDebouncedCallback'
import { useQueryParameterState } from '../../../../../hooks/useQueryParameterState'
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
    color: ${theme.colors.text};
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
    @media (min-width: ${theme.breakpoints.sm}px) {
      flex-direction: row;
      text-align: left;
      & > button {
        width: min-content;
      }
    }
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
  canEdit,
  canCreateSubdomains,
  canCreateSubdomainsError,
  isWrapped,
}: {
  name: string
  canEdit: boolean
  canCreateSubdomains: boolean
  canCreateSubdomainsError?: string
  isWrapped: boolean
}) => {
  const { t } = useTranslation('profile')
  const { address } = useAccount()
  const { usePreparedDataInput } = useTransactionFlow()
  const showCreateSubnameInput = usePreparedDataInput('CreateSubname')

  const [sortType, setSortType] = useQueryParameterState<
    NonNullable<GetSubnamesParameters['orderBy']>
  >('sort', 'createdAt')
  const [sortDirection, setSortDirection] = useQueryParameterState<SortDirection>(
    'direction',
    'desc',
  )
  const [searchQuery, setSearchQuery] = useQueryParameterState<string>('search', '')
  const debouncedSetSearch = useDebouncedCallback(setSearchQuery, 500)
  const [searchInput, setSearchInput] = useState(searchQuery)

  const {
    infiniteData: subnames,
    nameCount,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useSubnames({
    name,
    orderBy: sortType,
    orderDirection: sortDirection,
    searchString: searchQuery,
  })

  const [isIntersecting, setIsIntersecting] = useState(false)
  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetching) {
      fetchNextPage()
    }
  }, [isIntersecting, fetchNextPage, hasNextPage, isFetching])

  const createSubname = () =>
    showCreateSubnameInput(`make-subname-${name}`, {
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
  } else if (nameCount === 0 && searchQuery === '') {
    InnerContent = (
      <NoMoreResultsContainer>{t('details.tabs.subnames.empty')}</NoMoreResultsContainer>
    )
  } else if (nameCount === 0) {
    InnerContent = (
      <NoMoreResultsContainer>{t('details.tabs.subnames.noResults')}</NoMoreResultsContainer>
    )
  } else if (nameCount) {
    InnerContent = (
      <InfiniteScrollContainer onIntersectingChange={setIsIntersecting}>
        <div>
          {subnames.map((subname) => (
            <TaggedNameItem
              key={subname.name}
              name={subname.name}
              truncatedName={subname.truncatedName}
              mode="view"
              relation={{
                owner: !!subname.owner && subname.owner === address,
                registrant: !!subname.registrant && subname.registrant === address,
                resolvedAddress: !!subname.resolvedAddress && subname.resolvedAddress === address,
                wrappedOwner: !!subname.wrappedOwner && subname.wrappedOwner === address,
              }}
              notOwned={!subname.owner || subname.owner === emptyAddress}
              fuses={subname.fuses}
              pccExpired={false}
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
            <Outlink href={getSupportLink('namesAndSubnames')}>
              {t('details.tabs.subnames.addSubname.learn')}
            </Outlink>
          </Typography>
          {canCreateSubdomains ? (
            <Button
              data-testid="add-subname-action"
              onClick={createSubname}
              prefix={() => <PlusPrefix as={PlusSVG} />}
            >
              {t('details.tabs.subnames.addSubname.action')}
            </Button>
          ) : (
            <DisabledButtonWithTooltip
              {...{
                size: 'medium',
                buttonId: 'add-subname-disabled-button',
                content: t(`errors.${canCreateSubdomainsError || 'default'}`),
                buttonText: t('details.tabs.subnames.addSubname.action'),
                mobileWidth: 200,
                mobilePlacement: 'top',
                prefix: () => <PlusPrefix as={PlusSVG} />,
              }}
            />
          )}
        </AddSubnamesCard>
      )}
      <StyledTabWrapper>
        <NameTableHeader
          selectable={false}
          sortType={sortType}
          sortTypeOptionValues={['createdAt', 'labelName']}
          sortDirection={sortDirection}
          searchQuery={searchInput}
          mode="view"
          onSortTypeChange={(value: SortType) => {
            if (['createdAt', 'labelName'].includes(value))
              setSortType(value as NonNullable<GetSubnamesParameters['orderBy']>)
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
