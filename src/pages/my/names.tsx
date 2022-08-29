import { NameListView } from '@app/components/@molecules/NameListView/NameListView'
import SortControl, {
  SortDirection,
  SortType,
  SortValue,
} from '@app/components/@molecules/SortControl/SortControl'
import { NameGridView } from '@app/components/names/NameGridView'
import { TabWrapper } from '@app/components/pages/profile/TabWrapper'
import { useChainId } from '@app/hooks/useChainId'
import { useNamesFromAddress } from '@app/hooks/useNamesFromAddress'
import { useProtectedRoute } from '@app/hooks/useProtectedRoute'
import { Content } from '@app/layouts/Content'
import { ContentGrid } from '@app/layouts/ContentGrid'
import { Name } from '@app/types'
import { mq, PageButtons, Spinner } from '@ensdomains/thorin'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

const EmptyDetailContainer = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['4']};
    display: flex;
    justify-content: center;
    align-items: center;
  `,
)

const PageButtonsContainer = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    padding: ${theme.space['2']} ${theme.space['4']};
  `,
)

const TabWrapperWithButtons = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: normal;
    justify-content: flex-start;
    width: 100%;
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};
  `,
)

const FilterContainer = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};
    ${mq.md.min(css`
      justify-content: flex-end;
      gap: ${theme.space['8']};
      flex-gap: ${theme.space['8']};
    `)}
  `,
)

const spacing = '1fr 1fr'

type ViewType = 'grid' | 'list'
type FilterType = Name['type'] | 'none'

export default function Page() {
  const { t } = useTranslation('names')
  const router = useRouter()
  const { address: _address, isConnecting, isReconnecting } = useAccount()
  const address = (router.query.address as string) || (_address as string)
  const isSelf = true
  const chainId = useChainId()

  const [viewType] = useState<ViewType>('list')
  const [sortValue, setSortValue] = useState<SortValue>({
    type: SortType.expiryDate,
    direction: SortDirection.desc,
  })
  const [filter] = useState<FilterType>('none')
  const [page, setPage] = useState(1)

  const {
    currentPage,
    isLoading: namesLoading,
    status: namesStatus,
    pageLength,
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
      spacing={spacing}
    >
      {{
        header: (
          <FilterContainer>
            <SortControl value={sortValue} onChange={(_value) => setSortValue(_value)} />
          </FilterContainer>
        ),
        trailing: (
          <TabWrapperWithButtons>
            {loading && (
              <TabWrapper>
                <EmptyDetailContainer>
                  <Spinner color="accent" />
                </EmptyDetailContainer>
              </TabWrapper>
            )}
            {!loading &&
              currentPage &&
              pageLength > 0 &&
              (viewType === 'list' ? (
                <NameListView currentPage={currentPage} network={chainId} />
              ) : (
                <NameGridView currentPage={currentPage} network={chainId} />
              ))}
            {!loading && pageLength < 1 && (!currentPage || currentPage.length === 0) && (
              <TabWrapper>
                <EmptyDetailContainer>{t('empty')}</EmptyDetailContainer>
              </TabWrapper>
            )}
            {pageLength > 0 && (
              <PageButtonsContainer>
                <PageButtons
                  current={page}
                  onChange={(value) => setPage(value)}
                  total={pageLength}
                  max={5}
                  alwaysShowFirst
                  alwaysShowLast
                />
              </PageButtonsContainer>
            )}
          </TabWrapperWithButtons>
        ),
      }}
    </Content>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <ContentGrid $spacing={spacing}>{page}</ContentGrid>
}
