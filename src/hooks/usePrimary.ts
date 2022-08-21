import { useEns } from '@app/utils/EnsProvider'
import { useQuery } from 'wagmi'

export const usePrimary = (address: string, skip?: any) => {
  const { ready, getName } = useEns()

  const {
    data,
    isLoading: loading,
    status,
  } = useQuery(['getName', address], () => getName(address), {
    enabled: ready && !skip && address !== '',
    cacheTime: 60,
  })

  return { name: data?.match ? data.name : null, loading, status }
}
