import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Toast } from '@ensdomains/thorin'

import { useChainName } from '@app/hooks/chain/useChainName'
import {
  getStatusTranslationKeys,
  getTransactionActionTranslationKeys,
  TransactionAction,
} from '@app/intl/translationKeys'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { UpdateCallback, useCallbackOnTransaction } from '@app/utils/SyncProvider/SyncProvider'
import { makeEtherscanLink } from '@app/utils/utils'

import { trackEvent } from '../utils/analytics'

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

// const getStatusTranslationKeys = (status?: 'confirmed' | 'failed' | 'pending'): string =>
//   match(status)
//     .with('confirmed', () => ({
//       title: `transaction.status.confirmed.notifyTitle`,
//       description: t(`transaction.status.confirmed.notifyMessage`, {
//         action: t(`transaction.description.${action}`),
//       }),
//     }))
//     .with('failed', () => 'action.extend')
//     .with('register', () => 'wallet.register')
//     .otherwise(() => '')

export const Notifications = () => {
  const { t } = useTranslation()
  const breakpoints = useBreakpoint()

  const chainName = useChainName()

  const [open, setOpen] = useState(false)

  const { resumeTransactionFlow, getResumable } = useTransactionFlow()

  const [notificationQueue, setNotificationQueue] = useState<Notification[]>([])
  const currentNotification = notificationQueue[0]

  const updateCallback = useCallback<UpdateCallback>(
    ({ action, key, status, hash }) => {
      if (status === 'pending' || status === 'repriced') return
      if (status === 'confirmed') {
        switch (action) {
          case 'registerName':
            trackEvent('register', chainName)
            break
          case 'commitName':
            trackEvent('commit', chainName)
            break
          case 'extendNames':
            trackEvent('renew', chainName)
            break
          default:
            break
        }
      }
      const resumable = key && getResumable(key)
      const item = {
        title: t(getStatusTranslationKeys(status).notifyTitle),
        description: t(getStatusTranslationKeys(status).notifyMessage, {
          action: t(getTransactionActionTranslationKeys(action as TransactionAction)),
        }),
        children: resumable ? (
          <ButtonContainer>
            <a target="_blank" href={makeEtherscanLink(hash, chainName)} rel="noreferrer">
              <Button size="small" colorStyle="accentSecondary">
                {t('transaction.viewEtherscan')}
              </Button>
            </a>
            <Button
              size="small"
              data-testid="notification-continue-button"
              onClick={() => resumeTransactionFlow(key)}
            >
              {t('action.continue')}
            </Button>
          </ButtonContainer>
        ) : (
          <a target="_blank" href={makeEtherscanLink(hash, chainName)} rel="noreferrer">
            <Button size="small" colorStyle="accentSecondary">
              {t('transaction.viewEtherscan')}
            </Button>
          </a>
        ),
      }

      setNotificationQueue((queue) => [...queue, item])
    },
    [chainName, getResumable, resumeTransactionFlow, t],
  )

  useCallbackOnTransaction(updateCallback)

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
          () => setNotificationQueue((prev) => [...prev.filter((x) => x !== currentNotification)]),
          300,
        )
      }}
      open={open}
      variant={breakpoints.sm ? 'desktop' : 'touch'}
      {...currentNotification}
    />
  )
}
