import { QueryFunctionContext, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { useQueryKeyFactory } from '@app/hooks/useQueryKeyFactory'
import { CreateQueryKey } from '@app/types'
import { FAUCET_WORKER_URL } from '@app/utils/constants'

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

type QueryKey = CreateQueryKey<{ chainName: string }, 'getFaucetAddress', 'standard'>

const getFaucetQueryFn = async ({
  queryKey: [{ chainName }, , address],
}: QueryFunctionContext<QueryKey>) => {
  if (!address) throw new Error('address is required')

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

  const queryKey = useQueryKeyFactory({
    params: { chainName },
    functionName: 'getFaucetAddress',
    queryDependencyType: 'standard',
  })

  const { data, error, isLoading } = useQuery({
    queryKey,
    queryFn: getFaucetQueryFn,
    enabled: !!address && (chainName === 'goerli' || chainName === 'sepolia'),
  })
  //   const queryKey = useQueryKeys().faucet(address)

  //   const { data, error, isLoading } = useQuery(
  //     queryKey,
  //     async () => {
  //       const result: JsonRpc<{
  //         eligible: boolean
  //         amount: `0x${string}`
  //         interval: number
  //         next: number
  //         status: FaucetStatus
  //       }> = await fetch(createEndpoint(chainName), {
  //         method: 'POST',
  //         body: JSON.stringify({
  //           jsonrpc: '2.0',
  //           method: 'faucet_getAddress',
  //           params: [address],
  //           id: 1,
  //         }),
  //         headers: {
  //           // eslint-disable-next-line @typescript-eslint/naming-convention
  //           'Content-Type': 'application/json',
  //         },
  //       }).then((res) => res.json())

  //       if (result.error) throw new Error(result.error.message)

  //       return result.result
  //     },
  //     {
  //       enabled: !!address && (chainName === 'goerli' || chainName === 'sepolia'),
  //     },
  //   )
  // >>>>>>> main

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
      queryClient.resetQueries(queryKey)
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
