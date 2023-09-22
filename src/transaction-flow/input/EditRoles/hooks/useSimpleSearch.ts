import { isAddress } from '@ethersproject/address'
import { useEffect } from 'react'
import { useMutation, useQueryClient } from 'wagmi'

import { normalise } from '@ensdomains/ensjs/utils/normalise'

import useDebouncedCallback from '@app/hooks/useDebouncedCallback'
import { useEns } from '@app/utils/EnsProvider'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'

type Result = { name?: string; address: string }
type Options = { cache?: boolean }

export const useSimpleSearch = (options: Options = {}) => {
  const cache = options.cache ?? true

  const { ready, getAddr, getName } = useEns()
  const queryClient = useQueryClient()
  const queryKey = useQueryKeys()

  useEffect(() => {
    return () => {
      queryClient.removeQueries(queryKey.simpleSearchBase(), { exact: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const queryByName = async (name: string): Promise<Result | null> => {
    try {
      const normalisedName = normalise(name)
      const record = await getAddr(normalisedName, '60')
      const address = typeof record === 'string' ? record : record?.addr
      if (!address) throw new Error('No address found')
      return {
        name: normalisedName,
        address,
      }
    } catch {
      return null
    }
  }

  const queryByAddress = async (address: string): Promise<Result | null> => {
    try {
      const name = await getName(address)
      return {
        name: name?.name,
        address,
      }
    } catch {
      return null
    }
  }

  const { mutate, isLoading, ...rest } = useMutation(
    async (query: string) => {
      if (!ready) throw new Error('ENSJS not ready')
      if (query.length < 3) throw new Error('Query too short')
      if (cache) {
        const cachedData = queryClient.getQueryData<Result[]>(queryKey.simpleSearch(query))
        if (cachedData) return cachedData
      }
      const results = await Promise.allSettled([
        queryByName(query),
        queryByName(`${query}.eth`),
        ...(isAddress(query) ? [queryByAddress(query)] : []),
      ])
      const filteredData = results
        .filter<PromiseFulfilledResult<Result>>(
          (item): item is PromiseFulfilledResult<Result> =>
            item.status === 'fulfilled' && !!item.value,
        )
        .map((item) => item.value)
        .reduce((acc, cur) => {
          return {
            ...acc,
            [cur.address]: cur,
          }
        }, {})
      return Object.values(filteredData) as Result[]
    },
    {
      onSuccess: (data, variables) => {
        queryClient.setQueryData(queryKey.simpleSearch(variables), data)
      },
    },
  )
  const debouncedMutate = useDebouncedCallback(mutate, 500)

  return {
    ...rest,
    mutate: debouncedMutate,
    isLoading: isLoading || !ready,
  }
}
