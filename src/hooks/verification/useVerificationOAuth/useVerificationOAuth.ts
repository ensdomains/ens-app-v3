import { QueryFunctionContext, useQuery } from '@tanstack/react-query'
import { Hash } from 'viem'

import { getOwner, getRecords } from '@ensdomains/ensjs/public'

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
  token: string
  resolverAddress: Hash
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
    console.log('url', url)
    // if (!url || !code) throw new Error('Invalid verifier or code')
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ code }),
    })
    const json = await response.json()
    // const resp = {
    //   access_token: 'BHeX2mouwq6XmIU2OEIdZkS0qXeJT4KKm7tuAd31G18',
    //   expires_in: 86400,
    //   id_token:
    //     'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRQRmFnYnhObW1KM21zdHk2RXpuTmV1WGhpTE5LMGpmSlZhdlZDWXZtRWMifQ.eyJzdWIiOiI2NjhmOTE2MWI3ODdkYjczZmM1YWVjMGIiLCJmZWRlcmF0ZWRfdG9rZW4iOiIxNmI5OTEzMTEyMDFhZDExNTJjZWQzMjVhNWIwNjkxNGVmNjQ0MzVhODJiNjY4YmNkYmVhNzk4ZDYxMzQyOTAzIiwiZW5zX25hbWUiOiJkYXZpZGNodS5ldGgiLCJldGhfYWRkcmVzcyI6IjB4NTM4RTM1QjI4ODhlRDViYzU4Q2YyODI1RDc2Y2Y2MjY1YUE0ZTMxZSIsImF0X2hhc2giOiJjMk1DWU9GZ0xwSk9WS1N1YzhKR29RIiwiYXVkIjoiLUlHNXdrSHlldEZBZUR6aU5Va2R1IiwiZXhwIjoxNzIxOTMzMzI3LCJpYXQiOjE3MjE5Mjk3MjcsImlzcyI6Imh0dHBzOi8vb2lkYy5zdGFnaW5nLmRlbnRpdHkuY29tIn0.BVql_Kxoqm1zIdBBpQ7CTR5okdxojgunoUjfOH_SBfxRSYxXBOoGBl90fXW_YGRMnajlZsFPnXtRrkvocDW3HEeo2iGsXOO2Sbm1Ethi16vyn9CQ631TwawbRz7DhAG5egK0Fxlcw0aJwXXjFen70t9emM8j0fWF_HS1Flu7pEsri_a8z1Tr-LjeJZ4T43_yJgb4l4aL1InNu7sigPibgfSIleQ7hYpNNaLqSFbRnIoiy0Jpd8Ug2v_d-csqK3Stw2_Z_IZbNmVlwiDQc-Vh3ivsSpw8RGuMbnShpA9e1PiIZ1iq8hrKKt1wab-cBcJREADMacrEfF4duIlcx6NZbQ',
    //   scope: 'openid federated_token',
    //   token_type: 'Bearer',
    //   federated_token: '16b991311201ad1152ced325a5b06914ef64435a82b668bcdbea798d61342903',
    //   ens_name: 'davidchu.eth',
    //   eth_address: '0x538E35B2888eD5bc58Cf2825D76cf6265aA4e31e',
    // }

    // const json = {
    //   name: resp.ens_name,
    //   address: resp.eth_address,
    //   token: resp.federated_token,
    // }

    console.log('json', json)
    const { name } = json as UseVerificationOAuthReturnType
    console.log('name', name)

    // Get resolver address since it will be needed for setting verification record
    const client = config.getClient({ chainId })
    const records = await getRecords(client, { name })

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
