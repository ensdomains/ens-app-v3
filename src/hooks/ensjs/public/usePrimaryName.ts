import { QueryFunctionContext, useQuery } from '@tanstack/react-query'
import { readContract } from 'viem/actions'

import { universalResolverReverseSnippet } from '@ensdomains/ensjs/contracts'
import { getName, GetNameParameters, GetNameReturnType } from '@ensdomains/ensjs/public'
import { normalise } from '@ensdomains/ensjs/utils'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, PartialBy, QueryConfig } from '@app/types'
import { tryBeautify } from '@app/utils/beautify'
import { emptyAddress } from '@app/utils/constants'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'

type UsePrimaryNameParameters = PartialBy<GetNameParameters, 'address'> & {
  allowMismatch?: boolean
}

type UsePrimaryNameReturnType =
  | (NonNullable<GetNameReturnType> & { beautifiedName: string; originalName?: string })
  | null

type UsePrimaryNameConfig = QueryConfig<UsePrimaryNameReturnType, Error>

type QueryKey<TParams extends UsePrimaryNameParameters> = CreateQueryKey<
  TParams,
  'getName',
  'standard'
>

export const getPrimaryNameQueryFn =
  (config: ConfigWithEns) =>
  async <TParams extends UsePrimaryNameParameters>({
    queryKey: [{ address, ...params }, chainId],
  }: QueryFunctionContext<QueryKey<TParams>>) => {
    if (!address) throw new Error('address is required')

    const client = config.getClient({ chainId })

    // Get the standard getName response
    const res = await getName(client, { address, ...params })

    if (!res || !res.name || (!res.match && !params.allowMismatch)) return null

    // When match=true, res.name is normalized. We need to fetch the raw name
    // When match=false, res.name is already the raw unnormalized name
    let originalName = res.name
    let isNormalized = true

    if (res.match) {
      // For match=true case, fetch the actual raw reverse name
      // getName() returns a normalized (lowercase) name when match=true, but we need to check
      // if the actual stored reverse name follows ENS normalization rules (ENSIP-15).
      // Some names like "MetaMask.eth" may resolve correctly but are not normalized
      // (should be "metamask.eth"). We fetch the raw name directly from the Universal Resolver
      // to verify it matches the normalized version, ensuring only properly normalized names
      // are displayed as valid primary names.
      try {
        const ensUniversalResolverAddress = client.chain?.contracts?.ensUniversalResolver?.address
        if (ensUniversalResolverAddress) {
          // Use the reverse function that takes address and coinType
          // coinType 60 is for Ethereum mainnet
          const coinType = 60n

          const rawNameResult = await readContract(client, {
            address: ensUniversalResolverAddress,
            abi: universalResolverReverseSnippet,
            functionName: 'reverse',
            args: [address, coinType],
          })
          console.log('ensUniversalResolverAddress', ensUniversalResolverAddress)
          console.log('rawNameResult', rawNameResult)

          // The reverse function returns [name, address, reverseResolver, resolver]
          if (rawNameResult && rawNameResult[0]) {
            ;[originalName] = rawNameResult
            // Check if the raw name is normalized
            try {
              console.log('originalName', originalName)
              console.log('normalise(originalName)', normalise(originalName))
              const normalizedVersion = normalise(originalName)
              isNormalized = originalName === normalizedVersion
            } catch (error) {
              // If normalisation fails, treat as non-normalized
              isNormalized = false
            }
          }
        }
      } catch (error) {
        console.error('Failed to get raw reverse name:', error)
        // Fall back to checking if res.name is normalized
        try {
          const normalizedVersion = normalise(res.name)
          isNormalized = res.name === normalizedVersion
        } catch {
          isNormalized = false
        }
      }
    } else {
      // For mismatch case, res.name is already the raw name
      originalName = res.name
      isNormalized = false // Mismatches are treated as non-normalized
    }

    // If the name is not normalized, we should treat it as a mismatch
    const effectiveMatch = res.match && isNormalized

    // Preserve the original name and decide beautification based on effective match
    const shouldBeautify = effectiveMatch !== false

    return {
      ...res,
      match: effectiveMatch,
      beautifiedName: shouldBeautify ? tryBeautify(res.name) : res.name,
      originalName, // This is the actual raw name from reverse resolution
    }
  }

export const usePrimaryName = <TParams extends UsePrimaryNameParameters>({
  // config
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  // params
  allowMismatch = false,
  ...params
}: TParams & UsePrimaryNameConfig) => {
  const initialOptions = useQueryOptions({
    params: { ...params, allowMismatch },
    scopeKey,
    functionName: 'getName',
    queryDependencyType: 'standard',
    queryFn: getPrimaryNameQueryFn,
  })

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    enabled: enabled && !!params.address && params.address !== emptyAddress,
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
