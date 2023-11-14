import { useMemo } from 'react'
import { formatEther, parseAccount } from 'viem/utils'
import { useQuery } from 'wagmi'

import {
  createTransactionRequest,
  TransactionData,
  TransactionItem,
  TransactionName,
  TransactionParameters,
} from '@app/transaction-flow/transaction'
import { fetchTenderlyEstimate } from '@app/utils/tenderly'

import { useWalletClientWithAccount } from '../account/useWalletClient'
import { useGasPrice } from '../chain/useGasPrice'
import { usePublicClient } from '../usePublicClient'
import { useQueryKeyFactory } from '../useQueryKeyFactory'

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
  transaction,
  enabled = true,
}: {
  transaction: TransactionItem<TName>
  enabled?: boolean
}) => {
  const publicClient = usePublicClient()
  const { data: walletClient, isLoading: isWalletClientLoading } = useWalletClientWithAccount()

  const queryKey = useQueryKeyFactory({
    params: transaction,
    functionName: 'estimateGasLimitForTransaction',
    queryDependencyType: 'standard',
  })

  const { gasPrice, isLoading: isGasPriceLoading, isFetching: isGasPriceFetching } = useGasPrice()

  const { data, isLoading, isFetching, ...rest } = useQuery(
    queryKey,
    ({ queryKey: [params] }) =>
      fetchEstimateWithConfig({ ...params, publicClient, walletClient: walletClient! }),
    {
      enabled: enabled && !!walletClient && !isWalletClientLoading,
      onError: console.error,
    },
  )

  const { gasCost, gasCostEth } = useMemo(() => {
    if (!gasPrice || !data) {
      return {
        gasCost: 0,
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
