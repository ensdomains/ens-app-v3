import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Address, isAddress } from 'viem'
import { useChainId, useConfig } from 'wagmi'

import { getAddressRecord, getName } from '@ensdomains/ensjs/public'
import { normalise } from '@ensdomains/ensjs/utils'

import useDebouncedCallback from '@app/hooks/useDebouncedCallback'
import { ClientWithEns } from '@app/types'

type Result = { name?: string; address: Address }
type Options = { cache?: boolean }

type QueryByNameParams = {
  name: string
}

const queryByName = async (
  client: ClientWithEns,
  { name }: QueryByNameParams,
): Promise<Result | null> => {
  try {
    const normalisedName = normalise(name)
    const record = await getAddressRecord(client, { name: normalisedName })
    const address = record?.value as Address
    if (!address) throw new Error('No address found')
    return {
      name: normalisedName,
      address,
    }
  } catch {
    return null
  }
}

type QueryByAddressParams = { address: Address }

const queryByAddress = async (
  client: ClientWithEns,
  { address }: QueryByAddressParams,
): Promise<Result | null> => {
  try {
    const name = await getName(client, { address })
    return {
      name: name?.name,
      address,
    }
  } catch {
    return null
  }
}

const createQueryKeyWithChain = (chainId: number) => (query: string) => [
  'simpleSearch',
  chainId,
  query,
]

export const useSimpleSearch = (options: Options = {}) => {
  const cache = options.cache ?? true

  const queryClient = useQueryClient()
  const chainId = useChainId()
  const createQueryKey = createQueryKeyWithChain(chainId)
  const config = useConfig()

  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey: ['simpleSearch'], exact: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { mutate, isPending, ...rest } = useMutation({
    mutationFn: async (query: string) => {
      if (query.length < 3) throw new Error('Query too short')
      if (cache) {
        const cachedData = queryClient.getQueryData<Result[]>(createQueryKey(query))
        if (cachedData) return cachedData
      }
      const client = config.getClient({ chainId })
      const results = await Promise.allSettled([
        queryByName(client, { name: query }),
        ...(isAddress(query) ? [queryByAddress(client, { address: query })] : []),
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
    onSuccess: (data, variables) => {
      queryClient.setQueryData(createQueryKey(variables), data)
    },
  })
  const debouncedMutate = useDebouncedCallback(mutate, 500)

  return {
    ...rest,
    mutate: debouncedMutate,
    isLoading: isPending || !chainId,
  }
}
