import { Button, Spinner, Typography } from '@ensdomains/thorin'
import {
  useClearRecentTransactions,
  useRecentTransactions,
} from '@rainbow-me/rainbowkit'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import styled, { css } from 'styled-components'
import { useNetwork } from 'wagmi'
import { Card } from '../Card'
import { Outlink } from '../Outlink'
import { SectionContainer, SectionHeading } from './Section'

const TransactionSectionHeadingContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const TransactionSectionHeading = styled(SectionHeading)<{
  $hasTransactions: boolean
}>`
  ${({ theme, $hasTransactions }) => css`
    position: relative;
    ${$hasTransactions &&
    css`
      &::after {
        content: '';
        position: absolute;
        height: ${theme.space['3']};
        width: ${theme.space['3']};
        background-color: ${theme.colors.red};
        border-radius: ${theme.radii.full};
        top: ${theme.space['2']};
      }
    `}
  `}
`

const TransactionSectionContainer = styled.div<{ $hasTransactions: boolean }>`
  ${({ theme, $hasTransactions }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: ${theme.colors.foregroundSecondary};
    width: 100%;
    height: ${theme.space['13']};
    border-radius: ${theme.radii.extraLarge};
    overflow: hidden;
    ${$hasTransactions &&
    css`
      height: auto;
      background-color: transparent;
      border: 1px solid ${theme.colors.borderTertiary};
    `}
  `}
`

const RecentTransactionsMessage = styled(Typography)`
  ${({ theme }) => css`
    color: ${theme.colors.textTertiary};
  `}
`

const TransactionContainer = styled(Card)`
  ${({ theme }) => css`
    width: 100%;
    padding: ${theme.space['3']};
    flex-direction: row;
    justify-content: flex-start;
    gap: ${theme.space['3']};
    flex-gap: ${theme.space['3']};
    border: none;
    border-bottom: 1px solid ${theme.colors.borderTertiary};
    border-radius: ${theme.radii.none};
    &:last-of-type {
      border: none;
    }
  `}
`

const TransactionInfoContainer = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding-left: ${theme.space['1']};
  `}
`

const TransactionStatus = styled(Typography)<{ $error: boolean }>`
  ${({ theme, $error }) => css`
    color: ${$error ? theme.colors.red : theme.colors.textTertiary};
  `}
`

const ViewLinkContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`

const ViewMoreInner = styled(Typography)`
  ${({ theme }) => css`
    width: 100%;
    text-align: center;
    color: ${theme.colors.textSecondary};
  `}
`

export const TransactionSection = () => {
  const { t } = useTranslation()

  const { activeChain } = useNetwork()
  const transactions = useRecentTransactions()
  const clearTransactions = useClearRecentTransactions()
  // const transactions = [
  //   {
  //     hash: '0x2edba3efac370d27ea850ba16c87b76af696072b9c61210b4c9f8fea57577894',
  //     description: 'setName',
  //     status: 'pending',
  //     confirmations: 0,
  //   },
  //   {
  //     hash: '0x2edba3efac370d27ea850ba16c87b76af696072b9c61210b4c9f8fea57577894',
  //     description: 'setRecords',
  //     status: 'confirmed',
  //     confirmations: 1,
  //   },
  //   {
  //     hash: '0x2edba3efac370d27ea850ba16c87b76af696072b9c61210b4c9f8fea57577894',
  //     description: 'setName',
  //     status: 'failed',
  //     confirmations: 1,
  //   },
  //   {
  //     hash: '0x2edba3efac370d27ea850ba16c87b76af696072b9c61210b4c9f8fea57577894',
  //     description: 'setName',
  //     status: 'pending',
  //     confirmations: 0,
  //   },
  //   {
  //     hash: '0x2edba3efac370d27ea850ba16c87b76af696072b9c61210b4c9f8fea57577894',
  //     description: 'setRecords',
  //     status: 'confirmed',
  //     confirmations: 1,
  //   },
  //   {
  //     hash: '0x2edba3efac370d27ea850ba16c87b76af696072b9c61210b4c9f8fea57577894',
  //     description: 'setName',
  //     status: 'failed',
  //     confirmations: 1,
  //   },
  //   {
  //     hash: '0x2edba3efac370d27ea850ba16c87b76af696072b9c61210b4c9f8fea57577894',
  //     description: 'setName',
  //     status: 'pending',
  //     confirmations: 0,
  //   },
  //   {
  //     hash: '0x2edba3efac370d27ea850ba16c87b76af696072b9c61210b4c9f8fea57577894',
  //     description: 'setRecords',
  //     status: 'confirmed',
  //     confirmations: 1,
  //   },
  //   {
  //     hash: '0x2edba3efac370d27ea850ba16c87b76af696072b9c61210b4c9f8fea57577894',
  //     description: 'setName',
  //     status: 'failed',
  //     confirmations: 1,
  //   },
  //   {
  //     hash: '0x2edba3efac370d27ea850ba16c87b76af696072b9c61210b4c9f8fea57577894',
  //     description: 'setName',
  //     status: 'pending',
  //     confirmations: 0,
  //   },
  //   {
  //     hash: '0x2edba3efac370d27ea850ba16c87b76af696072b9c61210b4c9f8fea57577894',
  //     description: 'setRecords',
  //     status: 'confirmed',
  //     confirmations: 1,
  //   },
  //   {
  //     hash: '0x2edba3efac370d27ea850ba16c87b76af696072b9c61210b4c9f8fea57577894',
  //     description: 'setName',
  //     status: 'failed',
  //     confirmations: 1,
  //   },
  // ]

  const [viewAmt, setViewAmt] = useState(5)

  return (
    <SectionContainer>
      <TransactionSectionHeadingContainer>
        <TransactionSectionHeading
          $hasTransactions={transactions.length > 0}
          variant="large"
          weight="bold"
        >
          Transactions
        </TransactionSectionHeading>
        <div>
          <Button
            size="small"
            shadowless
            variant="secondary"
            onClick={() => clearTransactions()}
            disabled={transactions.length === 0}
          >
            Clear
          </Button>
        </div>
      </TransactionSectionHeadingContainer>
      <TransactionSectionContainer $hasTransactions={transactions.length > 0}>
        {transactions.length > 0 ? (
          <>
            {transactions.slice(0, viewAmt - 1).map((transaction) => (
              <TransactionContainer>
                {transaction.status === 'pending' && <Spinner color="accent" />}
                <TransactionInfoContainer>
                  <Typography weight="bold">
                    {t(`transaction.description.${transaction.description}`)}
                  </Typography>
                  <TransactionStatus
                    $error={transaction.status === 'failed'}
                    variant="labelHeading"
                  >
                    {t(`transaction.status.${transaction.status}`)}
                  </TransactionStatus>
                </TransactionInfoContainer>
                <ViewLinkContainer>
                  <Outlink
                    href={`https://${
                      activeChain?.name && activeChain.name === 'mainnet'
                        ? ''
                        : `${activeChain?.name}.`
                    }etherscan.io/tx/${transaction.hash}`}
                  >
                    View on Etherscan
                  </Outlink>
                </ViewLinkContainer>
              </TransactionContainer>
            ))}
            {transactions.length > viewAmt && (
              <TransactionContainer
                onClick={() => setViewAmt((curr) => curr + 5)}
              >
                <ViewMoreInner weight="bold">View More</ViewMoreInner>
              </TransactionContainer>
            )}
          </>
        ) : (
          <RecentTransactionsMessage weight="bold">
            No recent transactions.
          </RecentTransactionsMessage>
        )}
      </TransactionSectionContainer>
    </SectionContainer>
  )
}
