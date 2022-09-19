import { useRouter } from 'next/router'
import { ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, CloseSVG, PlusSVG, Typography, mq } from '@ensdomains/thorin'

import { NameTableFooter } from '@app/components/@molecules/NameTableFooter/NameTableFooter'
import {
  NameTableHeader,
  NameTableMode,
  SortDirection,
  SortType,
} from '@app/components/@molecules/NameTableHeader/NameTableHeader'
import { SpinnerRow } from '@app/components/@molecules/ScrollBoxWithSpinner'
import { Card } from '@app/components/Card'
import { Outlink } from '@app/components/Outlink'
import { TabWrapper } from '@app/components/pages/profile/TabWrapper'
import { SubnameSortType, useSubnamePagination } from '@app/hooks/useSubnamePagination'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

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

const StyledTabWrapper = styled(TabWrapper)<{ $isFetching?: boolean }>(
  ({ $isFetching }) => css`
    overflow: hidden;
    transition: opacity 0.15s ease-in-out;
    opacity: 1;
    ${$isFetching &&
    css`
      pointer-events: none;
      opacity: 0.5;
    `}
  `,
)

const NoneFoundContainer = styled(TabWrapper)(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${theme.space['2']};
  `,
)

const NoMoreResultsContainer = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['2']};
    display: flex;
    align-items: center;
    justify-content: center;
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

    ${mq.md.min(css`
      flex-direction: row;
      text-align: left;
      & > button {
        width: min-content;
      }
    `)}
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

const PlusPrefix = styled.svg(
  ({ theme }) => css`
    display: block;
    stroke-width: ${theme.space['0.75']};
    height: ${theme.space['5']};
    width: ${theme.space['5']};
  `,
)

export const SubnamesTab = ({
  name,
  network,
  canEdit,
  isWrapped,
}: {
  name: string
  network: number
  canEdit: boolean
  isWrapped: boolean
}) => {
  const router = useRouter()
  const { t } = useTranslation('profile')

  const { showDataInput } = useTransactionFlow()

  const [mode, setMode] = useState<NameTableMode>('view')
  const [selectedNames, setSelectedNames] = useState<string[]>([])
  const handleSelectName = (subname: string) => () => {
    if (selectedNames.includes(subname)) {
      setSelectedNames(selectedNames.filter((n) => n !== subname))
    } else {
      setSelectedNames([...selectedNames, subname])
    }
  }

  const [sortType, setSortType] = useState<SubnameSortType | undefined>()
  const [sortDirection, setSortDirection] = useState(SortDirection.desc)
  const [searchQuery, setSearchQuery] = useState('')

  const [page, setPage] = useState(1)
  // const page = router.query.page ? parseInt(router.query.page as string) : 1
  const pageSize = router.query.pageSize ? parseInt(router.query.pageSize as string) : 10
  const { subnames, max, isLoading, totalPages, isFetching } = useSubnamePagination(
    name,
    page,
    sortType,
    sortDirection,
    pageSize,
    searchQuery,
  )

  // const setPage = (newPage: number) => {
  //   const url = new URL(router.asPath, window.location.origin)
  //   url.searchParams.set('page', newPage.toString())
  //   url.searchParams.set('pageSize', pageSize.toString())
  //   router.push(url.toString(), undefined, {
  //     shallow: true,
  //   })
  // }

  const setPageSize = (newPageSize: number) => {
    const url = new URL(router.asPath, window.location.origin)
    url.searchParams.set('page', page.toString())
    url.searchParams.set('pageSize', newPageSize.toString())
    router.push(url.toString(), undefined, {
      shallow: true,
    })
  }

  const createSubname = () =>
    showDataInput(`make-subname-${name}`, 'CreateSubname', {
      parent: name,
      isWrapped,
    })

  let InnerContent: ReactNode

  if (isLoading) {
    InnerContent = <SpinnerRow />
  } else if (totalPages > 0) {
    InnerContent = (
      <>
        <StyledTabWrapper $isFetching={isFetching}>
          <NameTableHeader
            selectable={canEdit}
            sortType={sortType}
            sortTypeOptionValues={[SortType.creationDate, SortType.labelName]}
            sortDirection={sortDirection}
            searchQuery={searchQuery}
            mode={mode}
            selectedCount={selectedNames.length}
            onSortTypeChange={(value: SortType) => {
              if (['creationDate', 'labelName'].includes(value))
                setSortType(value as SubnameSortType)
            }}
            onSortDirectionChange={setSortDirection}
            onModeChange={setMode}
            onSearchChange={setSearchQuery}
          >
            {mode === 'select' && (
              <Button shadowless size="extraSmall" tone="red" variant="secondary">
                <ButtonInner>
                  <CloseSVG />
                  {t('action.delete', { ns: 'common' })}
                </ButtonInner>
              </Button>
            )}
          </NameTableHeader>
          <div>
            {subnames.length > 0 ? (
              subnames.map((subname) => (
                <TaggedNameItem
                  key={subname.name}
                  name={subname.name}
                  network={network}
                  mode={mode}
                  selected={selectedNames.includes(subname.name)}
                  onClick={handleSelectName(subname.name)}
                />
              ))
            ) : (
              <NoMoreResultsContainer>
                <Typography>{t('details.tabs.subnames.noMoreResults')}</Typography>
              </NoMoreResultsContainer>
            )}
          </div>
          <NameTableFooter
            current={page}
            max={max}
            alwaysShowLast={false}
            onChange={setPage}
            total={totalPages}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
          />
        </StyledTabWrapper>
      </>
    )
  } else if (!canEdit) {
    InnerContent = (
      <NoneFoundContainer>
        <Typography>{t('details.tabs.subnames.empty')}</Typography>
      </NoneFoundContainer>
    )
  } else {
    InnerContent = null
  }

  return (
    <TabWrapperWithButtons>
      {canEdit && (
        <AddSubnamesCard>
          <Typography>
            {t('details.tabs.subnames.addSubname.title')}{' '}
            <Outlink href="#">{t('details.tabs.subnames.addSubname.learn')}</Outlink>
          </Typography>
          <Button
            data-testid="add-subname-action"
            shadowless
            onClick={createSubname}
            prefix={<PlusPrefix as={PlusSVG} />}
          >
            {t('details.tabs.subnames.addSubname.action')}
          </Button>
        </AddSubnamesCard>
      )}
      {InnerContent}
    </TabWrapperWithButtons>
  )
}
