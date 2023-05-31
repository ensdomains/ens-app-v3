import { useMemo } from 'react'

import { useResolverIsAuthorized } from '@app/hooks/resolver/useResolverIsAuthorized'
import { useResolverType } from '@app/hooks/resolver/useResolverType'
import { useChainId } from '@app/hooks/useChainId'
import { useContractAddress } from '@app/hooks/useContractAddress'
import { useProfile } from '@app/hooks/useProfile'
import { Profile, ReturnedENS } from '@app/types'
import { emptyAddress } from '@app/utils/constants'
import { contentHashToString } from '@app/utils/contenthash'
import { profileHasRecords } from '@app/utils/profile'
import { canEditRecordsWhenWrappedCalc } from '@app/utils/utils'

import { useBasicName } from '../useBasicName'

const areRecordsEqual = (a: Profile['records'], b: Profile['records']): boolean => {
  const areTextsEqual = Object.values(
    [...(a?.texts || []), ...(b?.texts || [])].reduce<{
      [key: string]: number
    }>((acc, text) => {
      const key = `${text.key}-${text.value}`
      if (acc[key]) acc[key] += 1
      else acc[key] = 1
      return acc
    }, {}),
  ).every((count) => count === 2)
  if (!areTextsEqual) return false

  const areCoinTypesEqual = Object.values(
    [...(a?.coinTypes || []), ...(b?.coinTypes || [])].reduce<{
      [key: string]: number
    }>((acc, coinType) => {
      const key = `${coinType.coin}-${(coinType as any).addr}`
      if (acc[key]) acc[key] += 1
      else acc[key] = 1
      return acc
    }, {}),
  ).every((count) => count === 2)
  if (!areCoinTypesEqual) return false

  const isContentHashEqual = (() => {
    const contentHashA = contentHashToString(a?.contentHash)
    const contentHashB = contentHashToString(b?.contentHash)
    return contentHashA === contentHashB
  })()

  if (!isContentHashEqual) return false
  return true
}

type Options = {
  enabled?: boolean
  isWrapped?: boolean
  profile?: ReturnedENS['getProfile']
  skipCompare?: boolean
}

export const useResolverStatus = (name: string, options: Options = {}) => {
  const chainId = useChainId()

  const enabled = (options.enabled ?? true) && !!name

  const { isWrapped: internalIsWrapped, isLoading: isBasicNameLoading } = useBasicName(name, {
    enabled: enabled && typeof options.isWrapped === 'undefined',
    normalised: true,
    skipGraph: true,
  })
  const isWrapped = options.isWrapped ?? internalIsWrapped

  const { profile: internalProfile, loading: isProfileLoading } = useProfile(name, {
    skip: !enabled || !!options.profile,
    skipGraph: false,
  })
  const profile = options.profile ?? internalProfile
  const profileResolverAddress = profile?.resolverAddress

  const {
    data: typeData,
    isLoading: isTypeLoading,
    isFetching: isTypeFetching,
    isError: isTypeError,
  } = useResolverType(name, {
    enabled: enabled && !isBasicNameLoading && !isProfileLoading,
    isWrapped,
    resolverAddress: profileResolverAddress,
  })

  const {
    data: authData,
    isLoading: isAuthLoading,
    isFetching: isAuthFetching,
  } = useResolverIsAuthorized(name, {
    enabled: enabled && !isTypeLoading && typeData?.type !== 'latest',
    resolverAddress: profile?.resolverAddress,
  })

  const latestResolverAddress = useContractAddress('PublicResolver')
  const {
    profile: latestResolverProfile,
    loading: isLatestResolverProfileLoading,
    isFetching: isLatestResolverProfileFetching,
  } = useProfile(name, {
    skip:
      !enabled ||
      !!options.skipCompare ||
      isTypeLoading ||
      typeData?.type === 'latest' ||
      !latestResolverAddress,
    resolverAddress: latestResolverAddress,
  })

  const isLoading =
    isTypeLoading ||
    isAuthLoading ||
    isLatestResolverProfileLoading ||
    isBasicNameLoading ||
    isProfileLoading
  const isFetching = isTypeFetching || isAuthFetching || isLatestResolverProfileFetching
  const isError = isTypeError

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
    }

    // If the profile doesn't have a resolver, we don't need to continue checks
    if (!profileResolverAddress || profileResolverAddress === emptyAddress) return defaultResults

    const baseResults = {
      ...defaultResults,
      hasResolver: true,
      hasLatestResolver: typeData?.type === 'latest',
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
      hasValidResolver: authData?.isValid,
      isAuthorized: authData?.isAuthorized,
    }

    if (options.skipCompare) return authorizedResults

    const resolverRecords = latestResolverProfile?.records || {}
    const hasMigratedProfile = profileHasRecords(latestResolverProfile)

    return {
      ...authorizedResults,
      hasMigratedProfile,
      isMigratedProfileEqual: areRecordsEqual(profile?.records, resolverRecords),
    }
  }, [
    chainId,
    authData?.isAuthorized,
    authData?.isValid,
    latestResolverProfile,
    options?.skipCompare,
    profile,
    profileResolverAddress,
    typeData?.type,
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
