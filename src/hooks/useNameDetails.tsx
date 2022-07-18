import { useEns } from '@app/utils/EnsProvider'
import { truncateFormat } from '@ensdomains/ensjs/dist/cjs/utils/format'
import { ReactNode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useProfile } from './useProfile'
import { useRegistrationStatus } from './useRegistrationStatus'
import { useValidate } from './useValidate'

export const useNameDetails = (name: string) => {
  const { t } = useTranslation('profile')
  const { ready, getOwner, getExpiry, batch } = useEns()

  const { name: normalisedName, valid, labelCount } = useValidate(name, !name)

  const {
    profile,
    loading: profileLoading,
    status,
  } = useProfile(normalisedName, !normalisedName)
  console.log(profile)

  const { data: batchData, isLoading: batchLoading } = useQuery(
    ['batch', 'getOwner', 'getExpiry', normalisedName],
    () =>
      labelCount === 2 && normalisedName.endsWith('.eth')
        ? batch(getOwner.batch(normalisedName), getExpiry.batch(normalisedName))
        : Promise.all([getOwner(normalisedName)]),
    {
      enabled: !!(normalisedName && valid),
    },
  )

  const { data: registrationStatus, isLoading: registrationStatusLoading } =
    useRegistrationStatus(normalisedName)

  const ownerData = batchData?.[0] as Awaited<ReturnType<typeof getOwner>>
  const expiryData = batchData?.[1] as Awaited<ReturnType<typeof getExpiry>>

  const expiryDate = expiryData?.expiry

  const truncatedName = truncateFormat(normalisedName)

  const error: string | ReactNode | null = useMemo(() => {
    if (valid === false) {
      return t('errors.invalidName')
    }
    if (profile && !profile.isMigrated) {
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
    if (
      registrationStatus === 'available' ||
      registrationStatus === 'premium' ||
      registrationStatus === 'notImported' ||
      registrationStatus === 'notOwned'
    ) {
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
    if (
      !profile &&
      !profileLoading &&
      ready &&
      status !== 'idle' &&
      status !== 'loading'
    ) {
      return t('errors.unknown')
    }
    return null
  }, [
    normalisedName,
    profile,
    profileLoading,
    ready,
    registrationStatus,
    status,
    t,
    valid,
  ])

  const isLoading =
    !ready || profileLoading || batchLoading || registrationStatusLoading

  return {
    error,
    normalisedName,
    valid,
    labelCount,
    profile,
    ownerData,
    expiryDate,
    isLoading,
    truncatedName,
    isWrapped: ownerData?.ownershipLevel === 'nameWrapper',
  }
}
