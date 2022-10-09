import { useRouter } from 'next/router'
import { ReactElement, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Button, Spinner } from '@ensdomains/thorin'

import FastForwardSVG from '@app/assets/FastForward.svg'
import { TaggedNameItem } from '@app/components/@atoms/NameDetailItem/TaggedNameItem'
import { NameTableFooter } from '@app/components/@molecules/NameTableFooter/NameTableFooter'
import { ProfileSnippet } from '@app/components/ProfileSnippet'
import NoProfileSnippet from '@app/components/address/NoProfileSnippet'
import { TabWrapper } from '@app/components/pages/profile/TabWrapper'
import { ReturnedName, useNamesFromAddress } from '@app/hooks/useNamesFromAddress'
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

const EmptyDetailContainer = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['4']};
    display: flex;
    justify-content: center;
    align-items: center;
  `,
)

const Page = () => {
  const { t } = useTranslation('address')
  const { query, isReady } = useRouter()
  const { address: _address } = useAccount()
  const address = query.address as string
  const chainId = useChainId()
  const breakpoints = useBreakpoint()
  const isSelf = _address === address

  const [mode, setMode] = useState<NameTableMode>('view')
  const [selectedNames, setSelectedNames] = useState<string[]>([])
  const handleClickName = (name: string) => () => {
    if (selectedNames.includes(name)) {
      setSelectedNames(selectedNames.filter((n) => n !== name))
    } else {
      setSelectedNames([...selectedNames, name])
    }
  }

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

  const isNameDisabled = useCallback(
    (name: ReturnedName) => {
      if (mode !== 'select') return false
      return !name.expiryDate
    },
    [mode],
  )

  const { showDataInput, getTransactionFlowStage } = useTransactionFlow()
  const transactionKey = `extend-names-${selectedNames.join('-')}`
  const handleExtend = () => {
    if (selectedNames.length === 0) return
    showDataInput(transactionKey, 'ExtendNames', {
      names: selectedNames,
      isSelf,
    })
  }

  const stage = getTransactionFlowStage(transactionKey)
  useEffect(() => {
    if (stage === 'completed') {
      setSelectedNames([])
      setMode('view')
      setPage(1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage])

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
              selectable={!!_address}
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
              onModeChange={(m) => {
                setMode(m)
                setSelectedNames([])
              }}
              onSortTypeChange={setSortType}
              onSortDirectionChange={setSortDirection}
              onSearchChange={setSearchQuery}
            >
              {mode === 'select' && (
                <Button
                  size="extraSmall"
                  shadowless
                  onClick={handleExtend}
                  data-testid="extend-names-button"
                >
                  <ButtonInner>
                    <FastForwardSVG />
                    {t('action.extend', { ns: 'common' })}
                  </ButtonInner>
                </Button>
              )}
            </NameTableHeader>
            <div>
              {/* eslint-disable no-nested-ternary */}
              {loading ? (
                <EmptyDetailContainer>
                  <Spinner color="accent" />
                </EmptyDetailContainer>
              ) : pageLength === 0 ? (
                <EmptyDetailContainer>{t('empty')}</EmptyDetailContainer>
              ) : currentPage ? (
                currentPage.map((name) => (
                  <TaggedNameItem
                    key={name.id}
                    {...name}
                    network={chainId}
                    mode={mode}
                    selected={selectedNames?.includes(name.name)}
                    disabled={isNameDisabled(name)}
                    onClick={handleClickName(name.name)}
                  />
                ))
              ) : null}
            </div>
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
