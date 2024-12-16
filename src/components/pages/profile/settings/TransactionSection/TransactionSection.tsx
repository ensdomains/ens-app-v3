import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Spinner, Typography } from '@ensdomains/thorin'

import { Card } from '@app/components/Card'
import { Outlink } from '@app/components/Outlink'
import { useChainName } from '@app/hooks/chain/useChainName'
import { useClearRecentTransactions } from '@app/hooks/transactions/useClearRecentTransactions'
import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import useThrottledCallback from '@app/hooks/useThrottledCallback'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { makeEtherscanLink } from '@app/utils/utils'

import { SectionContainer } from '../Section'
import { ClearTransactionsDialog } from './ClearTransactionsDialog'

const TransactionSectionContainer = styled.div<{
  $height: string
}>(
  ({ $height }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    overflow: hidden;
    height: ${$height};
    transition: 0.2s all ease-in-out;
    justify-content: flex-end;
    background-color: transparent;
  `,
)

const TransactionSectionInner = styled.div(
  () => css`
    width: 100%;
    display: flex;
    flex-direction: column;
  `,
)

const RecentTransactionsMessage = styled(Typography)(
  ({ theme }) => css`
    display: flex;
    justify-content: center;
    color: ${theme.colors.grey};
    padding: ${theme.space['4']};
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
    @media (min-width: ${theme.breakpoints.sm}px) {
      button {
        padding: 0 ${theme.space['8']};
      }
    }
  `,
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
    return `: ${key.replace(/^(?:register|commit)-(.*)-0x[a-fA-F0-9]{40}$/g, '$1')}`
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

  const nonRepricedTransactions = transactions.filter((tx) => tx.status !== 'repriced')

  const visibleTransactions = nonRepricedTransactions.slice(0, viewAmt)

  const canClear = useMemo(() => {
    return nonRepricedTransactions.length > 0
  }, [nonRepricedTransactions.length])

  const { getResumable, resumeTransactionFlow } = useTransactionFlow()

  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<string>('auto')

  const hasViewMore = nonRepricedTransactions.length > viewAmt

  const [width, _setWidth] = useState(0)
  const setWidth = useThrottledCallback(_setWidth, 300)
  useEffect(() => {
    const onResize = () => {
      const _width = ref.current?.getBoundingClientRect().width || 0
      setWidth(_width)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const _height = ref.current?.getBoundingClientRect().height || 0
    setHeight(_height ? `${_height}px` : 'auto')
  }, [nonRepricedTransactions.length, hasViewMore, width])

  const [showClearDialog, setShowClearDialog] = useState(false)

  return (
    <>
      <SectionContainer
        data-testid="transaction-section"
        title={t('section.transaction.title')}
        action={
          <Button
            size="small"
            colorStyle="accentSecondary"
            onClick={() => setShowClearDialog(true)}
            disabled={!canClear}
            data-testid="transaction-clear-button"
          >
            {tc('action.clear')}
          </Button>
        }
        fill
      >
        <TransactionSectionContainer $height={height} data-testid="transaction-section-container">
          <TransactionSectionInner ref={ref}>
            {nonRepricedTransactions.length > 0 ? (
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
                            {t('action.continue', { ns: 'common' })}
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
          </TransactionSectionInner>
        </TransactionSectionContainer>
      </SectionContainer>
      <ClearTransactionsDialog
        open={showClearDialog}
        onClose={() => setShowClearDialog(false)}
        onDismiss={() => setShowClearDialog(false)}
        onClear={() => {
          clearTransactions()
          setShowClearDialog(false)
          setViewAmt(5)
        }}
      />
    </>
  )
}
