import { useChainName } from '@app/hooks/useChainName'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { useTransaction } from '@app/utils/TransactionProvider'
import { makeEtherscanLink } from '@app/utils/utils'
import { Button, Toast } from '@ensdomains/thorin'
import { useRecentTransactions } from '@rainbow-me/rainbowkit'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

type Notification = {
  title: string
  description?: string
  children?: React.ReactNode
}

const ButtonContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: stretch;
    gap: ${theme.space['2']};
  `,
)

export const Notifications = () => {
  const { t } = useTranslation()
  const breakpoints = useBreakpoint()

  const chainName = useChainName()
  const transactions = useRecentTransactions()
  const previousTransactions =
    useRef<ReturnType<typeof useRecentTransactions>>()

  const [open, setOpen] = useState(false)

  const { setCurrentTransaction, getResumable } = useTransaction()

  const [notificationQueue, setNotificationQueue] = useState<Notification[]>([])
  const currentNotification = notificationQueue[0]

  useEffect(() => {
    const updatedTransactions = transactions.filter((transaction) => {
      if (previousTransactions.current) {
        const prevTransaction = previousTransactions.current.find(
          (tr) => tr.hash === transaction.hash,
        )
        if (prevTransaction) {
          return prevTransaction.status !== transaction.status
        }
      }
      return false
    })
    previousTransactions.current = JSON.parse(JSON.stringify(transactions))
    const transactionsToPush = updatedTransactions.map((transaction) => {
      const { action, key } = JSON.parse(transaction.description)
      const resumable = key && getResumable(key)
      return {
        title: t(`transaction.status.${transaction.status}.notifyTitle`),
        description: t(
          `transaction.status.${transaction.status}.notifyMessage`,
          { action: t(`transaction.description.${action}`) },
        ),
        children: resumable ? (
          <ButtonContainer>
            <a
              target="_blank"
              href={makeEtherscanLink(transaction.hash, chainName)}
              rel="noreferrer"
            >
              <Button shadowless size="small" variant="secondary">
                {t('transaction.viewEtherscan')}
              </Button>
            </a>
            <Button
              shadowless
              size="small"
              variant="primary"
              onClick={() => setCurrentTransaction(key)}
            >
              Continue
            </Button>
          </ButtonContainer>
        ) : (
          <a
            target="_blank"
            href={makeEtherscanLink(transaction.hash, chainName)}
            rel="noreferrer"
          >
            <Button shadowless size="small" variant="secondary">
              {t('transaction.viewEtherscan')}
            </Button>
          </a>
        ),
      }
    })
    setNotificationQueue((prev) => [...prev, ...transactionsToPush])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions])

  useEffect(() => {
    if (currentNotification) {
      setOpen(true)
    }
  }, [currentNotification])

  return (
    <Toast
      onClose={() => {
        setOpen(false)
        setTimeout(
          () =>
            setNotificationQueue((prev) => [
              ...prev.filter((x) => x !== currentNotification),
            ]),
          300,
        )
      }}
      open={open}
      variant={breakpoints.md ? 'desktop' : 'touch'}
      {...currentNotification}
    />
  )
}
