import { ReactNode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { ReturnedENS } from '@app/types'
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

const addFallbackAddr = (profile: ReturnedENS['getProfile'], addrData: string | undefined) => {
  const baseArray = profile?.records?.coinTypes || []
  if (!addrData) return baseArray
  const ethIndex = baseArray.findIndex((item) => item.key === '60')
  if (typeof ethIndex === 'number' && ethIndex !== -1) return baseArray
  const addrItem = { key: '60', type: 'addr', coin: 'ETH', addr: addrData } as any
  return [...baseArray, addrItem]
}

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
    addrData,
    refetch: refetchBasicName,
    ...basicName
  } = useBasicName(name, { normalised: false, skipGraph })

  const {
    profile: baseProfile,
    loading: profileLoading,
    status,
    isCachedData: profileIsCachedData,
    refetch: refetchProfile,
  } = useProfile(normalisedName, {
    skip: !normalisedName || normalisedName === '[root]',
    skipGraph,
  })

  const { abi, loading: abiLoading } = useGetABI(
    normalisedName,
    !normalisedName || normalisedName === '[root]',
  )

  const profile: DetailedProfile | undefined = useMemo(() => {
    if (!baseProfile) {
      if (!addrData) return undefined
      return {
        address: addrData,
        isMigrated: null,
        createdAt: null,
        records: {
          coinTypes: addFallbackAddr(baseProfile, addrData),
        },
      }
    }
    return {
      ...baseProfile,
      records: {
        ...baseProfile.records,
        coinTypes: addFallbackAddr(baseProfile, addrData),
        ...(abi ? { abi } : {}),
      },
    }
  }, [abi, addrData, baseProfile])

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
      return t('errors.networkError.message', { ns: 'common' })
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
    if (
      normalisedName !== '[root]' &&
      !profile &&
      !profileLoading &&
      !abiLoading &&
      ready &&
      status !== 'idle' &&
      status !== 'loading'
    ) {
      return t('errors.networkError.title', { ns: 'common' })
    }
  }, [
    registrationStatus,
    name,
    t,
    profile,
    profileLoading,
    abiLoading,
    ready,
    status,
    normalisedName,
  ])

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
    addrData,
    refetch: () => {
      refetchBasicName()
      refetchProfile()
    },
    ...basicName,
  }
}
