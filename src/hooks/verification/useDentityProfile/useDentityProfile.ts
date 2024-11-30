import { QueryFunctionContext, useQuery } from '@tanstack/react-query'
import { Hash } from 'viem'

import { getName, getOwner, getRecords } from '@ensdomains/ensjs/public'

import { VERIFICATION_RECORD_KEY } from '@app/constants/verification'
import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { VerificationProtocol } from '@app/transaction-flow/input/VerifyProfile/VerifyProfile-flow'
import { ConfigWithEns, CreateQueryKey, QueryConfig } from '@app/types'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'

import { type DentityFederatedToken } from '../useDentityToken/useDentityToken'

type UseVerificationOAuthParameters = {
  token?: DentityFederatedToken
}

export type UseDentityProfileReturnType = {
  verifier: VerificationProtocol
  name?: string
  owner?: Hash | null
  manager?: Hash
  primaryName?: string
  address?: Hash
  resolverAddress?: Hash
  verifiedPresentationUri?: string
  verificationRecord?: string
}

type UseVerificationOAuthConfig = QueryConfig<UseDentityProfileReturnType, Error>

type QueryKey<TParams extends UseVerificationOAuthParameters> = CreateQueryKey<
  TParams,
  'getVerificationOAuth',
  'standard'
>

export const getDentityProfile =
  (config: ConfigWithEns) =>
  async <TParams extends UseVerificationOAuthParameters>({
    queryKey: [{ token }, chainId],
  }: QueryFunctionContext<QueryKey<TParams>>): Promise<UseDentityProfileReturnType> => {
    if (!token || !token.name || !token.verifiedPresentationUri) {
      return {
        verifier: 'dentity',
        ...token,
      }
    }

    const { name } = token

    // Get resolver address since it will be needed for setting verification record
    const client = config.getClient({ chainId })
    const records = await getRecords(client, { name, texts: [VERIFICATION_RECORD_KEY] })
    // Get owner data to
    const ownerData = await getOwner(client, { name })
    const { owner, registrant, ownershipLevel } = ownerData || {}
    const _owner = ownershipLevel === 'registrar' ? registrant : owner
    const manager = ownershipLevel === 'registrar' ? owner : undefined
    const userWithSetRecordAbility = manager ?? _owner
    const primaryName = userWithSetRecordAbility
      ? await getName(client, { address: userWithSetRecordAbility })
      : undefined
    const data = {
      ...token,
      verifier: 'dentity' as const,
      owner: _owner,
      manager,
      primaryName: primaryName?.name,
      resolverAddress: records.resolverAddress,
      verificationRecord: records.texts.find((text) => text.key === VERIFICATION_RECORD_KEY)?.value,
    }
    return data
  }

export const useDentityProfile = <TParams extends UseVerificationOAuthParameters>({
  enabled = true,
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
    queryFn: getDentityProfile,
  })

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    enabled: enabled && !!params.token,
    gcTime,
    staleTime,
    retry: 0,
  })

  const query = useQuery(preparedOptions)

  return query
}
