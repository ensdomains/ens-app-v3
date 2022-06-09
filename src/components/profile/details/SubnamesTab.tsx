import { useEns } from '@app/utils/EnsProvider'
import { ArrowRightSVG, PageButtons } from '@ensdomains/thorin'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useQuery } from 'wagmi'
import { NameDetailItem } from '@app/components/@atoms/NameDetailItem/NameDetailItem'
import { TabWrapper } from '../TabWrapper'

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

export const SubnamesTab = ({
  name,
  network,
}: {
  name: string
  network: string
}) => {
  const { t } = useTranslation('profile')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [page, setPage] = useState(0)
  const resultsPerPage = 10

  const { getSubnames } = useEns()
  const { data: subnameData, isLoading: loading } = useQuery(
    ['getSubnames', name, 'createdAt', 'desc', page, resultsPerPage],
    () =>
      getSubnames({
        name,
        orderBy: 'createdAt',
        orderDirection: 'desc',
        page,
        pageSize: resultsPerPage,
      }),
  )

  const subnames = (subnameData as Subname[]) || []

  return (
    <TabWrapperWithButtons>
      <TabWrapper>
        {!loading && subnames.length > 0 ? (
          subnames.map((subname) => (
            <NameDetailItem key={subname.name} network={network} {...subname}>
              <RightArrow as={ArrowRightSVG} />
            </NameDetailItem>
          ))
        ) : (
          <EmptyDetailContainer>
            {loading ? t('tabs.subnames.loading') : t('tabs.subnames.empty')}
          </EmptyDetailContainer>
        )}
      </TabWrapper>
      {/* Page buttons don't work yet, this is intended! */}
      {!loading && subnames.length > 0 && (
        <PageButtonsContainer>
          <PageButtons
            current={1}
            onChange={() => {}}
            total={2}
            max={5}
            alwaysShowFirst
            alwaysShowLast
          />
        </PageButtonsContainer>
      )}
    </TabWrapperWithButtons>
  )
}
