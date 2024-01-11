import { getPublicClient } from '@wagmi/core'
import { useEffect } from 'react'
import { Address, isAddress } from 'viem'
import { useMutation, useQueryClient } from 'wagmi'

import { getAddressRecord, getName } from '@ensdomains/ensjs/public'
import { normalise } from '@ensdomains/ensjs/utils'

import { useChainId } from '@app/hooks/chain/useChainId'
import useDebouncedCallback from '@app/hooks/useDebouncedCallback'
import { PublicClientWithChain } from '@app/types'

type Result = { name?: string; address: Address }
type Options = { cache?: boolean }

type QueryBaseParams = {
  chainId: number
}

type QueryByNameParams = {
  name: string
} & QueryBaseParams

const queryByName = async ({ name, chainId }: QueryByNameParams): Promise<Result | null> => {
  try {
    const publicClient = getPublicClient<PublicClientWithChain>({ chainId })
    const normalisedName = normalise(name)
    const record = await getAddressRecord(publicClient, { name: normalisedName })
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

type QueryByAddressParams = { address: Address } & QueryBaseParams

const queryByAddress = async ({
  address,
  chainId,
}: QueryByAddressParams): Promise<Result | null> => {
  try {
    const publicClient = getPublicClient<PublicClientWithChain>({ chainId })
    const name = await getName(publicClient, { address })
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

  useEffect(() => {
    return () => {
      queryClient.removeQueries(['simpleSearch'], { exact: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { mutate, isLoading, ...rest } = useMutation(
    async (query: string) => {
      if (query.length < 3) throw new Error('Query too short')
      if (cache) {
        const cachedData = queryClient.getQueryData<Result[]>(createQueryKey(query))
        if (cachedData) return cachedData
      }
      const results = await Promise.allSettled([
        queryByName({ name: query, chainId }),
        queryByName({ name: `${query}.eth`, chainId }),
        ...(isAddress(query) ? [queryByAddress({ address: query, chainId })] : []),
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
        queryClient.setQueryData(createQueryKey(variables), data)
      },
    },
  )
  const debouncedMutate = useDebouncedCallback(mutate, 500)

  return {
    ...rest,
    mutate: debouncedMutate,
    isLoading: isLoading || !chainId,
  }
}
