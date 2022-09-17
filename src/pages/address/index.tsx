import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button } from '@ensdomains/thorin'

import FastForwardSVG from '@app/assets/FastForward.svg'
import { NameListView } from '@app/components/@molecules/NameListView/NameListView'
import { NameTableFooter } from '@app/components/@molecules/NameTableFooter/NameTableFooter'
import { ProfileSnippet } from '@app/components/ProfileSnippet'
import NoProfileSnippet from '@app/components/address/NoProfileSnippet'
import { TabWrapper } from '@app/components/pages/profile/TabWrapper'
import { useNamesFromAddress } from '@app/hooks/useNamesFromAddress'
import { usePrimaryProfile } from '@app/hooks/usePrimaryProfile'
import { Content } from '@app/layouts/Content'
import { ContentGrid } from '@app/layouts/ContentGrid'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { shortenAddress } from '@app/utils/utils'

import {
  NameTableHeader,
  NameTableMode,
  SortDirection,
  SortType,
} from '../../components/@molecules/NameTableHeader/NameTableHeader'
import { useChainId } from '../../hooks/useChainId'

const DetailsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['2']};
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
    background: ${theme.colors.white};
  `,
)

const ButtonInner = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.space['2']};

    font-size: ${theme.space['3.5']};
    height: ${theme.space['5']};
    padding: 0 ${theme.space['2']};

    svg {
      display: block;
      width: ${theme.space['3']};
      height: ${theme.space['3']};
    }
  `,
)

const Page = () => {
  const { t } = useTranslation('address')
  const { query, isReady } = useRouter()
  const address = query.address as string
  const chainId = useChainId()
  const breakpoints = useBreakpoint()

  const [mode, setMode] = useState<NameTableMode>('view')
  const [selectedNames, setSelectedNames] = useState<string[]>([])

  const [sortType, setSortType] = useState<SortType | undefined>()
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.desc)
  const [searchQuery, setSearchQuery] = useState('')

  const { profile: primaryProfile, loading: primaryProfileLoading } = usePrimaryProfile(address)

  const profileButtonPlacement = breakpoints.md ? 'bottom' : 'inline'

  const getTextRecord = (key: string) => primaryProfile?.records?.texts?.find((x) => x.key === key)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const {
    currentPage = [],
    isLoading: isNamesLoading,
    status: namesStatus,
    pageLength,
  } = useNamesFromAddress({
    address,
    sort: {
      type: sortType || SortType.expiryDate,
      orderDirection: sortDirection,
    },
    page,
    resultsPerPage: pageSize,
    search: searchQuery,
  })

  const { showDataInput } = useTransactionFlow()
  const handleExtend = () => {
    showDataInput(`extend-names-${selectedNames.join('-')}`, 'ExtendNames', {
      names: selectedNames,
    })
  }

  const loading = !isReady || isNamesLoading || primaryProfileLoading

  const hasErrors = namesStatus === 'error'

  const error = hasErrors ? t('errors.names') : ''

  return (
    <Content
      alwaysShowSubtitle
      subtitle={t('addressDetails')}
      title={shortenAddress(address)}
      loading={loading}
    >
      {{
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
                getTextRecord={getTextRecord}
              />
            ) : (
              <NoProfileSnippet />
            )}
          </DetailsContainer>
        ),
        trailing: (
          <TabWrapperWithButtons>
            <NameTableHeader
              mode={mode}
              sortType={sortType}
              sortTypeOptionValues={[
                SortType.expiryDate,
                SortType.labelName,
                SortType.creationDate,
              ]}
              sortDirection={sortDirection}
              searchQuery={searchQuery}
              selectedCount={selectedNames.length}
              onModeChange={setMode}
              onSortTypeChange={setSortType}
              onSortDirectionChange={setSortDirection}
              onSearchChange={setSearchQuery}
            >
              {mode === 'select' && (
                <Button size="extraSmall" shadowless onClick={handleExtend}>
                  <ButtonInner>
                    <FastForwardSVG />
                    {t('action.extend', { ns: 'common' })}
                  </ButtonInner>
                </Button>
              )}
            </NameTableHeader>
            <NameListView
              currentPage={currentPage || []}
              network={chainId}
              rowsOnly
              mode={mode}
              selectedNames={selectedNames}
              onSelectedNamesChange={setSelectedNames}
            />
            <NameTableFooter
              current={page}
              onChange={setPage}
              total={pageLength}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
            />
          </TabWrapperWithButtons>
        ),
      }}
    </Content>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <ContentGrid>{page}</ContentGrid>
}

export default Page
