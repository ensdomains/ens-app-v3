import { useChainName } from '@app/hooks/useChainName'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { makeEtherscanLink } from '@app/utils/utils'
import { Button, Toast } from '@ensdomains/thorin'
import { useRecentTransactions } from '@rainbow-me/rainbowkit'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

type Notification = {
  title: string
  description?: string
  children?: React.ReactNode
}

export const Notifications = () => {
  const { t } = useTranslation()
  const breakpoints = useBreakpoint()

  const chainName = useChainName()
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
    previousTransactions.current = JSON.parse(JSON.stringify(transactions))
    const transactionsToPush = updatedTransactions.map((transaction) => ({
      title: t(`transaction.status.${transaction.status}.notifyTitle`),
      description: t(
        `transaction.status.${transaction.status}.notifyMessage`,
      ).replace('%s', t(`transaction.description.${transaction.description}`)),
      children: (
        <a
          target="_blank"
          href={makeEtherscanLink(transaction.hash, chainName)}
          rel="noreferrer"
        >
          <Button size="small">{t('transaction.viewEtherscan')}</Button>
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
