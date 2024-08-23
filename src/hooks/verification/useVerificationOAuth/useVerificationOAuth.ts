import { QueryFunctionContext, useQuery } from '@tanstack/react-query'
import { Hash } from 'viem'

import { getOwner, getRecords } from '@ensdomains/ensjs/public'

import { VERIFICATION_RECORD_KEY } from '@app/constants/verification'
import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { VerificationProtocol } from '@app/transaction-flow/input/VerifyProfile/VerifyProfile-flow'
import { ConfigWithEns, CreateQueryKey, QueryConfig } from '@app/types'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'

import { getAPIEndpointForVerifier } from './utils/getAPIEndpointForVerifier'

type UseVerificationOAuthParameters = {
  verifier?: VerificationProtocol | null
  code?: string | null
  onSuccess?: (resp: UseVerificationOAuthReturnType) => void
}

export type UseVerificationOAuthReturnType = {
  verifier: VerificationProtocol
  name: string
  owner: Hash
  manager?: Hash
  address: Hash
  resolverAddress: Hash
  verifiedPresentationUri: string
  verificationRecord?: string
}

type UseVerificationOAuthConfig = QueryConfig<UseVerificationOAuthReturnType, Error>

type QueryKey<TParams extends UseVerificationOAuthParameters> = CreateQueryKey<
  TParams,
  'getVerificationOAuth',
  'standard'
>

export const getVerificationOAuth =
  (config: ConfigWithEns) =>
  async <TParams extends UseVerificationOAuthParameters>({
    queryKey: [{ verifier, code }, chainId],
  }: QueryFunctionContext<QueryKey<TParams>>): Promise<UseVerificationOAuthReturnType> => {
    // Get federated token from oidc worker
    const url = getAPIEndpointForVerifier(verifier)
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ code }),
    })
    const json = await response.json()

    const { name } = json as UseVerificationOAuthReturnType

    if (!name)
      return {
        verifier,
        ...json,
      }

    // Get resolver address since it will be needed for setting verification record
    const client = config.getClient({ chainId })
    const records = await getRecords(client, { name, texts: [VERIFICATION_RECORD_KEY] })

    // Get owner data to
    const ownerData = await getOwner(client, { name })
    const { owner, registrant, ownershipLevel } = ownerData || {}

    const _owner = ownershipLevel === 'registrar' ? registrant : owner
    const manager = ownershipLevel === 'registrar' ? owner : undefined

    const data = {
      ...json,
      verifier,
      owner: _owner,
      manager,
      resolverAddress: records.resolverAddress,
      verificationRecord: records.texts.find((text) => text.key === VERIFICATION_RECORD_KEY)?.value,
    }
    return data
  }

export const useVerificationOAuth = <TParams extends UseVerificationOAuthParameters>({
  enabled = true,
  onSuccess,
  gcTime,
  staleTime,
  scopeKey,
  ...params
}: TParams & UseVerificationOAuthConfig) => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getVerificationOAuth',
    queryDependencyType: 'standard',
    queryFn: getVerificationOAuth,
  })

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    enabled: enabled && !!params.verifier && !!params.code,
    gcTime,
    staleTime,
    retry: 0,
  })

  const query = useQuery(preparedOptions)

  return query
}
