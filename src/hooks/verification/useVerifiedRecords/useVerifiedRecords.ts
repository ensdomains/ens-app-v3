import { QueryFunctionContext } from '@tanstack/react-query'
import { match } from 'ts-pattern'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import type { VerificationProtocol } from '@app/transaction-flow/input/VerifyProfile/VerifyProfile-flow'
import { CreateQueryKey, QueryConfig } from '@app/types'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'
import { useQuery } from '@app/utils/query/useQuery'

import { createGetVerificationProps } from './utils/createGetVerificationProps'
import { fetchDentityVPToken } from './utils/fetchDentityVPToken'
import { parseVerificationRecord } from './utils/parseVerificationRecord'

type UseVerifiedRecordsParameters = {
  name?: string
  address?: string
  verificationsRecord?: string
}

export type VerifiedRecord = {
  verifier: VerificationProtocol
  isVerified: boolean
  isNameVerified: boolean
  isAddressVerified: boolean
  verifiedRecords: {
    [key: string]: string
  }
}

export type UseVerifiedRecordsReturnType = VerifiedRecord[]

type UseVerifiedRecordsConfig = QueryConfig<UseVerifiedRecordsReturnType, Error>

type QueryKey<TParams extends UseVerifiedRecordsParameters> = CreateQueryKey<
  TParams,
  'getVerifiedRecords',
  'independent'
>

export const getVerifiedRecords = async <TParams extends UseVerifiedRecordsParameters>({
  queryKey: [{ name, address, verificationsRecord }],
}: QueryFunctionContext<QueryKey<TParams>>): Promise<UseVerifiedRecordsReturnType> => {
  const protocolAndTokenTuples = parseVerificationRecord(verificationsRecord)

  return Promise.all(
    protocolAndTokenTuples.map(([verifier, token]) =>
      match(verifier)
        .with('dentity', () =>
          fetchDentityVPToken({ federatedToken: token, address: address!, name: name! }),
        )
        .exhaustive(),
    ),
  )
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
