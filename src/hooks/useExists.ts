import { useEffect, useState } from 'react'
import { useQuery } from 'wagmi'

import { useEns } from '@app/utils/EnsProvider'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { useGlobalErrorFunc } from './errors/useGlobalErrorFunc'

export const useExists = (name: string, skip?: any) => {
  const { ready, getOwner } = useEns()

  const [exists, setExists] = useState(false)

  const queryKey = useQueryKeys().exists(name)
  const watchedGetOwner = useGlobalErrorFunc<typeof getOwner>({
    queryKey,
    func: getOwner,
  })
  const {
    data,
    isLoading: loading,
    status,
  } = useQuery(queryKey, () => watchedGetOwner(name, { skipGraph: false }).then((r) => r || null), {
    enabled: ready && !skip && name !== '',
  })

  useEffect(() => {
    if (data) {
      setExists(true)
    }
  }, [ready, name, skip, data])

  return { exists, loading, status }
}
