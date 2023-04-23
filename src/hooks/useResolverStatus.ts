import { useMemo } from 'react'

import { Profile, ReturnedENS } from '@app/types'
import { contentHashToString } from '@app/utils/contenthash'
import { canEditRecordsWhenWrappedCalc } from '@app/utils/utils'

import { emptyAddress } from '../utils/constants'
import { profileHasRecords } from '../utils/profile'
import { useChainId } from './useChainId'
import { useContractAddress } from './useContractAddress'
import { useProfile } from './useProfile'
import { useResolverIsAuthorized } from './useResolverIsAuthorized'

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
  skipCompare?: boolean
}

export const useResolverStatus = (
  name: string,
  profile: ReturnedENS['getProfile'],
  options: Options = {},
) => {
  const chainId = useChainId()

  const skip = !name || !profile

  const {
    isAuthorized,
    isValid,
    isLoading: isAuthorizedLoading,
  } = useResolverIsAuthorized(name, profile?.resolverAddress)

  const latestResolverAddress = useContractAddress('PublicResolver')
  const { profile: latestResolverProfile, loading: isLatestResolverProfileLoading } = useProfile(
    name,
    skip || options.skipCompare,
    latestResolverAddress,
  )

  const profileResolverAddress = profile?.resolverAddress
  return useMemo(() => {
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
    if (!profileResolverAddress || profileResolverAddress === emptyAddress || skip)
      return {
        status: defaultResults,
        isLoading: false,
      }

    const baseResults = {
      ...defaultResults,
      hasResolver: true,
      hasLatestResolver: profileResolverAddress === latestResolverAddress,
      isNameWrapperAware: canEditRecordsWhenWrappedCalc(true, profileResolverAddress, chainId),
      hasProfile: profileHasRecords(profile),
    }

    // If the profile has the latest resolver, we don't need to continue checks
    if (baseResults.hasLatestResolver)
      return {
        status: {
          ...baseResults,
          hasValidResolver: true,
        },
        isLoading: false,
      }

    // If autorization is loading, we don't need to continue checks
    if (isAuthorizedLoading)
      return {
        status: baseResults,
        isLoading: true,
      }

    const authorizedResults = {
      ...baseResults,
      hasValidResolver: isValid,
      isAuthorized,
    }

    if (options.skipCompare) return { status: authorizedResults, isLoading: false }

    const resolverRecords = latestResolverProfile?.records || {}
    const hasMigratedProfile = profileHasRecords(latestResolverProfile)

    if (!isLatestResolverProfileLoading)
      return {
        status: {
          ...authorizedResults,
          hasMigratedProfile,
          isMigratedProfileEqual: areRecordsEqual(profile?.records, resolverRecords),
        },
        isLoading: false,
      }

    return {
      status: authorizedResults,
      isLoading: true,
    }
  }, [
    chainId,
    isAuthorized,
    isValid,
    isAuthorizedLoading,
    isLatestResolverProfileLoading,
    latestResolverAddress,
    latestResolverProfile,
    options?.skipCompare,
    profile,
    profileResolverAddress,
    skip,
  ])
}
