import { ReactElement, useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { PageButtons } from '@ensdomains/thorin'
import { ProfileSnippet } from '@app/components/ProfileSnippet'
import NoProfileSnippet from '@app/components/address/NoProfileSnippet'
import { NameListView } from '@app/components/@molecules/NameListView/NameListView'
import { SortDirection, SortType, SortValue } from '@app/components/@molecules/SortControl/SortControl'
import { useNamesFromAddress } from '@app/hooks/useNamesFromAddress'
import { shortenAddress } from '@app/utils/utils'
import { usePrimaryProfile } from '@app/hooks/usePrimaryProfile'
import FilterControl from '@app/components/address/FilterControl'
import { ContentGrid } from '@app/layouts/ContentGrid'
import { Content } from '@app/layouts/Content'
import { Name } from '@app/types'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { useChainId } from '../../hooks/useChainId'

const DetailsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['2']};
  `,
)

const ContentContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['4']};
  `,
)

const PageButtonsWrapper = styled.div(
  () => css`
    display: flex;
    justify-content: flex-end;
  `,
)

type FilterType = Name['type'] | 'none'

const Page = () => {
  const { t } = useTranslation('address')
  const { query, isReady } = useRouter()
  const address = query.address as string
  const chainId = useChainId()
  const breakpoints = useBreakpoint()

  const [page, setPage] = useState(1)

  // Filter Controls

  const [sortValue, setSortValue] = useState<SortValue>({
    type: SortType.expiryDate,
    direction: SortDirection.desc,
  })

  const [filter, setFilter] = useState<FilterType>('none')

  const onFilterControlChange = (control: { sort: SortValue; filter: FilterType }) => {
    const { sort: newSort, filter: newFilter } = control
    let refresh = false
    if (newSort.type !== sortValue.type || newSort.direction !== sortValue.direction) {
      setSortValue(control.sort)
      refresh = true
    }
    if (newFilter !== filter) {
      setFilter(newFilter)
      refresh = true
    }
    if (refresh) setPage(1)
  }

  // Primary Profile

  const { profile: primaryProfile, loading: primaryProfileLoading } = usePrimaryProfile(address)

  const profileButtonPlacement = breakpoints.md ? 'bottom' : 'inline'

  const getTextRecord = (key: string) => primaryProfile?.records?.texts?.find((x) => x.key === key)

  // Names

  const {
    currentPage = [],
    isLoading: isNamesLoading,
    status: namesStatus,
    pageLength,
    nameCount,
  } = useNamesFromAddress({
    address,
    sort: {
      type: sortValue.type,
      orderDirection: sortValue.direction,
    },
    page,
    resultsPerPage: 25,
    filter: filter === 'none' ? undefined : filter,
  })

  const loading = !isReady || isNamesLoading || primaryProfileLoading

  const hasErrors = namesStatus === 'error'

  const error = hasErrors ? t('errors.names') : ''

  return (
    <Content alwaysShowSubtitle subtitle={t('addressDetails')} title={shortenAddress(address)} loading={loading}>
      {{
        header: (
          <FilterControl sort={sortValue} filter={filter} resultsCount={nameCount} onChange={onFilterControlChange} />
        ),
        warning: error
          ? {
              type: 'warning',
              message: error,
            }
          : undefined,
        leading: (
          <DetailsContainer>
            {primaryProfile?.name ? (
              <ProfileSnippet
                name={primaryProfile.name}
                network={chainId}
                button="viewProfile"
                buttonPlacement={profileButtonPlacement}
                description={getTextRecord('description')?.value}
                recordName={getTextRecord('name')?.value}
                url={getTextRecord('url')?.value}
              />
            ) : (
              <NoProfileSnippet />
            )}
          </DetailsContainer>
        ),
        trailing: (
          <ContentContainer>
            <NameListView currentPage={currentPage || []} network={chainId} />
            <PageButtonsWrapper>
              <PageButtons
                current={page}
                onChange={(value) => setPage(value)}
                total={pageLength}
                max={5}
                alwaysShowFirst
                alwaysShowLast
              />
            </PageButtonsWrapper>
          </ContentContainer>
        ),
      }}
    </Content>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <ContentGrid>{page}</ContentGrid>
}

export default Page
