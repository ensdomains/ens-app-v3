import { ReactNode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useEns } from '@app/utils/EnsProvider'
import { formatFullExpiry } from '@app/utils/utils'

import { useBasicName } from './useBasicName'
import useDNSOwner from './useDNSOwner'
import { useGetABI } from './useGetABI'
import { useProfile } from './useProfile'

export type Profile = NonNullable<ReturnType<typeof useProfile>['profile']>
export type DetailedProfileRecords = Profile['records'] & {
  abi?: { data: string; contentType?: number }
}
export type DetailedProfile = Omit<Profile, 'records'> & {
  records: DetailedProfileRecords
}

export const useNameDetails = (name: string) => {
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
  } = useBasicName(name)

  const {
    profile: baseProfile,
    loading: profileLoading,
    status,
    isCachedData: profileIsCachedData,
  } = useProfile(normalisedName, !normalisedName || normalisedName === '[root]')

  const { abi, loading: abiLoading } = useGetABI(
    normalisedName,
    !normalisedName || normalisedName === '[root]',
  )

  const profile: DetailedProfile | undefined = useMemo(() => {
    if (!baseProfile) return undefined
    return {
      ...baseProfile,
      records: {
        ...baseProfile.records,
        ...(abi ? { abi } : {}),
      },
    }
  }, [abi, baseProfile])

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
      !abiLoading &&
      ready &&
      status !== 'idle' &&
      status !== 'loading'
    ) {
      return t('errors.unknown')
    }
    return null
  }, [
    gracePeriodEndDate,
    normalisedName,
    profile,
    profileLoading,
    abiLoading,
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
  }, [registrationStatus, name, t])

  const isLoading = !ready || profileLoading || abiLoading || basicLoading || dnsOwnerLoading

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
