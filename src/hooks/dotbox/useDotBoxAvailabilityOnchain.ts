import { QueryFunctionContext } from '@tanstack/react-query'
import { createPublicClient, http, namehash, zeroAddress } from 'viem'
import { readContract } from 'viem/actions'
import { optimism } from 'viem/chains'

import { registryOwnerSnippet } from '@ensdomains/ensjs/contracts'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, QueryConfig } from '@app/types'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'
import { useQuery } from '@app/utils/query/useQuery'
import { drpcUrl } from '@app/utils/query/wagmi'

type UseDotBoxAvailabilityOnchainParameters = {
  name?: string
  isValid?: boolean
}

export type UseDotBoxAvailabilityOnchainReturnType = boolean

type UseDotBoxAvailabilityOnchainConfig = QueryConfig<UseDotBoxAvailabilityOnchainReturnType, Error>

export type UseDotBoxAvailabilityOnchainQueryKey<
  TParams extends UseDotBoxAvailabilityOnchainParameters = UseDotBoxAvailabilityOnchainParameters,
> = CreateQueryKey<TParams, 'getDotBoxAvailabilityOnchain', 'standard'>

const optimismPublicClient = createPublicClient({
  chain: optimism,
  transport: http(drpcUrl('optimism')),
})

const THREE_DNS_RESOLVER_ADDRESS = '0xF97aAc6C8dbaEBCB54ff166d79706E3AF7a813c8'

/* eslint-disable @typescript-eslint/no-unused-vars */
export const getDotBoxAvailabilityOnchain =
  (_config: ConfigWithEns) =>
  /* eslint-enable @typescript-eslint/no-unused-vars */
  async <TParams extends UseDotBoxAvailabilityOnchainParameters>({
    queryKey: [{ name }],
  }: QueryFunctionContext<UseDotBoxAvailabilityOnchainQueryKey<TParams>>) => {
    if (!name) throw new Error('name is required')

    const owner = await readContract(optimismPublicClient, {
      abi: registryOwnerSnippet,
      address: THREE_DNS_RESOLVER_ADDRESS,
      args: [namehash(name)],
      functionName: 'owner',
    })

    return owner === zeroAddress
  }

export const useDotBoxAvailabilityOnchain = <
  TParams extends UseDotBoxAvailabilityOnchainParameters,
>({
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  ...params
}: TParams & UseDotBoxAvailabilityOnchainConfig) => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getDotBoxAvailabilityOnchain',
    queryDependencyType: 'standard',
    queryFn: getDotBoxAvailabilityOnchain,
  })

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
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
