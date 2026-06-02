import { infiniteQueryOptions, QueryFunctionContext } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'

import { Address, keccak256, namehash, parseAbi, parseAbiItem, toBytes } from 'viem'
import { getLogs, readContract } from 'viem/actions'
import {
  getNamesForAddress,
  GetNamesForAddressParameters,
  GetNamesForAddressReturnType,
} from '@ensdomains/ensjs/subgraph'

import { deploymentAddresses } from '@app/constants/chains'
import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, InfiniteQueryConfig, PartialBy } from '@app/types'
import { useInfiniteQuery } from '@app/utils/query/useInfiniteQuery'

// Local-dev fallback: when there is no subgraph, scan BaseRegistrar Transfer events
// to find tokenIds (labelhashes) owned by `address`, then resolve the labels via
// ensjs' label cache in localStorage (populated whenever a name is searched/registered).
const getNamesForAddressFromChain = async (
  client: any,
  address: Address,
): Promise<GetNamesForAddressReturnType> => {
  const baseRegistrar = deploymentAddresses.BaseRegistrarImplementation as Address | undefined
  if (!baseRegistrar) return []
  const tld = (process.env.NEXT_PUBLIC_SIMPLEX_TLD || 'testing') as string

  // The wagmi client doesn't expose `getLogs`/`readContract` as methods; we call
  // the viem actions directly with the client object.
  const logs = await getLogs(client, {
    address: baseRegistrar,
    event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'),
    args: { to: address },
    fromBlock: 0n,
    toBlock: 'latest',
  })

  // Drop tokens later transferred away; keep only those still owned by `address`.
  const stillOwnedIds = new Set<string>()
  const abi = parseAbi(['function ownerOf(uint256) view returns (address)', 'function nameExpires(uint256) view returns (uint256)'])
  await Promise.all(
    Array.from(new Set(logs.map((l: any) => l.args.tokenId as bigint))).map(async (tokenId) => {
      try {
        const owner = (await readContract(client, {
          address: baseRegistrar,
          abi,
          functionName: 'ownerOf',
          args: [tokenId],
        })) as Address;
        if (owner?.toLowerCase() === address.toLowerCase()) stillOwnedIds.add(tokenId.toString())
      } catch {
        /* token may have been burned/expired — skip */
      }
    }),
  )

  // Look up label strings from ensjs' localStorage cache; tokenId = labelhash.
  const labels: Record<string, string> = (() => {
    if (typeof window === 'undefined') return {}
    try {
      return JSON.parse(window.localStorage.getItem('ensjs:labels') || '{}')
    } catch {
      return {}
    }
  })()

  const now = Math.floor(Date.now() / 1000)
  const results: GetNamesForAddressReturnType = []
  for (const tokenIdStr of stillOwnedIds) {
    const tokenId = BigInt(tokenIdStr)
    const labelhashHex = `0x${tokenId.toString(16).padStart(64, '0')}` as `0x${string}`
    const label = labels[labelhashHex] || null
    let expiry: bigint = 0n
    try {
      expiry = (await readContract(client, {
        address: baseRegistrar,
        abi,
        functionName: 'nameExpires',
        args: [tokenId],
      })) as bigint
    } catch {
      /* ignore */
    }
    const labelDisplay = label ?? `[${labelhashHex.slice(2)}]`
    const fullName = `${labelDisplay}.${tld}`
    results.push({
      name: fullName,
      labelName: label,
      labelhash: labelhashHex,
      truncatedName: fullName,
      relation: { owner: true, wrappedOwner: false, registrant: true, resolvedAddress: false },
      registrationDate: undefined as any,
      expiryDate: expiry ? { date: new Date(Number(expiry) * 1000), value: expiry } : undefined as any,
      isMigrated: true,
      parentName: tld,
      type: 'registration',
      pccExpired: false,
    } as any)
  }
  return results
}

type UseNamesForAddressParameters = Omit<
  PartialBy<GetNamesForAddressParameters, 'address'>,
  'previousPage'
>

type UseNamesForAddressReturnType = GetNamesForAddressReturnType

