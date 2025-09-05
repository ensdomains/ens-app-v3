import { QueryFunctionContext, useQuery } from '@tanstack/react-query'
import { toHex } from 'viem'
import { readContract } from 'viem/actions'

import { getName, GetNameParameters, GetNameReturnType } from '@ensdomains/ensjs/public'
import { normalise, packetToBytes } from '@ensdomains/ensjs/utils'

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

// Universal Resolver reverse function ABI
const universalResolverReverseAbi = [
  {
    inputs: [{ name: 'reverseName', type: 'bytes' }],
    name: 'reverse',
    outputs: [
      { name: '', type: 'string' },
      { name: '', type: 'address' },
      { name: '', type: 'address' },
      { name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

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
      try {
        const ensUniversalResolverAddress = client.chain?.contracts?.ensUniversalResolver?.address
        if (ensUniversalResolverAddress) {
          const reverseNode = `${address.toLowerCase().substring(2)}.addr.reverse`

          const rawNameResult = await readContract(client, {
            address: ensUniversalResolverAddress,
            abi: universalResolverReverseAbi,
            functionName: 'reverse',
            args: [toHex(packetToBytes(reverseNode))],
          })

          if (rawNameResult && rawNameResult[0]) {
            ;[originalName] = rawNameResult
            // Check if the raw name is normalized
            try {
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
