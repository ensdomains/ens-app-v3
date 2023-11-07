import { ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'

import { GetSubnamesParameters } from '@ensdomains/ensjs/subgraph'
import { Box, BoxProps, Button, Card, PlusSVG, Spinner, Typography } from '@ensdomains/thorin'

import { DisabledButtonWithTooltip } from '@app/components/@molecules/DisabledButtonWithTooltip'
import {
  NameTableHeader,
  SortDirection,
  SortType,
} from '@app/components/@molecules/NameTableHeader/NameTableHeader'
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

const NoMoreResultsContainer = (props: BoxProps) => (
  <Box
    {...props}
    padding="$2"
    display="flex"
    alignItems="center"
    justifyContent="center"
    height="$15"
  />
)

export const SubnamesTab = ({
  name,
  canEdit,
  canCreateSubdomains,
  isWrapped,
}: {
  name: string
  canEdit: boolean
  canCreateSubdomains: boolean
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
      <Box display="flex" justifyContent="center" alignItems="center" height="$15">
        <Spinner size="small" color="accent" />
      </Box>
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
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="$15"
            borderTop="1px solid"
            borderTopColor="$border"
          >
            <Spinner size="small" color="accent" />
          </Box>
        )}
      </InfiniteScrollContainer>
    )
  } else {
    InnerContent = `${subnames.length}`
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="stretch"
      justifyContent="flex-start"
      width="$full"
      gap="$4"
    >
      {canEdit && (
        <Card
          flexDirection={{ base: 'column', sm: 'row' }}
          textAlign={{ base: 'center', sm: 'left' }}
        >
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
              prefix={<PlusSVG />}
              width={{ base: '$full', sm: '$min' }}
            >
              {t('details.tabs.subnames.addSubname.action')}
            </Button>
          ) : (
            <DisabledButtonWithTooltip
              {...{
                size: 'medium',
                buttonId: 'add-subname-disabled-button',
                content: t('errors.permissionRevoked'),
                buttonText: t('details.tabs.subnames.addSubname.action'),
                mobileWidth: 200,
                mobilePlacement: 'top',
                prefix: <PlusSVG />,
              }}
            />
          )}
        </Card>
      )}
      <TabWrapper>
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
        <Box display="flex" height="$8" borderTop="1px solid" borderTopColor="$border" />
      </TabWrapper>
    </Box>
  )
}
