import type { BigNumber } from '@ethersproject/bignumber'
import { useMemo } from 'react'
import { useQuery } from 'wagmi'

import { useEns } from '@app/utils/EnsProvider'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'

type AbiData = NonNullable<Awaited<ReturnType<ReturnType<typeof useEns>['getABI']>>>

type GetABIFunc = ReturnType<typeof useEns>['getABI']
export const getABISafely = (getABI: GetABIFunc) => async (name: string) => {
  try {
    const result = await getABI(name)
    return result || { abi: '' }
  } catch (e: any) {
    if (e.errorName === 'Panic' && (e.errorArgs[0] as BigNumber)._hex === '0x32') {
      // getABI doesnt have support for UR revert so we catch here
      return { abi: '' }
    }
    if (
      e.errorName === 'Error' &&
      (e.errorArgs[0] as string) ===
        'UniversalResolver: Wildcard on non-extended resolvers is not supported'
    ) {
      // getABI doesn't have support for this error so we catch here
      return { abi: '' }
    }
    // temporary fix for non-existent fn error
    return { abi: '' }
  }
}

export const normaliseABI = (data?: AbiData | { abi: string }) => {
  if (!data?.abi) return undefined
  const abiData = data as AbiData
  return {
    data: JSON.stringify(abiData.abi),
    contentType: abiData.contentType,
  }
}

type Options = {
  enabled?: boolean
}

export const useABI = (name: string, options: Options = {}) => {
  const enabled = options.enabled ?? true

  const { ready, getABI } = useEns()
  const { data, isLoading, ...rest } = useQuery(
    useQueryKeys().getABI(name),
    async () => getABISafely(getABI)(name),
    {
      enabled: ready && enabled && name !== '' && name !== '[root]',
    },
  )

  const abi = useMemo(() => {
    if (isLoading) return undefined
    return normaliseABI(data)
  }, [data, isLoading])

  return {
    data: abi,
    isLoading: !ready || isLoading,
    ...rest,
  }
}
