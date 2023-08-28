import { useMemo } from 'react'
import { useQuery } from 'wagmi'

import supportedAddresses from '@app/constants/supportedAddresses.json'
import supportedProfileItems from '@app/constants/supportedGeneralRecordKeys.json'
import supportedTexts from '@app/constants/supportedSocialRecordKeys.json'
import { Profile } from '@app/types'
import { useEns } from '@app/utils/EnsProvider'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { useGlobalErrorFunc } from './errors/useGlobalErrorFunc'
import { useABI } from './useABI'
import useDecryptName from './useDecryptName'

type UseProfileOptions = {
  enabled?: boolean
  resolverAddress?: string
  skipGraph?: boolean
  includeAbi?: boolean
}

export const useProfile = (
  name: string,
  { resolverAddress, ...options }: UseProfileOptions = {},
) => {
  const enabled = options.enabled ?? true
  const skipGraph = options.skipGraph ?? false
  const includeAbi = options.includeAbi ?? false

  const { ready, getProfile } = useEns()

  const queryKey = useQueryKeys().profile(name, resolverAddress, skipGraph)
  const watchedGetProfile = useGlobalErrorFunc<typeof getProfile>({
    queryKey,
    func: getProfile,
    skip: skipGraph,
    ms: 10000,
  })
  const {
    data: profile,
    isLoading: isProfileLoading,
    status,
    isError,
    isFetchedAfterMount,
    isFetched,
    // don't remove this line, it updates the isCachedData state (for some reason) but isn't needed to verify it
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isFetching,
  } = useQuery(
    queryKey,
    () =>
      watchedGetProfile(name, {
        fallback: {
          coinTypes: supportedAddresses,
          texts: [...supportedTexts, ...supportedProfileItems],
        },
        resolverAddress,
        skipGraph,
      }).then((r) => r || null),
    {
      enabled: ready && enabled && name !== '',
    },
  )

  const { decryptedName } = useDecryptName(name, !profile)

  const abi = useABI(name, { enabled: includeAbi, resolverAddress: profile?.resolverAddress })

  const isLoading = !ready || isProfileLoading || abi.isLoading
  const _isFetching = isFetching || abi.isFetching
  const _isError = isError || abi.isError

  const data = useMemo(() => {
    if (isLoading) return undefined
    return {
      ...profile,
      decryptedName,
      records: {
        ...profile?.records,
        abi: abi.data,
      },
    } as Profile
  }, [isLoading, profile, decryptedName, abi])

  return {
    data,
    isLoading,
    isError: _isError,
    status,
    isFetching: _isFetching,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
  }
}
