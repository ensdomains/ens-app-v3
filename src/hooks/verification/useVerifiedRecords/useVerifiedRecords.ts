import { QueryFunctionContext } from '@tanstack/react-query'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { CreateQueryKey, QueryConfig } from '@app/types'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'
import { useQuery } from '@app/utils/query/useQuery'

import { createGetVerificationProps } from './utils/createGetVerificationProps'
import {
  parseVerificationData,
  VerifiedRecord,
} from './utils/parseVerificationData/parseVerificationData'

type UseVerifiedRecordsParameters = {
  name?: string
  address?: string
  verificationsRecord?: string
}

export type UseVerifiedRecordsReturnType = VerifiedRecord[]

type UseVerifiedRecordsConfig = QueryConfig<UseVerifiedRecordsReturnType, Error>

type QueryKey<TParams extends UseVerifiedRecordsParameters> = CreateQueryKey<
  TParams,
  'getVerifiedRecords',
  'independent'
>

export const getVerifiedRecords = async <TParams extends UseVerifiedRecordsParameters>({
  queryKey: [{ verificationsRecord }],
}: QueryFunctionContext<QueryKey<TParams>>): Promise<UseVerifiedRecordsReturnType> => {
  const verifiablePresentationUris = JSON.parse(verificationsRecord!) as string[]
  const responses = await Promise.allSettled(
    verifiablePresentationUris.map((uri) => fetch(uri).then((resp) => resp.json())),
  )
  return Promise.all(
    responses
      .filter(
        (response): response is PromiseFulfilledResult<any> => response.status === 'fulfilled',
      )
      .map(({ value }) => value)
      .map(parseVerificationData),
  ).then((records) => records.flat())
}

export const useVerifiedRecords = <TParams extends UseVerifiedRecordsParameters>({
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  ...params
}: TParams & UseVerifiedRecordsConfig) => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getVerifiedRecords',
    queryDependencyType: 'independent',
    queryFn: getVerifiedRecords,
  })
  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    enabled: enabled && !!params.name && !!params.address && !!params.verificationsRecord,
    gcTime,
    staleTime,
  })

  const query = useQuery(preparedOptions)

  return {
    ...query,
    getVerficationProps: createGetVerificationProps(query.data),
    refetchIfEnabled: preparedOptions.enabled ? query.refetch : () => {},
    isCachedData: getIsCachedData(query),
  }
}
