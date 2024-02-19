import { QueryFunctionContext } from '@tanstack/react-query'
import { getPublicClient } from '@wagmi/core'
import { labelhash } from 'viem'
import { useQuery } from '@tanstack/react-query'

import { createSubgraphClient } from '@ensdomains/ensjs/subgraph'

import { CreateQueryKey, PublicClientWithChain, QueryConfig } from '@app/types'
import { checkETH2LDFromName } from '@app/utils/utils'

import { useQueryKeyFactory } from './useQueryKeyFactory'

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

export const getRegistrationDataQueryFn = async <TParams extends UseRegistrationDataParameters>({
  queryKey: [{ name }, chainId],
}: QueryFunctionContext<QueryKey<TParams>>) => {
  if (!name) throw new Error('name is required')

  const publicClient = getPublicClient<PublicClientWithChain>({ chainId })
  const subgraphClient = createSubgraphClient({ client: publicClient })

  return subgraphClient.request<{
    registration?: {
      registrationDate: string
    }
    nameRegistereds: {
      transactionID: string
    }[]
  }>(gqlQuery, {
    id: labelhash(name.split('.')[0]),
  })
}

const useRegistrationData = <TParams extends UseRegistrationDataParameters>({
  // config
  cacheTime = 60,
  enabled = true,
  staleTime,
  scopeKey,
  onError,
  onSettled,
  onSuccess,
  // params
  ...params
}: TParams & UseRegistrationDataConfig) => {
  const queryKey = useQueryKeyFactory({
    params,
    functionName: 'getRegistrationData',
    queryDependencyType: 'graph',
  })

  const query = useQuery(queryKey, getRegistrationDataQueryFn, {
    cacheTime,
    enabled: enabled && !!params.name && checkETH2LDFromName(params.name),
    staleTime,
    onError,
    onSettled,
    onSuccess,
    select: (data) => {
      if (!data?.registration) return null
      return {
        registrationDate: new Date(parseInt(data.registration.registrationDate) * 1000),
        transactionHash: data.nameRegistereds[0]?.transactionID,
      }
    },
  })

  return {
    ...query,
    isCachedData: query.status === 'success' && query.isFetched && !query.isFetchedAfterMount,
  }
}

export default useRegistrationData
