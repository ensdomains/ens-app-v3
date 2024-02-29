import { QueryFunctionContext, queryOptions, useQuery } from '@tanstack/react-query'
import { labelhash } from 'viem'

import { createSubgraphClient } from '@ensdomains/ensjs/subgraph'

import { ConfigWithEns, CreateQueryKey, QueryConfig } from '@app/types'
import { checkETH2LDFromName } from '@app/utils/utils'

import { useQueryOptions } from './useQueryOptions'

type UseRegistrationDataParameters = {
  name?: string | undefined | null
}

type UseRegistrationDataReturnType = {
  registrationDate: Date
  transactionHash: string
} | null

type UseRegistrationDataConfig = QueryConfig<UseRegistrationDataReturnType, Error>

type QueryKey<TParams extends UseRegistrationDataParameters> = CreateQueryKey<
  TParams,
  'getRegistrationData',
  'graph'
>

const gqlQuery = `
  query getNameDates($id: String!) {
    registration(id: $id) {
      registrationDate
    }
    nameRegistereds(first: 1, orderBy: blockNumber, orderDirection: desc, where: { registration: $id }) {
      transactionID
    }
  }
`

export const getRegistrationDataQueryFn =
  (config: ConfigWithEns) =>
  async <TParams extends UseRegistrationDataParameters>({
    queryKey: [{ name }, chainId],
  }: QueryFunctionContext<QueryKey<TParams>>) => {
    if (!name) throw new Error('name is required')

    const client = config.getClient({ chainId })
    const subgraphClient = createSubgraphClient({ client })

    const result = await subgraphClient.request<{
      registration?: {
        registrationDate: string
      }
      nameRegistereds: {
        transactionID: string
      }[]
    }>(gqlQuery, {
      id: labelhash(name.split('.')[0]),
    })

    if (!result.registration) return null

    return {
      registrationDate: new Date(parseInt(result.registration.registrationDate) * 1000),
      transactionHash: result.nameRegistereds[0]?.transactionID,
    }
  }

const useRegistrationData = <TParams extends UseRegistrationDataParameters>({
  // config
  gcTime = 1_000 * 60 * 60 * 24,
  enabled = true,
  staleTime,
  scopeKey,

  // params
  ...params
}: TParams & UseRegistrationDataConfig) => {
  const initialOptions = useQueryOptions({
    params,
    functionName: 'getRegistrationData',
    queryDependencyType: 'graph',
    queryFn: getRegistrationDataQueryFn,
  })

  const preparedOptions = queryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
  })

  const query = useQuery({
    ...preparedOptions,
    enabled: enabled && !!params.name && checkETH2LDFromName(params.name),
    gcTime,
    staleTime,
    select: (data) => {
      if (!data) return data
      return {
        registrationDate: new Date(data.registrationDate),
        transactionHash: data.transactionHash,
      }
    },
  })

  return {
    ...query,
    isCachedData: query.status === 'success' && query.isFetched && !query.isFetchedAfterMount,
  }
}

export default useRegistrationData
