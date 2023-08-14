import { ReactNode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useEns } from '@app/utils/EnsProvider'
import { formatFullExpiry } from '@app/utils/utils'

import { useBasicName } from './useBasicName'
import useDNSOwner from './useDNSOwner'
import { useProfile } from './useProfile'

export const useNameDetails = (name: string, skipGraph = false) => {
  const { t } = useTranslation('profile')
  const { ready } = useEns()

  const {
    isValid,
    normalisedName,
    isLoading: basicLoading,
    isCachedData: basicIsCachedData,
    registrationStatus,
    expiryDate,
    gracePeriodEndDate,
    ...basicName
  } = useBasicName(name, { normalised: false, skipGraph })

  const {
    data: profile,
    isLoading: profileLoading,
    status,
    isCachedData: profileIsCachedData,
  } = useProfile(normalisedName, {
    enabled: !!normalisedName && normalisedName !== '[root]',
    skipGraph,
    includeAbi: true,
  })

  const {
    dnsOwner,
    isLoading: dnsOwnerLoading,
    isCachedData: dnsOwnerIsCachedData,
  } = useDNSOwner(normalisedName, isValid)

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
    if (profile && profile.message) {
      return profile.message
    }
    if (registrationStatus === 'invalid') {
      return t('errors.invalidName')
    }
    if (registrationStatus === 'gracePeriod') {
      return `${t('errors.expiringSoon', { date: formatFullExpiry(gracePeriodEndDate) })}`
    }
    if (
      // bypass unknown error for root name
      normalisedName !== '[root]' &&
      !profile &&
      !profileLoading &&
      ready &&
      status !== 'idle' &&
      status !== 'loading'
    ) {
      return t('errors.networkError.message', { ns: 'common' })
    }
    return null
  }, [
    gracePeriodEndDate,
    normalisedName,
    profile,
    profileLoading,
    ready,
    registrationStatus,
    status,
    t,
    isValid,
  ])

  const errorTitle = useMemo(() => {
    if (registrationStatus === 'gracePeriod') {
      return t('errors.hasExpired', { name })
    }
    if (
      normalisedName !== '[root]' &&
      !profile &&
      !profileLoading &&
      ready &&
      status !== 'idle' &&
      status !== 'loading'
    ) {
      return t('errors.networkError.title', { ns: 'common' })
    }
  }, [registrationStatus, name, t, profile, profileLoading, ready, status, normalisedName])

  const isLoading = !ready || profileLoading || basicLoading || dnsOwnerLoading

  return {
    error,
    errorTitle,
    normalisedName,
    isValid,
    profile,
    isLoading,
    dnsOwner,
    basicIsCachedData: basicIsCachedData || dnsOwnerIsCachedData,
    profileIsCachedData,
    registrationStatus,
    gracePeriodEndDate,
    expiryDate,
    ...basicName,
  }
}
