import { NameDetailItem } from '@app/components/@atoms/NameDetailItem/NameDetailItem'
import { SpinnerRow } from '@app/components/@molecules/ScrollBoxWithSpinner'
import { Card } from '@app/components/Card'
import { Outlink } from '@app/components/Outlink'
import { TabWrapper } from '@app/components/pages/profile/TabWrapper'
import { useSubnamePagination } from '@app/hooks/useSubnamePagination'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { ArrowRightSVG, Button, mq, PageButtons, PlusSVG, Typography } from '@ensdomains/thorin'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

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
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    width: 100%;
    gap: ${theme.space['4']};
  `,
)

const StyledTabWrapper = styled(TabWrapper)(
  () => css`
    overflow: hidden;
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
  const { t } = useTranslation('profile')

  const { showDataInput } = useTransactionFlow()

  const { subnames, max, page, setPage, isLoading, totalPages } = useSubnamePagination(name)

  const createSubname = () =>
    showDataInput(`make-subname-${name}`, 'CreateSubname', {
      parent: name,
      isWrapped,
    })

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
        {!isLoading &&
          subnames?.length > 0 &&
          subnames.map((subname) => (
            <NameDetailItem key={subname.name} network={network} {...subname}>
              <RightArrow as={ArrowRightSVG} />
            </NameDetailItem>
          ))}
      </StyledTabWrapper>
      {isLoading && <SpinnerRow />}
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
