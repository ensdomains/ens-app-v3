import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
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

  const { resumeTransactionFlow, getResumable, getLatestTransaction } = useTransactionFlow()

  const [notificationQueue, setNotificationQueue] = useState<Notification[]>([])
  const currentNotification = notificationQueue[0]

  // Use ref to avoid recreating callback when state.items changes
  // This prevents cascading re-renders that can restart gas estimation
  const getLatestTransactionRef = useRef(getLatestTransaction)
  useEffect(() => {
    getLatestTransactionRef.current = getLatestTransaction
  }, [getLatestTransaction])

  const updateCallback = useCallback<UpdateCallback>(
    ({ action, key, status, hash }) => {
      if (status === 'pending' || status === 'repriced') return
      if (status === 'confirmed') {
        // Get transaction data for cache busting (use ref to avoid dependency)
        const latestTx = key ? getLatestTransactionRef.current(key) : undefined
        const txData = latestTx?.data as { name?: string; records?: unknown } | undefined
        const ensName = txData?.name

        switch (action) {
          case 'registerName': {
            trackEvent('register', chainName)
            // Bust cache for avatar/header if being set during registration
            if (ensName && client) {
              const registrationData = txData as {
                name: string
                records?: { texts?: Array<{ key: string }> }
              }
              const hasAvatarChange = registrationData.records?.texts?.some(
                (t) => t.key === 'avatar',
              )
              const hasHeaderChange = registrationData.records?.texts?.some(
                (t) => t.key === 'header',
              )
              if (hasAvatarChange)
                bustMediaCache(ensName, client as ClientWithEns, 'avatar')
              if (hasHeaderChange)
                bustMediaCache(ensName, client as ClientWithEns, 'header')
            }
            queryClient.invalidateQueries({ queryKey: [META_DATA_QUERY_KEY] })
            break
          }
          case 'commitName':
            trackEvent('commit', chainName)
            break
          case 'extendNames':
            trackEvent('renew', chainName)
            break
          case 'updateResolver':
          case 'resetProfile': {
            // These actions always bust both avatar and header
            if (ensName && client) {
              bustMediaCache(ensName, client as ClientWithEns)
            }
            queryClient.invalidateQueries({ queryKey: [META_DATA_QUERY_KEY] })
            break
          }
          case 'updateProfile':
          case 'updateProfileRecords': {
            // Check if avatar or header are being modified in records
            if (ensName && client) {
              const profileData = txData as {
                name: string
                records?:
                  | { texts?: Array<{ key: string }> }
                  | Array<{ key: string; group?: string }>
              }
              // Handle both RecordOptions format and ProfileRecord[] format
              const records = profileData.records
              let hasAvatarChange = false
              let hasHeaderChange = false
              if (Array.isArray(records)) {
                // ProfileRecord[] format (updateProfileRecords)
                hasAvatarChange = records.some(
                  (r) => r.key === 'avatar' && (r as { group?: string }).group === 'media',
                )
                hasHeaderChange = records.some(
                  (r) => r.key === 'header' && (r as { group?: string }).group === 'media',
                )
              } else if (records?.texts) {
                // RecordOptions format (updateProfile)
                hasAvatarChange = records.texts.some((t) => t.key === 'avatar')
                hasHeaderChange = records.texts.some((t) => t.key === 'header')
              }
              if (hasAvatarChange)
                bustMediaCache(ensName, client as ClientWithEns, 'avatar')
              if (hasHeaderChange)
                bustMediaCache(ensName, client as ClientWithEns, 'header')
            }
            queryClient.invalidateQueries({ queryKey: [META_DATA_QUERY_KEY] })
            break
          }
          case 'resetProfileWithRecords':
          case 'migrateProfile':
          case 'migrateProfileWithReset': {
            // Check if avatar or header are in the records being set
            if (ensName && client) {
              const recordsData = txData as {
                name: string
                records?: { texts?: Array<{ key: string }> }
              }
              const hasAvatarChange = recordsData.records?.texts?.some(
                (t) => t.key === 'avatar',
              )
              const hasHeaderChange = recordsData.records?.texts?.some(
                (t) => t.key === 'header',
              )
              if (hasAvatarChange)
                bustMediaCache(ensName, client as ClientWithEns, 'avatar')
              if (hasHeaderChange)
                bustMediaCache(ensName, client as ClientWithEns, 'header')
            }
            queryClient.invalidateQueries({ queryKey: [META_DATA_QUERY_KEY] })
            break
          }
          default:
            break
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
