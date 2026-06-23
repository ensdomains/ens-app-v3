import { QueryFunctionContext, useQuery } from '@tanstack/react-query'
import { ContractFunctionExecutionError } from 'viem'
import { readContract } from 'viem/actions'

import { universalResolverReverseSnippet } from '@ensdomains/ensjs/contracts'
import {
  getAddressRecord,
  getName,
  GetNameParameters,
  GetNameReturnType,
} from '@ensdomains/ensjs/public'
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

    let res: Awaited<ReturnType<typeof getName>>
    try {
      // Get the standard getName response
      res = await getName(client, { address, ...params })
    } catch (e) {
      if (e instanceof ContractFunctionExecutionError) return null
      throw e
    }

    if (!res || !res.name || (!res.match && !params.allowMismatch)) return null

    // A primary name is only valid if the *stored* reverse record is normalized
    // per ENSIP-15. ensjs `getName` normalizes (lowercases) the name it returns
    // when match=true, which hides whether the on-chain record was actually stored
    // in a normalized form. So we read the raw stored name to detect names like
    // "MetaMask.eth" that resolve correctly but are not normalized (the normalized
    // form is "metamask.eth"). Surfacing unnormalized names enables name spoofing.
    let originalName = res.name

    if (res.match) {
      try {
        const ensUniversalResolverAddress =
          client.chain?.contracts?.ensUniversalResolver?.address
        if (ensUniversalResolverAddress) {
          // Use the reverse function that takes address and coinType.
          // coinType 60 is for Ethereum mainnet.
          const coinType = 60n

          const rawNameResult = await readContract(client, {
            address: ensUniversalResolverAddress,
            abi: universalResolverReverseSnippet,
            functionName: 'reverse',
            args: [address, coinType],
          })

          // The reverse function returns [name, address, reverseResolver, resolver]
          if (rawNameResult && rawNameResult[0]) {
            ;[originalName] = rawNameResult
          }
        }
      } catch {
        // If we can't read the raw name, fall back to the (already normalized)
        // res.name. This is the best we can do without the raw record.
      }
    }

    // Reject any name that is not normalized. An unnormalized reverse record is not
    // a valid primary name and must never be displayed.
    let isNormalized = false
    try {
      isNormalized = !!originalName && originalName === normalise(originalName)
    } catch {
      isNormalized = false
    }
    if (!isNormalized) return null

    if (!res.match) {
      // For the mismatch case, verify the name's ETH address record points back to
      // the input address before surfacing it.
      try {
        const ethAddressRecord = await getAddressRecord(client, { name: res.name })
        const resolvedAddress = ethAddressRecord?.value

        if (!resolvedAddress || resolvedAddress.toLowerCase() !== address.toLowerCase()) {
          return null
        }
      } catch {
        return null
      }
    }

    return {
      ...res,
      name: originalName,
      beautifiedName: tryBeautify(originalName),
      originalName,
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
