import GridSVG from '@app/assets/Grid.svg'
import ListSVG from '@app/assets/List.svg'
import { NameGridView } from '@app/components/names/NameGridView'
import { NameListView } from '@app/components/@molecules/NameListView/NameListView'
import { TabWrapper } from '@app/components/profile/TabWrapper'
import { useNamesFromAddress } from '@app/hooks/useNamesFromAddress'
import { useProtectedRoute } from '@app/hooks/useProtectedRoute'
import { Basic } from '@app/layouts/Basic'
import mq from '@app/mediaQuery'
import { Button, Heading, PageButtons, Typography } from '@ensdomains/thorin'
import type { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useState } from 'react'
import styled, { css } from 'styled-components'
import { useAccount, useNetwork } from 'wagmi'
import SortControl, {
  SortDirection,
  SortType,
  SortValue,
} from '@app/components/@molecules/SortControl/SortControl'

const EmptyDetailContainer = styled.div`
  padding: ${({ theme }) => theme.space['4']};
  display: flex;
  justify-content: center;
  align-items: center;
`
const PageButtonsContainer = styled.div`
  ${({ theme }) => `
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    padding: ${theme.space['2']} ${theme.space['4']};
  `}
`

const TabWrapperWithButtons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: normal;
  justify-content: flex-start;
  width: 100%;
  ${({ theme }) => css`
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};
  `}
`

const FilterContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  ${({ theme }) => css`
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};
    ${mq.md.min`
      gap: ${theme.space['8']};
      flex-gap: ${theme.space['8']};
    `}
  `}
`

const ViewButtons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  ${({ theme }) => `
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};
  `}
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  ${({ theme }) => `
    width: 100%;
    max-width: ${theme.space['320']};
    margin: 0 auto;
    gap: ${theme.space['4']};
    flex-gap: ${theme.space['4']};
  `}
`

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
`

const TopContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  ${({ theme }) => `
    gap: ${theme.space['4']};
    flex-gap: ${theme.space['4']};
  `}
  ${mq.md.min`
    flex-direction: row;
  `}
`

type ViewType = 'grid' | 'list'
type FilterType = 'domain' | 'registration' | 'none'

const NamesPage: NextPage = () => {
  const { t } = useTranslation('names')
  const router = useRouter()
  const { data: addressData, isLoading, status } = useAccount()
  const address = (router.query.address as string) || addressData?.address
  const isSelf = address === addressData?.address
  const { activeChain: chain } = useNetwork()

  const [viewType, setViewType] = useState<ViewType>('list')
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
    resultsPerPage: 10,
    filter: filter === 'none' ? undefined : filter,
  })

  const loading =
    isLoading ||
    status === 'loading' ||
    namesLoading ||
    namesStatus === 'loading'

  useProtectedRoute('/', loading ? true : address && address !== '')

  return (
    <Basic title="Names -" loading={loading}>
      <Container>
        <TopContainer>
          <SectionHeader>
            <Heading>{t('title')}</Heading>
            <Typography>
              {`${t('subtitle.start')} ${
                isSelf ? t('subtitle.your') : t('subtitle.this')
              } ${t('subtitle.wallet')}`}
            </Typography>
          </SectionHeader>
          <FilterContainer>
            <SortControl
              value={sortValue}
              onChange={(_value) => setSortValue(_value)}
            />
            <ViewButtons>
              <Button
                pressed={viewType === 'grid'}
                onClick={() => setViewType('grid')}
                variant="transparent"
                shadowless
                size="extraSmall"
              >
                <div style={{ height: '24px' }}>
                  <GridSVG width="24" height="24" />
                </div>
              </Button>
              <Button
                pressed={viewType === 'list'}
                onClick={() => setViewType('list')}
                variant="transparent"
                shadowless
                size="extraSmall"
              >
                <div style={{ height: '24px' }}>
                  <ListSVG width="24" height="24" />
                </div>
              </Button>
            </ViewButtons>
          </FilterContainer>
        </TopContainer>
        <TabWrapperWithButtons>
          {currentPage &&
            pageLength > 0 &&
            (viewType === 'list' ? (
              <NameListView currentPage={currentPage} network={chain?.name!} />
            ) : (
              <NameGridView currentPage={currentPage} network={chain?.name!} />
            ))}
          {pageLength < 1 && (!currentPage || currentPage.length === 0) && (
            <TabWrapper>
              <EmptyDetailContainer>{t('names.empty')}</EmptyDetailContainer>
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
      </Container>
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

export default NamesPage
