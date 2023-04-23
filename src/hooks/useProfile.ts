import { useMemo } from 'react'
import { useQuery } from 'wagmi'

import supportedAddresses from '@app/constants/supportedAddresses.json'
import supportedProfileItems from '@app/constants/supportedGeneralRecordKeys.json'
import supportedTexts from '@app/constants/supportedSocialRecordKeys.json'
import { useEns } from '@app/utils/EnsProvider'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import useDecryptName from './useDecryptName'

export const useProfile = (name: string, skip?: any, resolverAddress?: string) => {
  const { ready, getProfile } = useEns()

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
    useQueryKeys().profile(name, resolverAddress),
    () =>
      getProfile(name, {
        fallback: {
          coinTypes: supportedAddresses,
          texts: [...supportedTexts, ...supportedProfileItems],
        },
        resolverAddress,
      }).then((d) => d || null),
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
