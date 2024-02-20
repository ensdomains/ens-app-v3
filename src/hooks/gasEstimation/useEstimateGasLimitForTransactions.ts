import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { formatEther, parseAccount } from 'viem/utils'

import {
  createTransactionRequest,
  TransactionData,
  TransactionName,
  TransactionParameters,
} from '@app/transaction-flow/transaction'
import { QueryConfig } from '@app/types'
import { fetchTenderlyEstimate } from '@app/utils/tenderly'

import { useWalletClientWithAccount } from '../account/useWalletClient'
import { useGasPrice } from '../chain/useGasPrice'
import { usePublicClient } from '../usePublicClient'
import { useQueryOptions } from '../useQueryOptions'

type UseEstimateGasLimitForTransactionParameters<TName extends TransactionName> = Omit<
  TransactionParameters<TName>,
  'publicClient' | 'walletClient'
> & {
  name: TName
}

type UseEstimateGasLimitForTransactionReturnType = { name: TransactionName; gasLimit: bigint }

type UseEstimateGasLimitForTransactionConfig = QueryConfig<
  UseEstimateGasLimitForTransactionReturnType,
  Error
>

type GetEstimateWithConfigParameters<TName extends TransactionName> =
  TransactionParameters<TName> & {
    name: TName
  }

export const fetchEstimateWithConfig = async <TName extends TransactionName>({
  publicClient,
  walletClient,
  data,
  name,
}: GetEstimateWithConfigParameters<TName>) => {
  const transactionRequest = await createTransactionRequest({
    publicClient,
    walletClient,
    data,
    name,
  })

  let gasLimit: bigint

  try {
    gasLimit = await publicClient.estimateGas({
      ...transactionRequest,
      account: walletClient.account,
    })
  } catch (e: unknown) {
    if (name !== 'extendNames') throw e
    const { names, duration } = data as TransactionData<'extendNames'>
    const fetchedEstimate = await fetchTenderlyEstimate({
      type: 'extension',
      networkId: publicClient.chain.id,
      labels: names.map((n) => n.split('.')[0]),
      duration,
      from: parseAccount(walletClient.account).address,
    })

    gasLimit = BigInt(fetchedEstimate)
  }

  return {
    name,
    gasLimit,
  }
}

export const useEstimateGasLimitForTransaction = <TName extends TransactionName>({
  // config
  gcTime = 60,
  enabled = true,
  staleTime,
  scopeKey,

  // params
  ...params
}: UseEstimateGasLimitForTransactionParameters<TName> &
  UseEstimateGasLimitForTransactionConfig) => {
  const publicClient = usePublicClient()
  const { data: walletClient, isLoading: isWalletClientLoading } = useWalletClientWithAccount()

  const { queryKey } = useQueryOptions({
    params,
    scopeKey,
    functionName: 'estimateGasLimitForTransaction',
    queryDependencyType: 'standard',
  })

  const { gasPrice, isLoading: isGasPriceLoading, isFetching: isGasPriceFetching } = useGasPrice()

  const { data, isLoading, isFetching, ...rest } = useQuery(
    queryKey,
    ({ queryKey: [innerParams] }) =>
      fetchEstimateWithConfig({ ...innerParams, publicClient, walletClient: walletClient! }),
    {
      gcTime,
      staleTime,

      enabled: enabled && !!walletClient && !isWalletClientLoading,
      select: (result) => ({
        ...result,
        gasLimit: BigInt(result.gasLimit),
      }),
    },
  )

  const { gasCost, gasCostEth } = useMemo(() => {
    if (!gasPrice || !data) {
      return {
        gasCost: 0n,
        gasCostEth: '0',
      }
    }

    const gasCost_ = gasPrice * data.gasLimit

    return {
      gasCost: gasCost_,
      gasCostEth: formatEther(gasCost_),
    }
  }, [gasPrice, data])

  return {
    gasLimit: data?.gasLimit,
    gasCost,
    gasCostEth,
    gasPrice,
    isLoading: isLoading || isGasPriceLoading || isWalletClientLoading,
    isFetching: isFetching || isGasPriceFetching,
    ...rest,
  }
}
