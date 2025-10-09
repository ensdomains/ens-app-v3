import { ReactNode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { DesyncedMessage } from '@app/components/@molecules/DesyncedMessage/DesyncedMessage'
import { formatFullExpiry } from '@app/utils/utils'

import { useDnsOwner } from './ensjs/dns/useDnsOwner'
import { useBasicName } from './useBasicName'
import { useProfile } from './useProfile'

type UseNameDetailsParameters = {
  name: string
  subgraphEnabled?: boolean
}

export const useNameDetails = ({ name, subgraphEnabled = true }: UseNameDetailsParameters) => {
  const { t } = useTranslation('profile')

  const {
    isValid,
    normalisedName,
    isLoading: isBasicLoading,
    isCachedData: isBasicCachedData,
    registrationStatus,
    expiryDate,
    gracePeriodEndDate,
    refetchIfEnabled: refetchBasicName,
    ...basicName
  } = useBasicName({ name })

  const {
    data: profile,
    isLoading: isProfileLoading,
    isCachedData: isProfileCachedData,
    refetchIfEnabled: refetchProfile,
  } = useProfile({
    name: normalisedName,
    enabled: !!normalisedName && normalisedName !== '[root]',
    subgraphEnabled,
  })

  const {
    data: dnsOwner,
    isLoading: isDnsOwnerLoading,
    isCachedData: isDnsOwnerCachedData,
    refetchIfEnabled: refetchDnsOwner,
  } = useDnsOwner({ name: normalisedName, enabled: isValid })
  const error: {
    title?: string
    content: string | ReactNode
    action?: string
    type?: 'error' | 'warning'
  } | null = useMemo(() => {
    if (isValid === false) {
      return { content: t('errors.invalidName') }
    }
    if (registrationStatus === 'unsupportedTLD') {
      return { content: t('errors.unsupportedTLD') }
    }
    if (profile && !profile.isMigrated && typeof profile.isMigrated === 'boolean') {
      return {
        content: (
          <>
            {t('errors.migrationNotAvailable')}
            <a href={`https://legacy.ens.domains/name/${normalisedName}`}>
              {t('errors.migrationNotAvailableLink')}
            </a>
          </>
        ),
      }
    }
    if (registrationStatus === 'invalid') {
      return { content: t('errors.invalidName') }
    }
    if (registrationStatus && ['desynced', 'desynced:gracePeriod'].includes(registrationStatus)) {
      return {
        title: t('banner.desynced.title'),
        content: (
          <DesyncedMessage
            name={normalisedName}
            expiryDate={expiryDate}
            isGracePeriod={registrationStatus === 'desynced:gracePeriod'}
          />
        ),
        type: 'error',
      }
    }
    if (registrationStatus === 'gracePeriod') {
      return {
        title: t('errors.hasExpired', { name: normalisedName }),
        content: t('errors.expiringSoon', { date: formatFullExpiry(gracePeriodEndDate) }),
      }
    }
    if (
      // bypass unknown error for root name
      !!normalisedName &&
      normalisedName !== '[root]' &&
      !profile &&
      !isProfileLoading
    ) {
      return {
        title: t('errors.networkError.title', { ns: 'common' }),
        content: t('errors.networkError.message', { ns: 'common' }),
      }
    }
    return null
  }, [
    gracePeriodEndDate,
    normalisedName,
    profile,
    isProfileLoading,
    registrationStatus,
    t,
    isValid,
  ])

  const isLoading = isProfileLoading || isBasicLoading || isDnsOwnerLoading
  const isCachedData = isBasicCachedData || isProfileCachedData || isDnsOwnerCachedData

  return {
    error,
    unsupported: registrationStatus === 'unsupportedTLD',
    normalisedName,
    isValid,
    profile,
    isLoading,
    isProfileLoading,
    isBasicLoading,
    isDnsOwnerLoading,
    dnsOwner,
    isCachedData,
    registrationStatus,
    gracePeriodEndDate,
    expiryDate,
    refetchIfEnabled: () => {
      refetchBasicName()
      refetchProfile()
      refetchDnsOwner()
    },
    ...basicName,
  }
}
