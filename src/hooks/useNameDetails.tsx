import { ReactNode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

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
  const error: string | ReactNode | null = useMemo(() => {
    if (isValid === false) {
      return t('errors.invalidName')
    }
    if (registrationStatus === 'unsupportedTLD') {
      return t('errors.unsupportedTLD')
    }
    if (profile && !profile.isMigrated && typeof profile.isMigrated === 'boolean') {
      return (
        <>
          {t('errors.migrationNotAvailable')}
          <a href={`https://legacy.ens.domains/name/${normalisedName}`}>
            {t('errors.migrationNotAvailableLink')}
          </a>
        </>
      )
    }
    if (registrationStatus === 'invalid') {
      return t('errors.invalidName')
    }
    if (registrationStatus === 'gracePeriod') {
      return `${t('errors.expiringSoon', { date: formatFullExpiry(gracePeriodEndDate) })}`
    }
    if (
      // bypass unknown error for root name
      !!normalisedName &&
      normalisedName !== '[root]' &&
      !profile &&
      !isProfileLoading
    ) {
      return t('errors.networkError.message', { ns: 'common' })
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

  const errorTitle = useMemo(() => {
    if (registrationStatus === 'gracePeriod') {
      return t('errors.hasExpired', { name: normalisedName })
    }
    if (normalisedName !== '[root]' && !profile && !isProfileLoading) {
      return t('errors.networkError.title', { ns: 'common' })
    }
  }, [registrationStatus, t, profile, isProfileLoading, normalisedName])

  const isLoading = isProfileLoading || isBasicLoading || isDnsOwnerLoading
  const isCachedData = isBasicCachedData || isProfileCachedData || isDnsOwnerCachedData

  return {
    error,
    unsupported: registrationStatus === 'unsupportedTLD',
    errorTitle,
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
