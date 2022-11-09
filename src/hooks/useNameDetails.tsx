import { ReactNode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useEns } from '@app/utils/EnsProvider'

import { useBasicName } from './useBasicName'
import useDNSOwner from './useDNSOwner'
import { useProfile } from './useProfile'

export const useNameDetails = (name: string) => {
  const { t } = useTranslation('profile')
  const { ready } = useEns()

  const {
    valid,
    normalisedName,
    isLoading: basicLoading,
    isCachedData: basicIsCachedData,
    registrationStatus,
    ...basicName
  } = useBasicName(name)

  const {
    profile,
    loading: profileLoading,
    status,
    isCachedData: profileIsCachedData,
  } = useProfile(normalisedName, !normalisedName)

  const {
    dnsOwner,
    isLoading: dnsOwnerLoading,
    isCachedData: dnsOwnerIsCachedData,
  } = useDNSOwner(normalisedName, valid)

  const error: string | ReactNode | null = useMemo(() => {
    if (valid === false) {
      return t('errors.invalidName')
    }
    if (profile && !profile.isMigrated && typeof profile.isMigrated === 'boolean') {
      return (
        <>
          {t('errors.migrationNotAvailable')}
          <a href={`https://app.ens.domains/name/${normalisedName}`}>
            {t('errors.migrationNotAvailableLink')}
          </a>
        </>
      )
    }
    if (profile && profile.message) {
      return profile.message
    }
    if (registrationStatus === 'available' || registrationStatus === 'premium') {
      return (
        <>
          {t('errors.featureNotAvailable')}
          <a href={`https://app.ens.domains/name/${normalisedName}`}>
            {t('errors.featureNotAvailableLink')}
          </a>
        </>
      )
    }
    if (registrationStatus === 'invalid') {
      return t('errors.invalidName')
    }
    if (registrationStatus === 'gracePeriod') {
      return t('errors.expiringSoon')
    }
    if (!profile && !profileLoading && ready && status !== 'idle' && status !== 'loading') {
      return t('errors.unknown')
    }
    return null
  }, [normalisedName, profile, profileLoading, ready, registrationStatus, status, t, valid])

  const isLoading = !ready || profileLoading || basicLoading || dnsOwnerLoading

  return {
    error,
    normalisedName,
    valid,
    profile,
    isLoading,
    dnsOwner,
    basicIsCachedData: basicIsCachedData || dnsOwnerIsCachedData,
    profileIsCachedData,
    registrationStatus,
    ...basicName,
  }
}
