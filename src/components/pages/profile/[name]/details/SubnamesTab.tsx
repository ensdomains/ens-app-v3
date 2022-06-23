import { useEns } from '@app/utils/EnsProvider'
import { ArrowRightSVG, PageButtons, Spinner } from '@ensdomains/thorin'
import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useQuery, useQueryClient } from 'react-query'
import { NameDetailItem } from '../../../../NameDetailItem'
import { TabWrapper } from '../../TabWrapper'

type Subname = {
  id: string
  name: string
  truncatedName?: string
}

const EmptyDetailContainer = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['4']};
    display: flex;
    justify-content: center;
    align-items: center;
  `,
)

const RightArrow = styled.svg(
  ({ theme }) => css`
    stroke-width: ${theme.borderWidths['0.75']};
    color: ${theme.colors.textTertiary};
    display: block;
    height: ${theme.space['6']};
    width: ${theme.space['6']};
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
  () => css`
    display: flex;
    flex-direction: column;
    align-items: normal;
    justify-content: flex-start;
    width: 100%;
  `,
)

const maxCalc = (subnameCount: number, page: number) => {
  if (subnameCount > 5000) {
    return page + 1 === 1 ? 2 : 3
  }
  return 5
}

const usePagination = (name: string) => {
  const { getSubnames } = useEns()
  const isLargeQueryRef = useRef(false)
  const lastSubnamesRef = useRef([])
  const [page, setPage] = useState(0)
  const queryClient = useQueryClient()
  const resultsPerPage = 10

  const {
    data: { subnames, subnameCount, max, totalPages } = {
      subnames: [],
      subnameCount: 0,
    },
    isLoading,
  } = useQuery(
    ['getSubnames', name, 'createdAt', 'desc', page, resultsPerPage],
    async () => {
      const result = await getSubnames({
        name,
        orderBy: 'createdAt',
        orderDirection: 'desc',
        page,
        pageSize: resultsPerPage,
        isLargeQuery: isLargeQueryRef.current,
        lastSubnames: lastSubnamesRef.current,
      })

      lastSubnamesRef.current = result.subnames

      if (result.subnameCount > 5000) {
        isLargeQueryRef.current = true
      }

      return {
        ...result,
        max: maxCalc(result.subnameCount, page),
        totalPages: Math.ceil(result.subnameCount / resultsPerPage),
      }
    },
    { staleTime: Infinity, cacheTime: Infinity },
  )

  useEffect(() => {
    return () => {
      queryClient.removeQueries('getSubnames')
    }
  }, [queryClient])

  return {
    subnames,
    subnameCount,
    isLoading,
    max,
    page,
    setPage,
    totalPages,
  }
}

export const SubnamesTab = ({
  name,
  network,
}: {
  name: string
  network: number
}) => {
  const { t } = useTranslation('profile')
  const { subnames, max, page, setPage, isLoading, totalPages } =
    usePagination(name)

  return (
    <TabWrapperWithButtons>
      <TabWrapper>
        {!isLoading && subnames?.length > 0 ? (
          subnames.map((subname: Subname) => (
            <NameDetailItem key={subname.name} network={network} {...subname}>
              <RightArrow as={ArrowRightSVG} />
            </NameDetailItem>
          ))
        ) : (
          <EmptyDetailContainer>
            {isLoading ? <Spinner color="blue" /> : t('tabs.subnames.empty')}
          </EmptyDetailContainer>
        )}
      </TabWrapper>
      {/* Page buttons don't work yet, this is intended! */}
      {!isLoading && subnames?.length > 0 && (
        <PageButtonsContainer>
          <PageButtons
            current={page + 1}
            onChange={(value) => setPage(value - 1)}
            total={totalPages || 1}
            max={max}
          />
        </PageButtonsContainer>
      )}
    </TabWrapperWithButtons>
  )
}
