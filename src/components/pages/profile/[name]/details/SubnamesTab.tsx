import { NameDetailItem } from '@app/components/@atoms/NameDetailItem/NameDetailItem'
import { TabWrapper } from '@app/components/pages/profile/TabWrapper'
import { useSubnamePagination } from '@app/hooks/useSubnamePagination'
import { ArrowRightSVG, PageButtons, Spinner } from '@ensdomains/thorin'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

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
  network: number
}) => {
  const { t } = useTranslation('profile')
  const { subnames, max, page, setPage, isLoading, totalPages } =
    useSubnamePagination(name)

  return (
    <TabWrapperWithButtons>
      <TabWrapper>
        {!isLoading && subnames?.length > 0 ? (
          subnames.map((subname) => (
            <NameDetailItem key={subname.name} network={network} {...subname}>
              <RightArrow as={ArrowRightSVG} />
            </NameDetailItem>
          ))
        ) : (
          <EmptyDetailContainer>
            {isLoading ? (
              <Spinner color="blue" />
            ) : (
              t('details.tabs.subnames.empty')
            )}
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
