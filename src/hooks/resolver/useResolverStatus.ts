import { useMemo } from 'react'

import { useResolverIsAuthorized } from '@app/hooks/resolver/useResolverIsAuthorized'
import { useResolverType } from '@app/hooks/resolver/useResolverType'
import { useChainId } from '@app/hooks/useChainId'
import { useContractAddress } from '@app/hooks/useContractAddress'
import { useProfile } from '@app/hooks/useProfile'
import { ReturnedENS } from '@app/types'
import { emptyAddress } from '@app/utils/constants'
import { profileHasRecords } from '@app/utils/profile'
import {
  RecordMatch,
  checkProfileRecordsContains,
  checkProfileRecordsEqual,
} from '@app/utils/records'
import { canEditRecordsWhenWrappedCalc } from '@app/utils/utils'

import { useBasicName } from '../useBasicName'

type Options = {
  enabled?: boolean
  isWrapped?: boolean
  profile?: ReturnedENS['getProfile']
  skipCompare?: boolean
  migratedRecordsMatch?: RecordMatch
}

export const useResolverStatus = (name: string, options: Options = {}) => {
  const chainId = useChainId()

  const enabled = (options.enabled ?? true) && !!name

  const internalBasicName = useBasicName(name, {
    enabled: enabled && typeof options.isWrapped === 'undefined',
    normalised: true,
    skipGraph: true,
  })
  const isWrapped = options.isWrapped ?? internalBasicName.isWrapped

  const internalProfile = useProfile(name, {
    skip: !enabled || !!options.profile,
    skipGraph: false,
  })
  const profile = options.profile ?? internalProfile.profile
  const profileResolverAddress = profile?.resolverAddress

  const resolverType = useResolverType(name, {
    enabled: enabled && !internalBasicName.isLoading && !internalProfile.loading,
    isWrapped,
    resolverAddress: profileResolverAddress,
  })

  const resolverIsAuthorized = useResolverIsAuthorized(name, {
    enabled: enabled && !resolverType.isLoading && resolverType.data?.type !== 'latest',
    resolverAddress: profile?.resolverAddress,
  })

  const latestResolverAddress = useContractAddress('PublicResolver')

  const latestResolverProfile = useProfile(name, {
    skip:
      !enabled ||
      !!options.skipCompare ||
      resolverType.isLoading ||
      resolverType.data?.type === 'latest' ||
      !latestResolverAddress,
    resolverAddress: latestResolverAddress,
  })

  const isLoading =
    resolverType.isLoading ||
    resolverIsAuthorized.isLoading ||
    latestResolverProfile.loading ||
    internalBasicName.isLoading ||
    internalProfile.loading
  const isFetching =
    resolverType.isFetching || resolverIsAuthorized.isFetching || latestResolverProfile.isFetching
  const { isError } = resolverType

  const data = useMemo(() => {
    if (isLoading || !enabled) return

    const defaultResults = {
      hasResolver: false,
      hasLatestResolver: false,
      hasValidResolver: false,
      isAuthorized: false,
      isNameWrapperAware: false,
      hasProfile: false,
      hasMigratedProfile: false,
      isMigratedProfileEqual: false,
      hasMigratedRecord: undefined,
    }

    // If the profile doesn't have a resolver and we don't need to compare, we don't need to continue checks
    if ((!profileResolverAddress || profileResolverAddress === emptyAddress) && options.skipCompare)
      return defaultResults

    const baseResults = {
      ...defaultResults,
      hasResolver: true,
      hasLatestResolver: resolverType.data?.type === 'latest',
      isNameWrapperAware: canEditRecordsWhenWrappedCalc(true, profileResolverAddress, chainId),
      hasProfile: profileHasRecords(profile),
    }

    // If the profile has the latest resolver, we don't need to continue checks
    if (baseResults.hasLatestResolver)
      return {
        ...baseResults,
        hasValidResolver: true,
        isAuthorized: true,
        hasMigratedProfile: true,
        isMigratedProfileEqual: true,
      }

    const authorizedResults = {
      ...baseResults,
      hasValidResolver: resolverIsAuthorized.data?.isValid,
      isAuthorized: resolverIsAuthorized.data?.isAuthorized,
    }

    if (options.skipCompare) return authorizedResults

    const resolverRecords = latestResolverProfile.profile?.records || {}
    const hasMigratedProfile = profileHasRecords(latestResolverProfile.profile)
    const hasMigratedRecord = options?.migratedRecordsMatch
      ? checkProfileRecordsContains(resolverRecords, options.migratedRecordsMatch)
      : undefined

    return {
      ...authorizedResults,
      hasMigratedProfile,
      isMigratedProfileEqual: checkProfileRecordsEqual(profile?.records, resolverRecords),
      hasMigratedRecord,
    }
  }, [
    chainId,
    resolverIsAuthorized.data?.isAuthorized,
    resolverIsAuthorized.data?.isValid,
    latestResolverProfile.profile,
    options?.skipCompare,
    options?.migratedRecordsMatch,
    profile,
    profileResolverAddress,
    resolverType.data?.type,
    isLoading,
    enabled,
  ])

  return {
    data,
    isLoading,
    isFetching,
    isError,
  }
}
