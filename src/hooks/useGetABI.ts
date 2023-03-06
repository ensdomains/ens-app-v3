import { useMemo } from 'react'
import { useQuery } from 'wagmi'

import { useEns } from '@app/utils/EnsProvider'

type AbiData = NonNullable<Awaited<ReturnType<ReturnType<typeof useEns>['getABI']>>>

export const useGetABI = (name: string, skip?: boolean) => {
  const { ready, getABI } = useEns()
  const {
    data,
    isLoading: loading,
    ...rest
  } = useQuery(
    ['useGetABI', name],
    async () => {
      const result = await getABI(name)
      return result || { abi: '' }
    },
    {
      enabled: ready && !skip && name !== '',
    },
  )

  const abi = useMemo(() => {
    if (!data?.abi) return undefined
    const abiData = data as AbiData
    return {
      data: JSON.stringify(abiData.abi),
      contentType: abiData.contentType,
    }
  }, [data])

  return {
    abi,
    loading: !ready || loading,
    ...rest,
  }
}
