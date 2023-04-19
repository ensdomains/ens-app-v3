import { useQuery } from 'wagmi'

import { useEns } from '@app/utils/EnsProvider'
import { tryBeautify } from '@app/utils/beautify'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'

type Result = {
  name: string | null
  beautifiedName: string | null
  loading: boolean
  status: ReturnType<typeof useQuery>['status']
}

export const usePrimary = (address: string, skip?: any): Result => {
  const { ready, getName } = useEns()

  const {
    data,
    isLoading: loading,
    status,
  } = useQuery(
    useQueryKeys().primary(address),
    async () => {
      const res = await getName(address)
      if (!res || !res.name || !res.match) return null
      return {
        ...res,
        beautifiedName: tryBeautify(res.name),
      }
    },
    {
      enabled: ready && !skip && address !== '',
      cacheTime: 60,
    },
  )

  return { name: data?.name || null, beautifiedName: data?.beautifiedName || null, loading, status }
}
