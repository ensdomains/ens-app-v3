import { useState } from 'react'
import { GetStaticPaths, NextPage } from 'next'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import styled, { css } from 'styled-components'
import { useNetwork } from 'wagmi'
import { PageButtons, ExclamationSVG, Typography, mq } from '@ensdomains/thorin'
import { ProfileSnippet } from '@app/components/ProfileSnippet'
import NoProfileSnippet from '@app/components/address/NoProfileSnippet'
import { NameListView } from '@app/components/@molecules/NameListView/NameListView'
import {
  SortDirection,
  SortType,
  SortValue,
} from '@app/components/@molecules/SortControl/SortControl'
import { Basic } from '@app/layouts/Basic'
import { useNamesFromAddress } from '@app/hooks/useNamesFromAddress'
import { shortenAddress } from '@app/utils/utils'
import { usePrimaryProfile } from '@app/hooks/usePrimaryProfile'
import FilterControl from '@app/components/address/FilterControl'

const GridItem = styled.div<{ $area: string }>(
  ({ $area }) => css`
    grid-area: ${$area};
  `,
)

const WrapperGrid = styled.div<{ $hasError?: boolean }>(
  ({ theme, $hasError }) => [
    css`
      flex-grow: 1;
      width: 100%;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: min-content min-content 1fr;
      gap: ${theme.space['5']};
      align-self: center;
      grid-template-areas: ${$hasError && "'error'"} 'details' 'content';
    `,
    mq.lg.min(css`
      grid-template-columns: 270px 2fr;
      grid-template-areas: ${$hasError && "'error error'"} 'details content';
    `),
  ],
)

const DetailsContainer = styled(GridItem)(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['2']};
  `,
)

const ContentContainer = styled(GridItem)(
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

const ErrorIcon = styled.div(
  ({ theme }) => css`
    background: rgba(255, 255, 255, 0.5);
    color: ${theme.colors.yellow};
    stroke-width: ${theme.space['0.5']};
    width: max-content;
    height: max-content;
    min-height: ${theme.space['12']};
    min-width: ${theme.space['12']};
    padding: ${theme.space['1']};
    border-radius: ${theme.radii.almostExtraLarge};
  `,
)

const ErrorContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['4']};
    flex-gap: ${theme.space['4']};
    grid-area: error;
    background: rgba(${theme.accentsRaw.yellow}, 0.25);
    border-radius: ${theme.radii['2xLarge']};
    padding: ${theme.space['2']};
    padding-right: ${theme.space['8']};
    color: ${theme.colors.textSecondary};
    & > div {
      line-height: ${theme.lineHeights.normal};
    }
  `,
)

const AddressPage: NextPage = () => {
  const { t } = useTranslation('address')
  const { query, isReady } = useRouter()
  // const breakpoints = useBreakpoint()
  const address = query.address as string
  const { activeChain: chain } = useNetwork()

  const [page, setPage] = useState(1)

  // Filter Controls

  const [sortValue, setSortValue] = useState<SortValue>({
    type: SortType.expiryDate,
    direction: SortDirection.desc,
  })

  const [filter, setFilter] = useState<'registration' | 'domain' | 'none'>(
    'none',
  )

  const onFilterControlChange = (control: {
    sort: SortValue
    filter: 'registration' | 'domain' | 'none'
  }) => {
    const { sort: _sort, filter: _filter } = control
    let refresh = false
    if (
      _sort.type !== sortValue.type ||
      _sort.direction !== sortValue.direction
    ) {
      setSortValue(control.sort)
      refresh = true
    }
    if (_filter !== filter) {
      setFilter(_filter)
      refresh = true
    }
    if (refresh) setPage(1)
  }

  // Primary Profile

  const { profile: primaryProfile, loading: primaryProfileLoading } =
    usePrimaryProfile(address)

  const getTextRecord = (key: string) =>
    primaryProfile?.records?.texts?.find((x) => x.key === key)

  // Names

  const {
    currentPage = [],
    isLoading: namesLoading,
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
    resultsPerPage: 10,
    filter: filter === 'none' ? undefined : filter,
  })

  const loading = !isReady || namesLoading || primaryProfileLoading

  const hasErrors = namesStatus === 'error'

  const error = hasErrors ? t('errors.names') : ''

  return (
    <Basic
      heading={shortenAddress(address)}
      subheading={t('addressDetails')}
      title={`${address} - ENS`}
      loading={loading}
    >
      <WrapperGrid $hasError={hasErrors}>
        {error && (
          <ErrorContainer>
            <ErrorIcon as={ExclamationSVG} />
            <Typography variant="large" weight="bold">
              {error}
            </Typography>
          </ErrorContainer>
        )}
        <DetailsContainer $area="details">
          {primaryProfile ? (
            <>
              <ProfileSnippet
                name={primaryProfile.name!}
                network={chain?.name!}
                button="viewProfile"
                description={getTextRecord('description')?.value}
                recordName={getTextRecord('name')?.value}
                url={getTextRecord('url')?.value}
              />
            </>
          ) : (
            <>
              <NoProfileSnippet />
            </>
          )}
        </DetailsContainer>
        <ContentContainer $area="content">
          <FilterControl
            sort={sortValue}
            filter={filter}
            resultsCount={nameCount}
            onChange={onFilterControlChange}
          />
          <NameListView
            currentPage={currentPage || []}
            network={chain?.name!}
          />
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
      </WrapperGrid>
    </Basic>
  )
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
      // Will be passed to the page component as props
    },
  }
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default AddressPage
