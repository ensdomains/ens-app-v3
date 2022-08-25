import { useEns } from '@app/utils/EnsProvider'
import { useQuery } from 'wagmi'

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
  } = useQuery(['getProfile', name], () => getProfile(name), {
    enabled: ready && !skip && name !== '',
  })

  console.log(profile)

  return {
    profile,
    loading: !ready || loading,
    status,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
  }
}
