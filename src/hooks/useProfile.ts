import { useEns } from '@app/utils/EnsProvider'
import { useQuery } from 'wagmi'

export const useProfile = (name: string, skip?: any) => {
  const { ready, getProfile } = useEns()

  const {
    data: profile,
    isLoading: loading,
    status,
  } = useQuery(['getProfile', name], () => getProfile(name), {
    enabled: ready && !skip && name !== '',
  })

  return { profile, loading: !ready || loading, status }
}
