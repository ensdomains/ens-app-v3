import { useMutation, useQuery, useQueryClient } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { useAccountSafely } from './useAccountSafely'
import { useChainId } from './useChainId'

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

const ENDPOINT =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8787/'
    : 'https://ens-faucet.ens-cf.workers.dev/'

const useFaucet = () => {
  const queryClient = useQueryClient()
  const { address } = useAccountSafely()
  const chainId = useChainId()
  const { data, error, isLoading } = useQuery(
    useQueryKeys().faucet(address),
    async () => {
      const result: JsonRpc<{ eligible: boolean; next: number; status: FaucetStatus }> =
        await fetch(ENDPOINT, {
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
      enabled: !!address && chainId === 5,
    },
  )

  const mutation = useMutation(
    async () => {
      const result: JsonRpc<{ id: string }> = await fetch(ENDPOINT, {
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
        queryClient.resetQueries(['getFaucetEligibility', address])
      },
    },
  )

  return {
    data,
    error,
    isLoading,
    mutation,
  }
}

export default useFaucet
