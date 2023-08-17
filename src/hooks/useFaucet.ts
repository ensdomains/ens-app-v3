import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'
import { FAUCET_WORKER_URL } from '@app/utils/constants'

import { useAccountSafely } from './useAccountSafely'
import { useChainName } from './useChainName'

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

const useFaucet = () => {
  const queryClient = useQueryClient()

  const { address } = useAccountSafely()
  const chainName = useChainName()
  const queryKey = useQueryKeys().faucet(address)

  const { data, error, isLoading } = useQuery(
    queryKey,
    async () => {
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
    },
    {
      enabled: !!address && (chainName === 'goerli' || chainName === 'sepolia'),
    },
  )

  const mutation = useMutation(
    async () => {
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
    {
      onSuccess: () => {
        queryClient.resetQueries(queryKey)
      },
    },
  )

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
