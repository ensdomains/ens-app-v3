import {
  QueryFunctionContext,
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useEffect } from 'react'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { ConfigWithEns, CreateQueryKey } from '@app/types'
import { FAUCET_WORKER_URL } from '@app/utils/constants'
import { getChainName } from '@app/utils/getChainName'
import { useQuery } from '@app/utils/query/useQuery'

import { useAccountSafely } from './account/useAccountSafely'
import { useChainName } from './chain/useChainName'

type BaseJsonRPC<Result> = {
  jsonrpc: string
  id: string | number | null
  result?: Result
  error?: any
}

type ErrorJsonRPC = {
  result?: never
  error: {
    code: number
    message: string
  }
}

type SuccessJsonRPC<Result> = {
  result: Result
  error?: never
}

type FaucetStatus = 'ok' | 'paused' | 'out of funds'

type JsonRpc<Result = any> = BaseJsonRPC<Result> & (ErrorJsonRPC | SuccessJsonRPC<Result>)

const createEndpoint = (chainName: string) =>
  process.env.NODE_ENV === 'development'
    ? `http://localhost:8787/${chainName}`
    : `${FAUCET_WORKER_URL}/${chainName}`

type QueryKey = CreateQueryKey<{}, 'getFaucetAddress', 'standard'>

const getFaucetQueryFn =
  (config: ConfigWithEns) =>
  async ({ queryKey: [, chainId, address] }: QueryFunctionContext<QueryKey>) => {
    if (!address) throw new Error('address is required')

    const chainName = getChainName(config, { chainId })

    const result: JsonRpc<{
      eligible: boolean
      amount: `0x${string}`
      interval: number
      next: number
      status: FaucetStatus
    }> = await fetch(createEndpoint(chainName), {
      method: 'POST',
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'faucet_getAddress',
        params: [address],
        id: 1,
      }),
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json())

    if (result.error) throw new Error(result.error.message)

    return result.result
  }

const useFaucet = () => {
  const queryClient = useQueryClient()

  const chainName = useChainName()
  const { address } = useAccountSafely()

  const initialOptions = useQueryOptions({
    params: {},
    functionName: 'getFaucetAddress',
    queryDependencyType: 'standard',
    queryFn: getFaucetQueryFn,
  })

  const preparedOptions = queryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
  })

  const { data, error, isLoading } = useQuery({
    ...preparedOptions,
    enabled: !!address && (chainName === 'goerli' || chainName === 'sepolia'),
  })

  const mutation = useMutation({
    mutationFn: async () => {
      const result: JsonRpc<{ id: string }> = await fetch(createEndpoint(chainName), {
        method: 'POST',
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'faucet_request',
          params: [address],
          id: 1,
        }),
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json())

      if (result.error) throw new Error(result.error.message)

      return result.result
    },
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: preparedOptions.queryKey })
    },
  })

  useEffect(() => {
    mutation.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainName, address])

  return {
    data,
    error,
    isLoading,
    mutation,
  }
}

export default useFaucet
