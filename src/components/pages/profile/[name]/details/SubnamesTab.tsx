import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { ArrowRightSVG, Button, PageButtons, PlusSVG, Typography, mq } from '@ensdomains/thorin'

import { NameDetailItem } from '@app/components/@atoms/NameDetailItem/NameDetailItem'
import { SpinnerRow } from '@app/components/@molecules/ScrollBoxWithSpinner'
import { Card } from '@app/components/Card'
import { Outlink } from '@app/components/Outlink'
import { TabWrapper } from '@app/components/pages/profile/TabWrapper'
import { useSubnamePagination } from '@app/hooks/useSubnamePagination'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

const RightArrow = styled.svg(
  ({ theme }) => css`
    stroke-width: ${theme.borderWidths['0.75']};
    color: ${theme.colors.textTertiary};
    display: block;
    height: ${theme.space['6']};
    width: ${theme.space['6']};
  `,
)

const PageButtonsContainer = styled.div<{ $isFetching?: boolean }>(
  ({ theme, $isFetching }) => css`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    padding: ${theme.space['2']} ${theme.space['4']};

    ${$isFetching &&
    css`
      pointer-events: none;
      opacity: 0.5;
    `}
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
  const router = useRouter()
  const { t } = useTranslation('profile')

  const { showDataInput } = useTransactionFlow()

  const page = router.query.page ? parseInt(router.query.page as string) : 1
  const { subnames, max, isLoading, totalPages, isFetching } = useSubnamePagination(name, page)

  const setPage = (newPage: number) => {
    const url = new URL(router.asPath, window.location.origin)
    url.searchParams.set('page', newPage.toString())
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
  } else if (subnames.length > 0) {
    InnerContent = (
      <>
        <StyledTabWrapper $isFetching={isFetching}>
          {subnames.map((subname) => (
            <NameDetailItem key={subname.name} network={network} {...subname}>
              <RightArrow as={ArrowRightSVG} />
            </NameDetailItem>
          ))}
        </StyledTabWrapper>
        <PageButtonsContainer $isFetching={isFetching}>
          <PageButtons
            current={page}
            onChange={(value) => setPage(value)}
            total={totalPages || 1}
            max={max}
          />
        </PageButtonsContainer>
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
