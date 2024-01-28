import { useMemo } from 'react'
import { useQuery } from 'wagmi'

import supportedAddresses from '@app/constants/supportedAddresses.json'
import supportedProfileItems from '@app/constants/supportedGeneralRecordKeys.json'
import supportedTexts from '@app/constants/supportedSocialRecordKeys.json'
import { useEns } from '@app/utils/EnsProvider'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { useGlobalErrorFunc } from './errors/useGlobalErrorFunc'
import useDecryptName from './useDecryptName'

type UseProfileOptions = {
  skip?: boolean
  resolverAddress?: string
  skipGraph?: boolean
}

export const useProfile = (
  name: string,
  { skip, resolverAddress, skipGraph = false }: UseProfileOptions = {},
) => {
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
    isLoading: loading,
    status,
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
      enabled: ready && !skip && name !== '',
    },
  )

  const { decryptedName } = useDecryptName(name, !profile)

  const returnProfile = useMemo(() => {
    if (!profile) return undefined
    if (!decryptedName) return profile
    return { ...profile, decryptedName }
  }, [profile, decryptedName])

  return {
    profile: returnProfile,
    loading: !ready || loading,
    status,
    isFetching,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
  }
}
