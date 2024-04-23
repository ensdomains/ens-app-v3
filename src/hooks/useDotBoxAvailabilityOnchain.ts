import { QueryFunctionContext, useQuery } from '@tanstack/react-query'
import { Address, createPublicClient, http, namehash, zeroAddress } from 'viem'
import { readContract } from 'viem/actions'
import { optimism } from 'viem/chains'

import { registryOwnerSnippet } from '@ensdomains/ensjs/contracts'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, QueryConfig } from '@app/types'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'

import { useDebounce } from './useDebounce'

type UseDotBoxOwnerParameters = {
  name?: string
  isValid: boolean
}

type UseDotBoxOwnerReturnType = Address | null

type UseDotBoxOwnerConfig = QueryConfig<UseDotBoxOwnerReturnType, Error>

type QueryKey<TParams extends UseDotBoxOwnerParameters> = CreateQueryKey<
  TParams,
  'getDotBoxOwner',
  'standard'
>

const optimismPublicClient = createPublicClient({
  chain: optimism,
  transport: http('https://optimism-mainnet.infura.io/v3/cfa6ae2501cc4354a74e20432507317c'),
})

const THREE_DNS_RESOLVER_ADDRESS = '0xF97aAc6C8dbaEBCB54ff166d79706E3AF7a813c8'

/* eslint-disable @typescript-eslint/no-unused-vars */
export const getOwnerQueryFn =
  (_config: ConfigWithEns) =>
  /* eslint-enable @typescript-eslint/no-unused-vars */
  async <TParams extends UseDotBoxOwnerParameters>({
    queryKey: [{ name }],
  }: QueryFunctionContext<QueryKey<TParams>>) => {
    if (!name) throw new Error('name is required')

    const owner = await readContract(optimismPublicClient, {
      abi: registryOwnerSnippet,
      address: THREE_DNS_RESOLVER_ADDRESS,
      args: [namehash(name)],
      functionName: 'owner',
    })

    return owner === zeroAddress
  }

export const useGetDotBoxAvailabilityOnChain = <TParams extends UseDotBoxOwnerParameters>({
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  ...params
}: TParams & UseDotBoxOwnerConfig) => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getDotBoxOwner',
    queryDependencyType: 'standard',
    queryFn: getOwnerQueryFn,
  })

  const debouncedValued = useDebounce(initialOptions.queryKey, 500)

  const preparedOptions = prepareQueryOptions({
    queryKey: debouncedValued,
    queryFn: initialOptions.queryFn,
    enabled: enabled && !!params.name && params.isValid,
    gcTime,
    staleTime,
  })

  const query = useQuery(preparedOptions)

  return {
    ...query,
    refetchIfEnabled: preparedOptions.enabled ? query.refetch : () => {},
    isCachedData: getIsCachedData(query),
  }
}
