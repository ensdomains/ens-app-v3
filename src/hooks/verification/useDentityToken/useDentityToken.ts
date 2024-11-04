import { QueryFunctionContext, useQuery } from '@tanstack/react-query'

import { VERIFICATION_OAUTH_BASE_URL } from '@app/constants/verification'
import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { CreateQueryKey, QueryConfig } from '@app/types'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'

export type DentityFederatedToken = {
  name: string
  verifiedPresentationUri: string
}

type UseDentityTokenParameters = {
  code?: string | null
}

export type UseDentityTokenReturnType = DentityFederatedToken

type UseVerificationOAuthConfig = QueryConfig<UseDentityTokenReturnType, Error>

type QueryKey<TParams extends UseDentityTokenParameters> = CreateQueryKey<
  TParams,
  'getDentityToken',
  'independent'
>

export const getDentityToken = async <TParams extends UseDentityTokenParameters>({
  queryKey: [{ code }],
}: QueryFunctionContext<QueryKey<TParams>>): Promise<UseDentityTokenReturnType> => {
  // Get federated token from oidc worker
  const url = `${VERIFICATION_OAUTH_BASE_URL}/dentity/token`
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ code }),
  })
  const json = await response.json()

  return json as UseDentityTokenReturnType
}

export const useDentityToken = <TParams extends UseDentityTokenParameters>({
  enabled = true,
  gcTime,
  scopeKey,
  ...params
}: TParams & UseVerificationOAuthConfig) => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getDentityToken',
    queryDependencyType: 'independent',
    queryFn: getDentityToken,
  })

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    enabled: enabled && !!params.code,
    gcTime,
    staleTime: Infinity,
    retry: 0,
  })

  const query = useQuery(preparedOptions)

  return query
}
