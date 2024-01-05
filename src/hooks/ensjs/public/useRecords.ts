import { QueryFunctionContext } from '@tanstack/react-query'
import { getPublicClient } from '@wagmi/core'
import { ReadContractErrorType } from 'viem'
import { useQuery } from 'wagmi'

import { getRecords, GetRecordsParameters, GetRecordsReturnType } from '@ensdomains/ensjs/public'

import { useQueryKeyFactory } from '@app/hooks/useQueryKeyFactory'
import { CreateQueryKey, PartialBy, PublicClientWithChain, QueryConfig } from '@app/types'
import { camelToConstant } from '@app/utils/name'

// TODO: Check if this is proper way to handle ResolverNotContract errors
const RETURN_DEFAULT_ERRORS: Partial<ReadContractErrorType | Error>[] = [
  { name: 'ContractFunctionExecutionError', functionName: 'resolve' },
  { name: 'ResolverNotContract' },
]

type UseRecordsParameters = PartialBy<GetRecordsParameters, 'name'>

type UseRecordsConfig<TParams extends UseRecordsParameters> = QueryConfig<
  GetRecordsReturnType<{
    name: string
    records: TParams['records']
    resolver: TParams['resolver']
  }>,
  Error
>

type QueryKey<TParams extends UseRecordsParameters> = CreateQueryKey<
  TParams,
  'getRecords',
  'standard'
>

export const getRecordsQueryFn = async <TParams extends UseRecordsParameters>({
  queryKey: [{ name, ...params }, chainId],
}: QueryFunctionContext<QueryKey<TParams>>) => {
  if (!name) throw new Error('name is required')

  const publicClient = getPublicClient<PublicClientWithChain>({ chainId })

  try {
    const res = await getRecords(publicClient, { name, ...params })
    console.log('res', name, res)
    if (!res) return null
    return res
  } catch (e) {
    // TODO: Check resolver migration flow to understand if this should be limited to universal resolver or not. I don't think it does, but should double check.
    const error = e as ReadContractErrorType | Error
    const isReturnDefaultError = RETURN_DEFAULT_ERRORS.some((err) =>
      Object.keys(err).every((key) => {
        const propery = key as keyof (ReadContractErrorType | Error)
        return error[propery] === err[propery]
      }),
    )

    if (isReturnDefaultError)
      return {
        coins: [],
        texts: [],
        resolverAddress: null,
      }
    throw e
  }
}

export const useRecords = <TParams extends UseRecordsParameters>({
  // config
  cacheTime,
  enabled = true,
  staleTime,
  scopeKey,
  onError,
  onSettled,
  onSuccess,
  // params
  ...params
}: TParams & UseRecordsConfig<TParams>) => {
  const queryKey = useQueryKeyFactory({
    params,
    scopeKey,
    functionName: 'getRecords',
    queryDependencyType: 'standard',
  })

  const query = useQuery(queryKey, getRecordsQueryFn, {
    cacheTime,
    staleTime,
    enabled: enabled && !!params.name,
    onError,
    onSettled,
    onSuccess,
    // TODO: Temp fix to make convert ensjs coin names to previous format
    select: (data) => {
      return {
        ...data,
        // @ts-ignore
        coins: data.coins?.map((coin) => ({
          ...coin,
          name: camelToConstant(coin.name),
        })),
      } as GetRecordsReturnType<{
        name: string
        records: TParams['records']
        resolver: TParams['resolver']
      }>
    },
  })

  return {
    ...query,
    isCachedData: query.status === 'success' && query.isFetched && !query.isFetchedAfterMount,
  }
}
