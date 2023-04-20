import styled, { css } from 'styled-components'

import { Button, Dropdown, mq } from '@ensdomains/thorin'

import type { Transaction } from '@app/hooks/transactions/transactionStore'

export const ButtonContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row-reverse;
    justify-content: center;
    gap: ${theme.space['2.5']};
    width: 100%;

    & > button {
      margin: 0;
    }

    ${mq.sm.min(css`
      flex-direction: row-reverse;
      flex-wrap: wrap;
    `)}
  `,
)

export const CheckButton = styled(Button)(
  () => css`
    margin: 0 auto;
    ${mq.sm.min(css`
      width: 150px;
    `)}
  `,
)

const latestTransaction = (transactions: Transaction[]) => {
  const transactionKey = localStorage.getItem('latestImportTransactionKey')
  const transaction = transactions.find((transactionInner) => {
    return transactionInner.key === transactionKey
  })
  return transaction
}

export const shouldShowSuccessPage = (transactions: Transaction[]) => {
  const transaction = latestTransaction(transactions)
  return transaction && transaction.status === 'confirmed'
}

export const hasPendingTransaction = (transactions: Transaction[]) => {
  const transaction = latestTransaction(transactions)
  return transaction && transaction.status === 'pending'
}

export const AlignedDropdown = styled(Dropdown)(
  () => css`
    & > div {
      justify-content: flex-start;
      & > div:first-child,
      & > div:last-child {
        margin-top: -0.5rem;
      }
    }
  `,
)
