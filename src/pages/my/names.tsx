import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import {
  Button,
  Input,
  PageButtons,
  SearchSVG,
  Select,
  Spinner,
  Typography,
  mq,
} from '@ensdomains/thorin'

import FastForwardSVG from '@app/assets/FastForward.svg'
import UpDirectionSVG from '@app/assets/SortAscending.svg'
import DownDirectionSVG from '@app/assets/SortDescending.svg'
import { NameListView } from '@app/components/@molecules/NameListView/NameListView'
import { SortDirection, SortType } from '@app/components/@molecules/SortControl/SortControl'
import { TabWrapper } from '@app/components/pages/profile/TabWrapper'
import { useChainId } from '@app/hooks/useChainId'
import { useNamesFromAddress } from '@app/hooks/useNamesFromAddress'
import { useProtectedRoute } from '@app/hooks/useProtectedRoute'
import { Content } from '@app/layouts/Content'
import { ContentGrid } from '@app/layouts/ContentGrid'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { Name } from '@app/types'

import { CheckButton } from '../../components/@atoms/CheckButton/CheckButton'

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
    padding: ${theme.space['3']} ${theme.space['4.5']};
    border-top: 1px solid ${theme.colors.borderTertiary};
  `,
)

const TabWrapperWithButtons = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: normal;
    justify-content: flex-start;
    width: 100%;
    max-width: 100%;
    background: ${theme.colors.white};
    background-color: ${theme.colors.background};
    border-radius: ${theme.radii['2xLarge']};
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.02);
  `,
)

const TableHeader = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: column-reverse;
    align-items: flex-end;
    border-bottom: 1px solid ${theme.colors.borderTertiary};
    padding: ${theme.space['3']} ${theme.space['4']};
    gap: ${theme.space['2']};
    ${mq.md.min(css`
      flex-direction: row;
      padding: ${theme.space['3']} ${theme.space['4.5']};
    `)}
  `,
)

const TableHeaderLeading = styled.div(
  () => css`
    flex: 1;
    width: 100%;
    display: flex;
    justify-content: space-between;
  `,
)

const TableHeaderLeadingLeft = styled.div(
  ({ theme }) => css`
    display: flex;
    gap: ${theme.space['2']};
    align-items: center;
    color: ${theme.colors.text};
    ${mq.md.min(css`
      gap: ${theme.space['4']};
    `)}
  `,
)

const TableHeaderLeftControlsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    gap: ${theme.space['2']};
  `,
)

const TableHeaderLeadingRight = styled.div(() => css``)

const TableHeaderTrailing = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    ${mq.md.min(css`
      flex: 0 0 ${theme.space['32']};
      width: ${theme.space['32']};
    `)}
  `,
)

const SearchIconWrapper = styled.div(
  ({ theme }) => css`
    svg {
      display: block;
      path {
        stroke-width: 3px;
        stroke: ${theme.colors.textTertiary};
      }
    }
  `,
)

const DirectionButton = styled.button<{ $active: boolean }>(
  ({ theme, $active }) => css`
    width: ${theme.space['9']};
    flex: 0 0 ${theme.space['9']};
    height: ${theme.space['9']};
    border: 1px solid ${theme.colors.borderSecondary};
    border-radius: ${theme.space['2']};
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      display: block;
      width: ${theme.space['3']};
      height: ${theme.space['3']};
      path {
        fill: ${$active ? theme.colors.accent : theme.colors.textTertiary};
      }
    }
  `,
)

const ButtonInner = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.space['2']};
  `,
)

const ButtonIcon = styled.svg(
  ({ theme }) => css`
    display: block;
    width: ${theme.space['4']};
    height: ${theme.space['4']};
  `,
)

const spacing = '1fr 1fr'

type FilterType = Name['type'] | 'none'

export default function Page() {
  const { t } = useTranslation('names')
  const router = useRouter()
  const { address: _address, isConnecting, isReconnecting } = useAccount()
  const address = (router.query.address as string) || (_address as string)
  const isSelf = true
  const chainId = useChainId()

  const { showDataInput } = useTransactionFlow()

  const [isSelectMode, setIsSelectMode] = useState(false)
  const [selectedNames, setSelectedNames] = useState<string[]>([])

  const [sortType, setSortType] = useState<SortType>(SortType.expiryDate)
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.desc)

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
      type: sortType,
      orderDirection: sortDirection,
    },
    page,
    resultsPerPage: 25,
    filter: filter === 'none' ? undefined : filter,
  })

  const handleExtend = () => {
    showDataInput(`extend-names-${selectedNames.join('-')}`, 'ExtendNames', {
      names: selectedNames,
    })
  }

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
        trailing: (
          <TabWrapperWithButtons>
            <TableHeader>
              <TableHeaderLeading>
                <TableHeaderLeadingLeft>
                  <CheckButton active={isSelectMode} onChange={(value) => setIsSelectMode(value)} />
                  {isSelectMode ? (
                    <div>{selectedNames.length} selected</div>
                  ) : (
                    <TableHeaderLeftControlsContainer>
                      <Select
                        value={sortType}
                        size="small"
                        label="Sort by"
                        hideLabel
                        onChange={(e) => {
                          setSortType(e.target.value as SortType)
                        }}
                        options={[
                          { label: t('sortTypes.expiryDate'), value: 'expiryDate' },
                          {
                            label: t('sortTypes.creationDate'),
                            value: 'creationDate',
                          },
                          { label: t('sortTypes.labelName'), value: 'labelName' },
                        ]}
                      />
                      <DirectionButton
                        $active={sortDirection === SortDirection.desc}
                        onClick={() => setSortDirection(SortDirection.desc)}
                      >
                        <UpDirectionSVG />
                      </DirectionButton>
                      <DirectionButton
                        $active={sortDirection === SortDirection.asc}
                        onClick={() => setSortDirection(SortDirection.asc)}
                      >
                        <DownDirectionSVG />
                      </DirectionButton>
                    </TableHeaderLeftControlsContainer>
                  )}
                </TableHeaderLeadingLeft>
                <TableHeaderLeadingRight>
                  {isSelectMode && (
                    <Button variant="primary" size="small" shadowless onClick={handleExtend}>
                      <ButtonInner>
                        <ButtonIcon as={FastForwardSVG} />
                        <Typography weight="bold">{t('extend')}</Typography>
                      </ButtonInner>
                    </Button>
                  )}
                </TableHeaderLeadingRight>
              </TableHeaderLeading>
              <TableHeaderTrailing>
                <Input
                  size="medium"
                  label="search"
                  hideLabel
                  prefix={
                    <SearchIconWrapper>
                      <SearchSVG />
                    </SearchIconWrapper>
                  }
                  placeholder="Search"
                  parentStyles={css`
                    height: 36px;
                    border-radius: 8px;
                  `}
                  padding="2"
                />
              </TableHeaderTrailing>
            </TableHeader>
            {loading && (
              <TabWrapper>
                <EmptyDetailContainer>
                  <Spinner color="accent" />
                </EmptyDetailContainer>
              </TabWrapper>
            )}
            {!loading && currentPage && pageLength > 0 && (
              <NameListView
                currentPage={currentPage}
                network={chainId}
                rowsOnly
                mode={isSelectMode ? 'select' : 'view'}
                selectedNames={selectedNames}
                onSelectedNamesChange={setSelectedNames}
              />
            )}
            {!loading && pageLength < 1 && (!currentPage || currentPage.length === 0) && (
              <EmptyDetailContainer>{t('empty')}</EmptyDetailContainer>
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
