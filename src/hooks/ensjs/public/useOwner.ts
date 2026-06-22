import { QueryFunctionContext } from '@tanstack/react-query'
import { Address, namehash } from 'viem'
import { readContract } from 'viem/actions'

import { getOwner, GetOwnerParameters, GetOwnerReturnType } from '@ensdomains/ensjs/public'

import { getSnrcAddresses } from '@app/constants/chains'
import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, PartialBy, QueryConfig } from '@app/types'
import { emptyAddress } from '@app/utils/constants'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'
import { useQuery } from '@app/utils/query/useQuery'

const subnameRegistrarOwnerOfAbi = [
  {
    name: 'ownerOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'node', type: 'uint256' }],
    outputs: [{ type: 'address' }],
  },
] as const

type OwnerContract = 'nameWrapper' | 'registry' | 'registrar'

export type UseOwnerParameters<
  TContract extends OwnerContract | undefined = OwnerContract | undefined,
> = PartialBy<GetOwnerParameters<TContract>, 'name'>

export type UseOwnerReturnType<TContract extends OwnerContract | undefined = undefined> =
  GetOwnerReturnType<TContract>

type UseOwnerConfig<TContract extends OwnerContract | undefined = OwnerContract | undefined> =
  QueryConfig<UseOwnerReturnType<TContract>, Error>

export type UseOwnerQueryKey<TContract extends OwnerContract | undefined = undefined> =
  CreateQueryKey<UseOwnerParameters<TContract>, 'getOwner', 'standard'>

export const getOwnerQueryFn =
  (config: ConfigWithEns) =>
  async <TContract extends OwnerContract | undefined = undefined>({
    queryKey: [{ name, ...params }, chainId],
  }: QueryFunctionContext<UseOwnerQueryKey<TContract>>) => {
    if (!name) throw new Error('name is required')

    const client = config.getClient({ chainId })

    const result = await getOwner(client, { name, ...params })

    // SNRC: subnames are registry-owned by the SubnameRegistrar; their effective
    // owner/manager is the live 2LD NFT holder, derived via SubnameRegistrar.ownerOf
    // (the same indirection the PublicResolver uses for record auth). Surface that
    // holder as `owner` so the UI recognises them as the subname's manager (Edit
    // profile etc.). 2LDs are owned directly and never hit this branch; a dead/
    // purged subname returns ownerOf == 0 and is left registrar-owned (uneditable).
    const subnameRegistrar = getSnrcAddresses(chainId)?.SubnameRegistrar as Address | undefined
    if (
      result?.owner &&
      subnameRegistrar &&
      subnameRegistrar !== emptyAddress &&
      result.owner.toLowerCase() === subnameRegistrar.toLowerCase()
    ) {
      try {
        const effectiveOwner = (await readContract(client, {
          address: subnameRegistrar,
          abi: subnameRegistrarOwnerOfAbi,
          functionName: 'ownerOf',
          args: [BigInt(namehash(name))],
        })) as Address
        if (effectiveOwner && effectiveOwner !== emptyAddress) {
          return { ...result, owner: effectiveOwner }
        }
      } catch {
        /* dead / purged subname — leave registrar-owned */
      }
    }

    return result
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
