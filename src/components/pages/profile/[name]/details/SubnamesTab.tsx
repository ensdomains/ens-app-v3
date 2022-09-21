/* eslint-disable no-nested-ternary */
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, CloseSVG, PlusSVG, Spinner, Typography, mq } from '@ensdomains/thorin'

import {
  NameTableHeader,
  NameTableMode,
  SortDirection,
  SortType,
} from '@app/components/@molecules/NameTableHeader/NameTableHeader'
import { Card } from '@app/components/Card'
import { Outlink } from '@app/components/Outlink'
import { TabWrapper } from '@app/components/pages/profile/TabWrapper'
import { SubnameSortType, useSubnameInfiniteQuery } from '@app/hooks/useSubnameInfiniteQuery'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import useDebouncedCallback from '../../../../../hooks/useDebouncedCallback'
import { InfiniteScrollContainer } from '../../../../@atoms/InfiniteScrollContainer/InfiniteScrollContainer'
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

const StyledTabWrapper = styled(TabWrapper)(() => css``)

const Footer = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: ${theme.space['8']};
    border-top: 1px solid ${theme.colors.borderTertiary};
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

const SpinnerContainer = styled.div<{ $showBorder?: boolean }>(
  ({ theme, $showBorder }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: ${theme.space['15']};
    ${$showBorder && `border-top: 1px solid ${theme.colors.borderTertiary};`}
  `,
)

export const SubnamesTab = ({
  name,
  network,
  canEdit: _canEdit,
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
      setSelectedNames([])
    } else {
      setSelectedNames([subname])
    }
  }

  const canEdit = _canEdit && name.replace('.eth', '').indexOf('.') === -1

  const [sortType, setSortType] = useState<SubnameSortType | undefined>()
  const [sortDirection, setSortDirection] = useState(SortDirection.desc)
  const [searchInput, setSearchInput] = useState('')

  const searchQuery = (router.query.search as string) || ''
  const [_searchQuery, setSearchQuery] = useState(searchQuery)
  const debouncedSetSearch = useDebouncedCallback(setSearchQuery, 500)

  useEffect(() => {
    const url = new URL(router.asPath, window.location.origin)
    url.searchParams.set('search', _searchQuery)
    router.replace(url.toString(), undefined, { shallow: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_searchQuery])

  const { subnames, isLoading, isFetching, fetchNextPage, hasNextPage } = useSubnameInfiniteQuery(
    name,
    sortType,
    sortDirection,
    searchQuery,
  )

  const [isIntersecting, setIsIntersecting] = useState(false)
  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetching) {
      fetchNextPage()
    }
  }, [isIntersecting, fetchNextPage, hasNextPage, isFetching])

  const createSubname = () =>
    showDataInput(`make-subname-${name}`, 'CreateSubname', {
      parent: name,
      isWrapped,
    })

  const deleteSubname = () => {
    const subname = selectedNames[0]
    if (subname) {
      showDataInput(`delete-subname-${subname}`, 'DeleteSubname', {
        name: subname,
        contract: isWrapped ? 'nameWrapper' : 'registry',
      })
    }
  }

  let InnerContent: ReactNode
  if (isLoading) {
    InnerContent = (
      <SpinnerContainer>
        <Spinner size="small" color="accent" />
      </SpinnerContainer>
    )
  } else if (subnames.length === 0) {
    InnerContent = <NoMoreResultsContainer>No Results</NoMoreResultsContainer>
  } else if (subnames.length > 0) {
    InnerContent = (
      <InfiniteScrollContainer onIntersectingChange={setIsIntersecting}>
        {subnames.map((subname) => (
          <TaggedNameItem
            key={subname.name}
            name={subname.name}
            network={network}
            mode={mode}
            selected={selectedNames.includes(subname.name)}
            onClick={handleSelectName(subname.name)}
          />
        ))}
        {isFetching && (
          <SpinnerContainer $showBorder>
            <Spinner size="small" color="accent" />
          </SpinnerContainer>
        )}
      </InfiniteScrollContainer>
    )
  } else {
    InnerContent = `${subnames.length}`
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
      <StyledTabWrapper>
        <NameTableHeader
          selectable={canEdit}
          sortType={sortType}
          sortTypeOptionValues={[SortType.creationDate, SortType.labelName]}
          sortDirection={sortDirection}
          searchQuery={searchInput}
          mode={mode}
          selectedCount={selectedNames.length}
          onSortTypeChange={(value: SortType) => {
            if (['creationDate', 'labelName'].includes(value)) setSortType(value as SubnameSortType)
          }}
          onSortDirectionChange={setSortDirection}
          onModeChange={setMode}
          onSearchChange={(s) => {
            setSearchInput(s)
            debouncedSetSearch(s)
          }}
        >
          {mode === 'select' && (
            <Button
              shadowless
              size="extraSmall"
              tone="red"
              variant="secondary"
              onClick={deleteSubname}
            >
              <ButtonInner>
                <CloseSVG />
                {t('action.delete', { ns: 'common' })}
              </ButtonInner>
            </Button>
          )}
        </NameTableHeader>
        {InnerContent}
        <Footer />
      </StyledTabWrapper>
    </TabWrapperWithButtons>
  )
}
