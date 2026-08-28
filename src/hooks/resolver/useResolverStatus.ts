import { useMemo } from 'react'
import type { Address } from 'viem'
import { useChainId } from 'wagmi'

import { useContractAddress } from '@app/hooks/chain/useContractAddress'
import { useEffectiveResolverAddress } from '@app/hooks/resolver/useEffectiveResolverAddress'
import { useResolverIsAuthorised } from '@app/hooks/resolver/useResolverIsAuthorised'
import { useResolverType } from '@app/hooks/resolver/useResolverType'
import { useProfile } from '@app/hooks/useProfile'
import { emptyAddress } from '@app/utils/constants'
import { profileHasRecords } from '@app/utils/profile'
import {
  checkProfileRecordsContains,
  checkProfileRecordsEqual,
  RecordMatch,
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

  const effectiveResolver = useEffectiveResolverAddress({
    name,
    resolverAddress: profileResolverAddress,
    enabled: enabled && !internalProfile.isLoading,
  })
  const effectiveResolverAddress = effectiveResolver.data

  const resolverType = useResolverType({
    name,
    enabled: enabled && !internalProfile.isLoading,
  })

  const resolverIsAuthorised = useResolverIsAuthorised({
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
    resolverIsAuthorised.isLoading ||
    latestResolverProfile.isLoading ||
    internalProfile.isLoading ||
    effectiveResolver.isLoading

  const isFetching =
    resolverType.isFetching ||
    resolverIsAuthorised.isFetching ||
    latestResolverProfile.isFetching ||
    effectiveResolver.isFetching

  const { isError } = resolverType

  const data = useMemo(() => {
    if (isLoading || !enabled) return

    const defaultResults = {
      hasResolver: false,
      hasLatestResolver: false,
      hasValidResolver: false,
      isOutdatedResolver: false,
      isAuthorized: false,
      isNameWrapperAware: false,
      effectiveResolverAddress: undefined as Address | undefined,
      hasProfile: false,
      hasMigratedProfile: false,
      isMigratedProfileEqual: false,
      hasMigratedRecord: undefined,
    }

    const baseResults = {
      ...defaultResults,
      hasResolver: !!profileResolverAddress && profileResolverAddress !== emptyAddress,
      hasLatestResolver: resolverType.data?.type === 'latest',
      isOutdatedResolver: resolverType.data?.type === 'outdated',
      // Wrapper awareness belongs to the resolver that actually runs the
      // writes, which is the underlying one when the name is abstracted.
      isNameWrapperAware: effectiveResolverAddress
        ? getResolverWrapperAwareness({ resolverAddress: effectiveResolverAddress, chainId })
        : false,
      // The resolver a name should be JUDGED and DISPLAYED by: the underlying
      // resolver when the name is abstracted, the registry resolver otherwise.
      // Never a write target or a migration source — records are written to
      // the registry resolver (see WEB-688 Known risks).
      effectiveResolverAddress,
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
      hasValidResolver: resolverIsAuthorised.data?.isValid,
      isAuthorized: resolverIsAuthorised.data?.isAuthorised,
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
    resolverIsAuthorised.data?.isAuthorised,
    resolverIsAuthorised.data?.isValid,
    latestResolverProfile.data,
    compare,
    migratedRecordsMatch,
    profile,
    profileResolverAddress,
    effectiveResolverAddress,
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
