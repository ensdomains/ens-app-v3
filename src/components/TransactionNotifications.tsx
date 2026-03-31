import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useClient } from 'wagmi'

import { Button, Toast } from '@ensdomains/thorin'

import { useChainName } from '@app/hooks/chain/useChainName'
import { META_DATA_QUERY_KEY } from '@app/hooks/useEnsAvatar'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { ClientWithEns } from '@app/types'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { bustMediaCache } from '@app/utils/metadataCache'
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

export const TransactionNotifications = () => {
  const { t } = useTranslation()
  const breakpoints = useBreakpoint()

  const chainName = useChainName()
  const queryClient = useQueryClient()
  const client = useClient()

  const [open, setOpen] = useState(false)

  const { resumeTransactionFlow, getResumable } = useTransactionFlow()

  const [notificationQueue, setNotificationQueue] = useState<Notification[]>([])
  const currentNotification = notificationQueue[0]

  const updateCallback = useCallback<UpdateCallback>(
    ({ action, key, status, hash, cacheBust }) => {
      if (status === 'pending' || status === 'repriced') return
      if (status === 'confirmed') {
        // Handle analytics events
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

        // Use pre-computed cache bust flags from transaction store
        if (cacheBust && client) {
          const { avatar, header, name } = cacheBust
          if (name) {
            if (avatar) bustMediaCache(name, client as ClientWithEns, 'avatar')
            if (header) bustMediaCache(name, client as ClientWithEns, 'header')
          }
        }

        // Invalidate metadata queries for actions that modify profile data
        const profileActions = [
          'registerName',
          'updateResolver',
          'resetProfile',
          'updateProfile',
          'updateProfileRecords',
          'resetProfileWithRecords',
          'migrateProfile',
          'migrateProfileWithReset',
        ]
        if (profileActions.includes(action)) {
          queryClient.invalidateQueries({ queryKey: [META_DATA_QUERY_KEY] })
        }
      }
      const resumable = key && getResumable(key)
      const item = {
        title: t(`transaction.status.${status}.notifyTitle`),
        description: t(`transaction.status.${status}.notifyMessage`, {
          action: t(`transaction.description.${action}`),
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
    [chainName, client, getResumable, resumeTransactionFlow, t, queryClient],
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
