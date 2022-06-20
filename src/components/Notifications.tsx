import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { makeEtherscanLink } from '@app/utils/utils'
import { Button, Toast } from '@ensdomains/thorin'
import { useRecentTransactions } from '@rainbow-me/rainbowkit'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNetwork } from 'wagmi'

type Notification = {
  title: string
  description?: string
  children?: React.ReactNode
}

export const Notifications = () => {
  const { t } = useTranslation()
  const breakpoints = useBreakpoint()

  const { activeChain } = useNetwork()
  const transactions = useRecentTransactions()
  const previousTransactions =
    useRef<ReturnType<typeof useRecentTransactions>>()

  const [open, setOpen] = useState(false)

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
    previousTransactions.current = transactions
    const transactionsToPush = updatedTransactions.map((transaction) => ({
      title: t(`transaction.status.${transaction.status}.notifyTitle`),
      description: t(
        `transaction.status.${transaction.status}.notifyMessage`,
      ).replace('%s', t(`transaction.description.${transaction.description}`)),
      children: (
        <a
          target="_blank"
          href={makeEtherscanLink(transaction.hash, activeChain?.name)}
          rel="noreferrer"
        >
          <Button size="small">View on Etherscan</Button>
        </a>
      ),
    }))
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
        setTimeout(() => setNotificationQueue((prev) => prev.slice(1)), 300)
      }}
      open={open}
      variant={breakpoints.sm ? 'desktop' : 'touch'}
      {...currentNotification}
    />
  )
}
