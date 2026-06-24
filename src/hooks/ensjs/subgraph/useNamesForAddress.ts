import { infiniteQueryOptions, QueryFunctionContext } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { Address, parseAbi } from 'viem'
import { readContract } from 'viem/actions'

import type {
  GetNamesForAddressParameters,
  GetNamesForAddressReturnType,
} from '@ensdomains/ensjs/subgraph'

import { getSnrcAddresses } from '@app/constants/chains'
import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey, InfiniteQueryConfig, PartialBy } from '@app/types'
import { useInfiniteQuery } from '@app/utils/query/useInfiniteQuery'

// SNRC v3 BaseRegistrar is ERC721Enumerable, so read the owner's tokens directly
// (balanceOf + tokenOfOwnerByIndex) instead of scanning Transfer logs — fast,
// trustless, no indexer, and no eth_getLogs range limits. tokenId == labelhash; the
// on-chain labelOf index gives the plaintext label (no localStorage cache needed).
const baseRegistrarReadAbi = parseAbi([
  'function balanceOf(address) view returns (uint256)',
  'function tokenOfOwnerByIndex(address, uint256) view returns (uint256)',
  'function labelOf(uint256) view returns (string)',
  'function nameExpires(uint256) view returns (uint256)',
])

const getNamesForAddressFromChain = async (
  client: any,
  address: Address,
): Promise<GetNamesForAddressReturnType> => {
  const chainId: number = client?.chain?.id
  // Pick the SNRC bundle for whichever live network the wallet is on
  // (mainnet=1, sepolia=11155111, localhost=1337). Without this, mainnet
  // would fall through to the empty localhost bundle and return [].
  const addresses = getSnrcAddresses(chainId)
  const baseRegistrar = addresses.BaseRegistrarImplementation as Address | undefined
  if (!baseRegistrar) return []
  const tld = (process.env.NEXT_PUBLIC_SIMPLEX_TLD || 'testing') as string

  // ERC721Enumerable: enumerate the owner's tokenIds (labelhashes) on-chain.
  const balance = (await readContract(client, {
    address: baseRegistrar,
    abi: baseRegistrarReadAbi,
    functionName: 'balanceOf',
    args: [address],
  })) as bigint
  const tokenIds = (await Promise.all(
    Array.from({ length: Number(balance) }, (_, i) =>
      readContract(client, {
        address: baseRegistrar,
        abi: baseRegistrarReadAbi,
        functionName: 'tokenOfOwnerByIndex',
        args: [address, BigInt(i)],
      }).catch(() => null),
    ),
  )) as (bigint | null)[]

  const now = Math.floor(Date.now() / 1000)
  const results: GetNamesForAddressReturnType = []
  await Promise.all(
    tokenIds.map(async (tokenId) => {
      if (tokenId == null) return
      const labelhashHex = `0x${tokenId.toString(16).padStart(64, '0')}` as `0x${string}`
      const label = (await readContract(client, {
        address: baseRegistrar,
        abi: baseRegistrarReadAbi,
        functionName: 'labelOf',
        args: [tokenId],
      }).catch(() => '')) as string
      const expiry = (await readContract(client, {
        address: baseRegistrar,
        abi: baseRegistrarReadAbi,
        functionName: 'nameExpires',
        args: [tokenId],
      }).catch(() => 0n)) as bigint
      // ERC721Enumerable still counts an expired-but-not-yet-re-registered name (the
      // SNRC ownerOf reverts on expiry, but the enumeration set isn't pruned), so skip
      // expired names to match the previous Transfer-scan + ownerOf behaviour.
      if (expiry && Number(expiry) <= now) return
      const labelDisplay = label || `[${labelhashHex.slice(2)}]`
      const fullName = `${labelDisplay}.${tld}`
      results.push({
        name: fullName,
        labelName: label || null,
        labelhash: labelhashHex,
        truncatedName: fullName,
        relation: { owner: true, wrappedOwner: false, registrant: true, resolvedAddress: false },
        registrationDate: undefined as any,
        expiryDate: expiry
          ? { date: new Date(Number(expiry) * 1000), value: expiry }
          : (undefined as any),
        isMigrated: true,
        parentName: tld,
        type: 'registration',
        pccExpired: false,
      } as any)
    }),
  )
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
    queryKey: [{ address }, chainId],
    pageParam,
  }: QueryFunctionContext<QueryKey<TParams>, GetNamesForAddressReturnType>) => {
    if (!address) throw new Error('address is required')

    const client = config.getClient({ chainId })

    // No subgraph: always enumerate on-chain via ERC721Enumerable
    // (balanceOf + tokenOfOwnerByIndex on BaseRegistrar) and resolve labels via
    // the v3 on-chain labelOf. The whole set is returned as one page.
    if (pageParam && pageParam.length > 0) return [] as GetNamesForAddressReturnType
    try {
      return await getNamesForAddressFromChain(client, address as Address)
    } catch {
      return [] as GetNamesForAddressReturnType
    }
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
