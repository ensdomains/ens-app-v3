import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Spinner, Typography, mq } from '@ensdomains/thorin'

import { useClearRecentTransactions } from '@app/hooks/transactions/useClearRecentTransactions'
import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import { useChainName } from '@app/hooks/useChainName'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { makeEtherscanLink } from '@app/utils/utils'

import { Card } from '../../../Card'
import { Outlink } from '../../../Outlink'
import { SectionContainer } from './Section'

const TransactionSectionContainer = styled.div<{
  $transactionLength: number
  $hasViewMore: boolean
}>(
  ({ $transactionLength }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    overflow: hidden;
    transition: 0.2s all ease-in-out, 0s justify-content 0s linear, 0s color 0s linear;
    ${$transactionLength &&
    css`
      justify-content: flex-end;
      background-color: transparent;
    `}
  `,
)

const RecentTransactionsMessage = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.textTertiary};
  `,
)

const TransactionContainer = styled(Card)(
  ({ theme, onClick }) => css`
    width: 100%;
    min-height: ${theme.space['18']};
    padding: ${theme.space['3']};
    flex-direction: row;
    justify-content: space-between;
    gap: ${theme.space['3']};
    flex-gap: ${theme.space['3']};
    border: none;
    border-bottom: 1px solid ${theme.colors.border};
    border-radius: ${theme.radii.none};

    ${onClick &&
    css`
      cursor: pointer;
    `}

    &:last-of-type {
      border: none;
    }
  `,
)

const TransactionInfoContainer = styled.div(
  ({ theme }) => css`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding-left: ${theme.space['1']};
    gap: ${theme.space['0.5']};
  `,
)

const StyledOutlink = styled(Outlink)<{ $error: boolean }>(
  ({ theme, $error }) =>
    $error &&
    css`
      > div {
        color: ${theme.colors.red};
      }
      color: ${theme.colors.red};
    `,
)

const ContinueContainer = styled.div(({ theme }) => [
  css`
    max-width: ${theme.space['48']};
    width: fit-content;
    button {
      padding: 0 ${theme.space['4']};
    }
  `,
  mq.sm.min(css`
    button {
      padding: 0 ${theme.space['8']};
    }
  `),
])

const ViewMoreInner = styled(Typography)(
  ({ theme }) => css`
    width: 100%;
    text-align: center;
    color: ${theme.colors.textSecondary};
  `,
)

const InfoContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
  `,
)

const getTransactionExtraInfo = (action: string, key?: string) => {
  if (!key) return ''
  if (action === 'registerName' || action === 'commitName') {
    return `: ${key.split('-')[1]}`
  }
  return ''
}

export const TransactionSection = () => {
  const { t: tc } = useTranslation()
  const { t } = useTranslation('settings')

  const chainName = useChainName()
  const transactions = useRecentTransactions()
  const clearTransactions = useClearRecentTransactions()
  const [viewAmt, setViewAmt] = useState(5)
  const visibleTransactions = transactions.slice(0, viewAmt - 1)

  const canClear = useMemo(() => {
    return transactions.length > 0
  }, [transactions.length])

  const { getResumable, resumeTransactionFlow } = useTransactionFlow()

  const hasViewMore = transactions.length > viewAmt

  return (
    <SectionContainer
      data-testid="transaction-section"
      title={t('section.transaction.title')}
      action={
        <Button
          size="small"
          colorStyle="accentSecondary"
          onClick={() => clearTransactions()}
          disabled={!canClear}
          data-testid="transaction-clear-button"
        >
          {tc('action.clear')}
        </Button>
      }
      fill
    >
      <TransactionSectionContainer
        $transactionLength={visibleTransactions.length}
        $hasViewMore={hasViewMore}
        data-testid="transaction-section-container"
      >
        {transactions.length > 0 ? (
          <>
            {visibleTransactions.map(({ hash, status, action, key }, i) => {
              const resumable = key && getResumable(key)
              return (
                <TransactionContainer
                  data-testid={`transaction-${status}`}
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${hash}-${i}`}
                >
                  <InfoContainer>
                    {status === 'pending' && (
                      <Spinner data-testid="pending-spinner" color="accent" />
                    )}
                    <TransactionInfoContainer>
                      <Typography weight="bold">{`${tc(
                        `transaction.description.${action}`,
                      )}${getTransactionExtraInfo(action, key)}`}</Typography>
                      <StyledOutlink
                        $error={status === 'failed'}
                        href={makeEtherscanLink(hash, chainName)}
                        target="_blank"
                      >
                        {tc(`transaction.status.${status}.regular`)}
                      </StyledOutlink>
                    </TransactionInfoContainer>
                  </InfoContainer>
                  {resumable && (
                    <ContinueContainer>
                      <Button size="small" onClick={() => resumeTransactionFlow(key)}>
                        Continue
                      </Button>
                    </ContinueContainer>
                  )}
                </TransactionContainer>
              )
            })}
            {hasViewMore && (
              <TransactionContainer
                onClick={() => setViewAmt((curr) => curr + 5)}
                data-testid="transaction-view-more-button"
              >
                <ViewMoreInner weight="bold">{tc('transaction.viewMore')}</ViewMoreInner>
              </TransactionContainer>
            )}
          </>
        ) : (
          <RecentTransactionsMessage weight="bold">
            {t('section.transaction.noRecentTransactions')}
          </RecentTransactionsMessage>
        )}
      </TransactionSectionContainer>
    </SectionContainer>
  )
}