type UseNamesForAddressConfig = InfiniteQueryConfig<UseNamesForAddressReturnType, Error>

type QueryKey<TParams extends UseNamesForAddressParameters> = CreateQueryKey<
  TParams,
  'getNamesForAddress',
  'graph'
>

export const getNamesForAddressQueryFn =
  (config: ConfigWithEns) =>
  async <TParams extends UseNamesForAddressParameters>({
    queryKey: [{ address, ...params }, chainId],
    pageParam,
  }: QueryFunctionContext<QueryKey<TParams>, GetNamesForAddressReturnType>) => {
    if (!address) throw new Error('address is required')

    const client = config.getClient({ chainId })

    // Local dev and the Sepolia custom deployment both run against contracts
    // the public ENS subgraph doesn't index — scan the chain via BaseRegistrar
    // Transfer events instead.
    if (
      typeof window !== 'undefined' &&
      (process.env.NEXT_PUBLIC_PROVIDER || process.env.NEXT_PUBLIC_SEPOLIA_DEPLOYMENT_ADDRESSES)
    ) {
      if (pageParam && pageParam.length > 0) return [] as GetNamesForAddressReturnType
      try {
        return await getNamesForAddressFromChain(client, address as Address)
      } catch {
        return [] as GetNamesForAddressReturnType
      }
    }

    return getNamesForAddress(client, { address, ...params, previousPage: pageParam })
  }

const getNextPageParam =
  <TParams extends UseNamesForAddressParameters>(params: TParams) =>
  (lastPage: GetNamesForAddressReturnType) => {
    if (lastPage?.length < (params.pageSize || 100)) return null
    return lastPage
  }

const initialPageParam = [] as GetNamesForAddressReturnType

export const useNamesForAddress = <TParams extends UseNamesForAddressParameters>({
  // config
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  // params
  ...params
}: TParams & UseNamesForAddressConfig) => {
  const paramsWithLowercaseSearchString = {
    ...params,
    filter: { ...params.filter, searchString: params.filter?.searchString?.toLocaleLowerCase() },
  }

  const initialOptions = useQueryOptions({
    params: paramsWithLowercaseSearchString,
    scopeKey,
    functionName: 'getNamesForAddress',
    queryDependencyType: 'graph',
    queryFn: getNamesForAddressQueryFn,
  })

  const preparedOptions = infiniteQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    getNextPageParam: getNextPageParam(paramsWithLowercaseSearchString),
    initialPageParam,
    enabled: enabled && !!paramsWithLowercaseSearchString.address,
    gcTime,
    staleTime,
  })

  const { data, status, isFetched, isFetching, isLoading, isFetchedAfterMount, ...rest } =
    useInfiniteQuery(preparedOptions)

  const [unfilteredPages, setUnfilteredPages] = useState<GetNamesForAddressReturnType>([])

  const infiniteData = useMemo(
    () => (data?.pages ? data?.pages.reduce((acc, page) => [...acc, ...page], []) : []),
    [data?.pages],
  )

  useEffect(() => {
    if (!paramsWithLowercaseSearchString.filter?.searchString) {
      setUnfilteredPages(infiniteData)
    }
  }, [paramsWithLowercaseSearchString.filter?.searchString, infiniteData])

  const infiniteDataWithFetchingFill = useMemo(
    () =>
      paramsWithLowercaseSearchString.filter?.searchString && isFetching
        ? unfilteredPages.filter(
            (x) => x.labelName?.includes(paramsWithLowercaseSearchString.filter!.searchString!),
          )
        : infiniteData,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isFetching,
      unfilteredPages,
      paramsWithLowercaseSearchString.filter?.searchString,
      infiniteData,
    ],
  )

  const nameCount = infiniteDataWithFetchingFill.length || 0

  return {
    data,
    infiniteData: infiniteDataWithFetchingFill,
    page: data?.pages[0] || [],
    nameCount,
    status,
    isFetched,
    isFetching,
    isFetchedAfterMount,
    isLoading: !paramsWithLowercaseSearchString.filter?.searchString
      ? isLoading
      : !infiniteDataWithFetchingFill.length && isLoading,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
    ...rest,
  }
}
