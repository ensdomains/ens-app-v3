import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { NameExpiryDesyncBanner } from '@app/components/@molecules/NameExpiryDesyncBanner'
import type { ContentWarning } from '@app/layouts/Content'
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
    isLoading: isBasicLoading,
    isCachedData: isBasicCachedData,
    refetchIfEnabled: refetchBasicName,
    ...basicName
  } = useBasicName({ name })

  const {
    isValid,
    normalisedName,
    registrationStatus,
    expiryDate,
    gracePeriodEndDate,
    wrapperData,
    isETH,
    is2LD,
    ownerData,
  } = basicName

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

  const warning: ContentWarning = useMemo(() => {
    if (isValid === false) {
      return { type: 'warning', message: t('errors.invalidName') }
    }
    if (registrationStatus === 'unsupportedTLD') {
      return { type: 'warning', message: t('errors.unsupportedTLD') }
    }

    if (
      !wrapperData &&
      ownerData?.ownershipLevel === 'nameWrapper' &&
      isETH &&
      is2LD &&
      expiryDate &&
      expiryDate > new Date()
    ) {
      return {
        type: 'custom',
        content: <NameExpiryDesyncBanner normalisedName={normalisedName} />,
      }
    }

    if (profile && !profile.isMigrated && typeof profile.isMigrated === 'boolean') {
      return {
        type: 'warning',
        message: (
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
      return { type: 'warning', message: t('errors.invalidName') }
    }
    if (registrationStatus === 'gracePeriod') {
      return {
        type: 'warning',
        title: t('errors.hasExpired', { name: normalisedName }),
        message: `${t('errors.expiringSoon', { date: formatFullExpiry(gracePeriodEndDate) })}`,
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
        type: 'warning',
        title: t('errors.networkError.title', { ns: 'common' }),
        message: t('errors.networkError.message', { ns: 'common' }),
      }
    }
    return undefined
  }, [
    isValid,
    registrationStatus,
    wrapperData,
    ownerData?.ownershipLevel,
    isETH,
    is2LD,
    expiryDate,
    profile,
    normalisedName,
    isProfileLoading,
    t,
    gracePeriodEndDate,
  ])

  const isLoading = isProfileLoading || isBasicLoading || isDnsOwnerLoading
  const isCachedData = isBasicCachedData || isProfileCachedData || isDnsOwnerCachedData

  return {
    warning,
    profile,
    isLoading,
    isProfileLoading,
    isBasicLoading,
    isDnsOwnerLoading,
    dnsOwner,
    isCachedData,
    refetchIfEnabled: () => {
      refetchBasicName()
      refetchProfile()
      refetchDnsOwner()
    },
    ...basicName,
  }
}
