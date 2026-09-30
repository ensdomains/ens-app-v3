import { QueryFunctionContext } from '@tanstack/react-query'
import { isAddress, type Address } from 'viem'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, QueryConfig } from '@app/types'
import { emptyAddress } from '@app/utils/constants'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'
import { useQuery } from '@app/utils/query/useQuery'
import { getUnderlyingResolver } from '@app/utils/resolver/getUnderlyingResolver'

type UseUnderlyingResolverParameters = {
  name: string
  /** The name's resolver as the registry or the subgraph reports it. */
  resolverAddress: Address | undefined
}

type UseUnderlyingResolverReturnType = Address | null

type UseUnderlyingResolverConfig = QueryConfig<UseUnderlyingResolverReturnType, Error>

type QueryKey<TParams extends UseUnderlyingResolverParameters> = CreateQueryKey<
  TParams,
  'getUnderlyingResolver',
  'standard'
>

export const underlyingResolverQueryFn =
  (config: ConfigWithEns) =>
  async <TParams extends UseUnderlyingResolverParameters>({
    queryKey: [{ name, resolverAddress }, chainId],
  }: QueryFunctionContext<QueryKey<TParams>>): Promise<UseUnderlyingResolverReturnType> => {
    if (!name) throw new Error('name is required')
    if (!resolverAddress) throw new Error('resolverAddress is required')

    const client = config.getClient({ chainId })

    return getUnderlyingResolver(client, { name, resolverAddress })
  }

/**
 * Probes a resolver for the ENSv2 abstraction shape, returning the resolver
 * behind it or `null` when there is none. The probe itself (ABI, decode
 * guards, revert handling) lives in `@app/utils/resolver/getUnderlyingResolver`.
 * ERC-165 is only a self-report, so this low-level hook does not establish that
 * the outer resolver is an official ENS mirror. Prefer
 * {@link import('./useEffectiveResolverAddress').useEffectiveResolverAddress},
 * which authenticates the outer resolver against the active-chain allowlist
 * before folding the answer into a single address to judge, display, or write
 * through.
 */
export const useUnderlyingResolver = ({
  // config
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  // params
  ...params
}: UseUnderlyingResolverParameters & UseUnderlyingResolverConfig) => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getUnderlyingResolver',
    queryDependencyType: 'standard',
    queryFn: underlyingResolverQueryFn,
  })

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    enabled:
      enabled &&
      !!params.name &&
      !!params.resolverAddress &&
      isAddress(params.resolverAddress, { strict: false }) &&
      params.resolverAddress.toLowerCase() !== emptyAddress,
    gcTime,
    staleTime,
    // A revert is no longer the failure path — an ordinary resolver answers
    // the ERC-165 check cleanly with false — so an error here is a transport
    // failure, which a retry can fix and which otherwise degrades an
    // abstracted name to being judged on the mirror. Bounded rather than left
    // to the default: every hook in the judging chain waits on this one, so
    // the retry window is a spinner on Edit Profile, Wrap and Send.
    retry: 1,
  })

  const query = useQuery(preparedOptions)

  return {
    ...query,
    refetchIfEnabled: preparedOptions.enabled ? query.refetch : () => {},
    isCachedData: getIsCachedData(query),
  }
}
