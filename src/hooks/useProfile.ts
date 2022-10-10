import { useQuery } from 'wagmi'

import supportedAddresses from '@app/constants/supportedAddresses.json'
import supportedProfileItems from '@app/constants/supportedProfileItems.json'
import supportedTexts from '@app/constants/supportedTexts.json'
import { useEns } from '@app/utils/EnsProvider'

export const useProfile = (name: string, skip?: any) => {
  const { ready, getProfile } = useEns()

  const {
    data: profile,
    isLoading: loading,
    status,
    internal: { isFetchedAfterMount },
    isFetched,
    // don't remove this line, it updates the isCachedData state (for some reason) but isn't needed to verify it
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isFetching: _isFetching,
  } = useQuery(
    ['getProfile', name, 'graph'],
    () =>
      getProfile(name, {
        fallback: {
          coinTypes: supportedAddresses,
          texts: [...supportedTexts, ...supportedProfileItems],
        },
      }),
    {
      enabled: ready && !skip && name !== '',
    },
  )

  return {
    profile,
    loading: !ready || loading,
    status,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
  }
}
