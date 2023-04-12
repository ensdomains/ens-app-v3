import type { BigNumber } from '@ethersproject/bignumber'
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
      try {
        const result = await getABI(name)
        return result || { abi: '' }
      } catch (e: any) {
        if (e.errorName === 'Panic' && (e.errorArgs[0] as BigNumber)._hex === '0x32') {
          // getABI doesnt have support for UR revert so we catch here
          return { abi: '' }
        }
        throw e
      }
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
