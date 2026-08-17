import { ReactNode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { DesyncedMessage } from '@app/components/@molecules/DesyncedMessage/DesyncedMessage'
import { isShortEth2LD } from '@app/utils/shortName'
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

  const basicNameData = useBasicName({ name })
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
  } = basicNameData

  const isShortName = isShortEth2LD(basicNameData)

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
    if (registrationStatus === 'short') {
      return { content: t('errors.shortName'), type: 'error' }
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
        // The usual copy promises extension and then availability, and a short name gets neither:
        // the app does not offer to extend it, and the registrar will not re-register it.
        content: isShortName
          ? t('errors.expiringSoonShortName', { date: formatFullExpiry(gracePeriodEndDate) })
          : t('errors.expiringSoon', { date: formatFullExpiry(gracePeriodEndDate) }),
      }
    }
    if (
      // bypass unknown error for root name
      !!normalisedName &&
      normalisedName !== '[root]' &&
      !profile &&
      !isBasicLoading &&
      !isProfileLoading
    ) {
      return {
        title: t('errors.networkError.title', { ns: 'common' }),
        content: t('errors.networkError.message', { ns: 'common' }),
      }
    }
    return null
  }, [
    expiryDate,
    gracePeriodEndDate,
    normalisedName,
    profile,
    isBasicLoading,
    isProfileLoading,
    registrationStatus,
    t,
    isValid,
    isShortName,
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
