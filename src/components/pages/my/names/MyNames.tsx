import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Button, Spinner } from '@ensdomains/thorin'

import FastForwardSVG from '@app/assets/FastForward.svg'
import { TaggedNameItem } from '@app/components/@atoms/NameDetailItem/TaggedNameItem'
import { NameTableFooter } from '@app/components/@molecules/NameTableFooter/NameTableFooter'
import {
  NameTableHeader,
  NameTableMode,
} from '@app/components/@molecules/NameTableHeader/NameTableHeader'
import { SortDirection, SortType } from '@app/components/@molecules/SortControl/SortControl'
import { TabWrapper } from '@app/components/pages/profile/TabWrapper'
import { useChainId } from '@app/hooks/useChainId'
import { ReturnedName, useNamesFromAddress } from '@app/hooks/useNamesFromAddress'
import { useProtectedRoute } from '@app/hooks/useProtectedRoute'
import { Content } from '@app/layouts/Content'
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
  () => css`
    display: flex;
    flex-direction: column;
    align-items: normal;
    justify-content: flex-start;
    width: 100%;
    max-width: 100%;
    background: white;
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

const MyNames = () => {
  const { t } = useTranslation('names')
  const router = useRouter()
  const { address: _address, isConnecting, isReconnecting } = useAccount()
  const address = (router.query.address as string) || (_address as string)
  const isSelf = true
  const chainId = useChainId()

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

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const {
    currentPage,
    isLoading: namesLoading,
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

  useEffect(() => {
    setPage(1)
  }, [address])

  const { showDataInput, getTransactionFlowStage } = useTransactionFlow()
  const handleExtend = () => {
    if (selectedNames.length === 0) return
    showDataInput(`extend-names-${selectedNames.join('-')}`, 'ExtendNames', {
      names: selectedNames,
      isSelf,
    })
  }

  const stage = getTransactionFlowStage(`extend-names-${selectedNames.join('-')}`)
  useEffect(() => {
    if (stage === 'completed') {
      setSelectedNames([])
      setMode('view')
      setPage(1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage])

  const isNameDisabled = useCallback(
    (name: ReturnedName) => {
      if (mode !== 'select') return false
      return !name.expiryDate
    },
    [mode],
  )

  const loading =
    isConnecting || isReconnecting || namesLoading || namesStatus === 'loading' || !router.isReady

  useProtectedRoute('/', loading ? true : address && address !== '')

  return (
    <Content
      title={t('title')}
      subtitle={`${t('subtitle.start')} ${isSelf ? t('subtitle.your') : t('subtitle.this')} ${t(
        'subtitle.wallet',
      )}`}
      alwaysShowSubtitle
      singleColumnContent
      loading={loading}
    >
      {{
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
              onModeChange={(m) => {
                setMode(m)
                setSelectedNames([])
              }}
              onSortDirectionChange={setSortDirection}
              onSortTypeChange={setSortType}
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
            <div data-testid="names-list">
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
              onChange={(value) => setPage(value)}
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

export default MyNames
