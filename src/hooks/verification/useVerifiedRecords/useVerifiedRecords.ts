import { QueryFunctionContext } from '@tanstack/react-query'
import { Hash } from 'viem'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { CreateQueryKey, QueryConfig } from '@app/types'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'
import { useQuery } from '@app/utils/query/useQuery'

import { makeAppendVerificationProps } from './utils/makeAppendVerificationProps'
import {
  parseVerificationData,
  VerifiedRecord,
} from './utils/parseVerificationData/parseVerificationData'

type UseVerifiedRecordsParameters = {
  verificationsRecord?: string
  ownerAddress?: Hash
  name?: string
}

export type UseVerifiedRecordsReturnType = VerifiedRecord[]

type UseVerifiedRecordsConfig = QueryConfig<UseVerifiedRecordsReturnType, Error>

type QueryKey<TParams extends UseVerifiedRecordsParameters> = CreateQueryKey<
  TParams,
  'getVerifiedRecords',
  'independent'
>

const isStringArray = (object: unknown): object is string[] =>
  Array.isArray(object) && object.every((item) => typeof item === 'string')

export const parseVerificationRecord = (verificationRecord?: string): string[] => {
  try {
    if (!verificationRecord) return []
    const json = JSON.parse(verificationRecord)
    if (isStringArray(json)) return json
    return []
  } catch {
    return []
  }
}

export const getVerifiedRecords = async <TParams extends UseVerifiedRecordsParameters>({
  queryKey: [{ verificationsRecord, ownerAddress, name }],
}: QueryFunctionContext<QueryKey<TParams>>): Promise<UseVerifiedRecordsReturnType> => {
  const verifiablePresentationUris = parseVerificationRecord(verificationsRecord)
  const responses = await Promise.allSettled(
    verifiablePresentationUris.map((uri) => fetch(uri).then((resp) => resp.json())),
  )
  return Promise.all(
    responses
      .filter(
        (response): response is PromiseFulfilledResult<any> => response.status === 'fulfilled',
      )
      .map(({ value }) => value)
      .map(parseVerificationData({ ownerAddress, name })),
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
    enabled: enabled && !!params.verificationsRecord && !!params.ownerAddress && !!params.name,
    gcTime,
    staleTime,
  })

  const query = useQuery(preparedOptions)

  return {
    ...query,
    appendVerificationProps: makeAppendVerificationProps(query.data),
    refetchIfEnabled: preparedOptions.enabled ? query.refetch : () => {},
    isCachedData: getIsCachedData(query),
  }
}
