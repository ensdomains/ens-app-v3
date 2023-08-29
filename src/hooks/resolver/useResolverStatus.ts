import { useMemo } from 'react'

import { useChainId } from '@app/hooks/chain/useChainId'
import { useContractAddress } from '@app/hooks/chain/useContractAddress'
import { useResolverIsAuthorized } from '@app/hooks/resolver/useResolverIsAuthorized'
import { useResolverType } from '@app/hooks/resolver/useResolverType'
import { useProfile } from '@app/hooks/useProfile'
import { emptyAddress } from '@app/utils/constants'
import { profileHasRecords } from '@app/utils/profile'
import {
  RecordMatch,
  checkProfileRecordsContains,
  checkProfileRecordsEqual,
} from '@app/utils/records'
import { getResolverWrapperAwareness } from '@app/utils/utils'

type UseResolverStatusParameters = {
  name: string

  enabled?: boolean
  compare?: boolean
  migratedRecordsMatch?: RecordMatch
}

export const useResolverStatus = ({
  name,
  enabled: enabled_ = true,
  compare = true,
  migratedRecordsMatch,
}: UseResolverStatusParameters) => {
  const chainId = useChainId()

  const enabled = enabled_ && !!name

  const internalProfile = useProfile({
    name,
    enabled,
  })

  const { data: profile } = internalProfile
  const profileResolverAddress = profile?.resolverAddress

  const resolverType = useResolverType({
    name,
    enabled: enabled && !internalProfile.isLoading,
  })

  const resolverIsAuthorized = useResolverIsAuthorized({
    name,
    enabled: enabled && !resolverType.isLoading && resolverType.data?.type !== 'latest',
  })

  const latestResolverAddress = useContractAddress({ contract: 'ensPublicResolver' })

  const latestResolverProfile = useProfile({
    name,
    resolverAddress: latestResolverAddress,
    enabled:
      enabled &&
      compare &&
      !resolverType.isLoading &&
      resolverType.data?.type !== 'latest' &&
      !!latestResolverAddress,
  })

  const isLoading =
    resolverType.isLoading ||
    resolverIsAuthorized.isLoading ||
    latestResolverProfile.isLoading ||
    internalProfile.isLoading

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

    const baseResults = {
      ...defaultResults,
      hasResolver: !!profileResolverAddress && profileResolverAddress !== emptyAddress,
      hasLatestResolver: resolverType.data?.type === 'latest',
      isNameWrapperAware: profileResolverAddress
        ? getResolverWrapperAwareness({ resolverAddress: profileResolverAddress, chainId })
        : false,
      hasProfile: profileHasRecords(profile),
    }

    // If the profile has the latest resolver, we don't need to continue checks
    if (baseResults.hasLatestResolver) {
      return {
        ...baseResults,
        hasValidResolver: true,
        isAuthorized: true,
        hasMigratedProfile: true,
        isMigratedProfileEqual: true,
      }
    }

    const authorizedResults = {
      ...baseResults,
      hasValidResolver: resolverIsAuthorized.data?.isValid,
      isAuthorized: resolverIsAuthorized.data?.isAuthorised,
    }

    if (!compare) return authorizedResults

    const resolverRecords = latestResolverProfile.data || {}
    const hasMigratedProfile = profileHasRecords(latestResolverProfile.data)
    const hasMigratedRecord = migratedRecordsMatch
      ? checkProfileRecordsContains({ profile: resolverRecords, ...migratedRecordsMatch })
      : undefined

    return {
      ...authorizedResults,
      hasMigratedProfile,
      isMigratedProfileEqual: checkProfileRecordsEqual(profile || {}, resolverRecords),
      hasMigratedRecord,
    }
  }, [
    chainId,
    resolverIsAuthorized.data?.isAuthorised,
    resolverIsAuthorized.data?.isValid,
    latestResolverProfile.data,
    compare,
    migratedRecordsMatch,
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
