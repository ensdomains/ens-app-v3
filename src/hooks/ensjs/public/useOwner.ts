import { QueryFunctionContext } from '@tanstack/react-query'
import { call } from 'viem/actions'

import { getOwner, GetOwnerParameters, GetOwnerReturnType } from '@ensdomains/ensjs/public'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, PartialBy, QueryConfig } from '@app/types'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { getSupportedChainContractAddress } from '@app/utils/getSupportedChainContractAddress'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'
import { useQuery } from '@app/utils/query/useQuery'

type OwnerContract = 'nameWrapper' | 'registry' | 'registrar'

export type UseOwnerParameters<
  TContract extends OwnerContract | undefined = OwnerContract | undefined,
> = PartialBy<GetOwnerParameters<TContract>, 'name'> & {
  /** Bypass contract-level expiry checks when fetching owner */
  forceUnexpired?: boolean
}

export type UseOwnerReturnType<TContract extends OwnerContract | undefined = undefined> =
  GetOwnerReturnType<TContract>

type UseOwnerConfig<TContract extends OwnerContract | undefined = OwnerContract | undefined> =
  QueryConfig<UseOwnerReturnType<TContract>, Error>

export type UseOwnerQueryKey<TContract extends OwnerContract | undefined = undefined> =
  CreateQueryKey<UseOwnerParameters<TContract>, 'getOwner', 'standard'>

/**
 * Creates bytecode that allows fetching an address value from a single-level mapped storage slot.
 *
 * i.e. `tokens[id] = address`
 * @param params
 * @param params.forSlot The storage slot to fetch the address from
 * @returns The bytecode to fetch the address from the storage slot
 * @source https://gist.github.com/TateB/d84e4789e1419a637fda6e23250fa1df yul code
 */
const createAddressStorageSlotFetcherBytecode = ({ forSlot }: { forSlot: number }) =>
  `0x6004355f52600${forSlot}60205260405f20545f52600c60405f5e60205ff3` as const

export const getOwnerQueryFn =
  (config: ConfigWithEns) =>
  async <TContract extends OwnerContract | undefined = undefined>({
    queryKey: [{ name, forceUnexpired, ...params }, chainId],
  }: QueryFunctionContext<UseOwnerQueryKey<TContract>>) => {
    if (!name) throw new Error('name is required')

    const client = config.getClient({ chainId })

    if (!forceUnexpired) return getOwner(client, { name, ...params })

    return call(client, {
      ...getOwner.encode(client, { name, ...params }),
      // override bytecode for namewrapper + registrar contracts with a simple helper
      stateOverride: [
        {
          address: getSupportedChainContractAddress({ client, contract: 'ensNameWrapper' }),
          // _tokens at slot 1
          code: createAddressStorageSlotFetcherBytecode({ forSlot: 1 }),
        },
        {
          address: getSupportedChainContractAddress({
            client,
            contract: 'ensBaseRegistrarImplementation',
          }),
          // _tokenOwner at slot 5
          code: createAddressStorageSlotFetcherBytecode({ forSlot: 5 }),
        },
      ],
    }).then((r) => getOwner.decode(client, r.data || '0x', { name, ...params }))
  }

export const useOwner = <
  TContract extends OwnerContract | undefined = undefined,
  const TParams extends UseOwnerParameters<TContract> = UseOwnerParameters<TContract>,
>({
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  ...params
}: TParams & UseOwnerConfig<TContract>) => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getOwner',
    queryDependencyType: 'standard',
    queryFn: getOwnerQueryFn,
  })

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    enabled: enabled && !!params.name,
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
