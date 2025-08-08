import { QueryFunctionContext } from '@tanstack/react-query'
import { CallParameters, getFeeHistory, SendTransactionReturnType } from '@wagmi/core'
import { Dispatch } from 'react'
import { Hash, PrepareTransactionRequestRequest, toHex, Transaction } from 'viem'
import { call, estimateGas, getTransaction, prepareTransactionRequest } from 'viem/actions'
import { useConnections } from 'wagmi'

import { SupportedChain } from '@app/constants/chains'
import { TransactionStatus } from '@app/hooks/transactions/transactionStore'
import { useAddRecentTransaction } from '@app/hooks/transactions/useAddRecentTransaction'
import { useIsSafeApp } from '@app/hooks/useIsSafeApp'
import { createTransactionRequest, TransactionName } from '@app/transaction-flow/transaction'
import {
  GetUniqueTransactionParameters,
  ManagedDialogProps,
  TransactionFlowAction,
  UniqueTransaction,
} from '@app/transaction-flow/types'
import {
  BasicTransactionRequest,
  ClientWithEns,
  ConfigWithEns,
  ConnectorClientWithEns,
  CreateQueryKey,
} from '@app/types'
import { CURRENCY_FLUCTUATION_BUFFER_PERCENTAGE } from '@app/utils/constants'
import { getReadableError } from '@app/utils/errors'
import { createAccessList } from '@app/utils/query/createAccessList'
import { wagmiConfig } from '@app/utils/query/wagmi'
import { connectorIsMetaMask, connectorIsPhantom, hasParaConnection } from '@app/utils/utils'

export const getUniqueTransaction = ({
  txKey,
  currentStep,
  transaction,
}: GetUniqueTransactionParameters): UniqueTransaction => ({
  key: txKey!,
  step: currentStep,
  name: transaction.name,
  data: transaction.data,
})

export const transactionSuccessHandler =
  ({
    client,
    connectorClient,
    actionName,
    txKey,
    request,
    addRecentTransaction,
    dispatch,
    isSafeApp,
  }: {
    client: ClientWithEns
    connectorClient: ConnectorClientWithEns
    actionName: ManagedDialogProps['actionName']
    txKey: string | null
    request: PrepareTransactionRequestRequest<SupportedChain> | null | undefined
    addRecentTransaction: ReturnType<typeof useAddRecentTransaction>
    dispatch: Dispatch<TransactionFlowAction>
    isSafeApp: ReturnType<typeof useIsSafeApp>['data']
  }) =>
  async (tx: SendTransactionReturnType) => {
    let transactionData: Transaction | null = null
    try {
      // If using private mempool, this won't error, will return null
      transactionData = await connectorClient.request<{
        Method: 'eth_getTransactionByHash'
        Parameters: [hash: Hash]
        ReturnType: Transaction | null
      }>({ method: 'eth_getTransactionByHash', params: [tx] })
    } catch (e) {
      // this is expected to fail in most cases
    }

    if (!transactionData) {
      try {
        transactionData = await client.request({
          method: 'eth_getTransactionByHash',
          params: [tx],
        })
      } catch (e) {
        console.error('Failed to get transaction info')
      }
    }

    addRecentTransaction({
      ...transactionData,
      hash: tx,
      action: actionName,
      key: txKey!,
      input: request?.data,
      timestamp: Math.floor(Date.now() / 1000),
      isSafeTx: !!isSafeApp,
      searchRetries: 0,
    })
    dispatch({ name: 'setTransactionHash', payload: { hash: tx, key: txKey! } })
  }

export const registrationGasFeeModifier = (gasLimit: bigint, transactionName: TransactionName) =>
  // this addition is arbitrary, something to do with a gas refund but not 100% sure
  transactionName === 'registerName'
    ? gasLimit + 5000n
    : (gasLimit * CURRENCY_FLUCTUATION_BUFFER_PERCENTAGE) / 100n

export const calculateGasLimit = async ({
  client,
  connectorClient,
  txWithZeroGas,
  transactionName,
}: {
  client: ClientWithEns
  connectorClient: ConnectorClientWithEns
  txWithZeroGas: BasicTransactionRequest
  transactionName: TransactionName
}) => {
  const accessListResponse = await createAccessList(client, {
    to: txWithZeroGas.to,
    data: txWithZeroGas.data,
    from: connectorClient.account!.address,
    value: toHex(txWithZeroGas.value ? txWithZeroGas.value + 1000000n : 0n),
  })

  const gasEstimate = await estimateGas(client, {
    ...txWithZeroGas,
    accessList: accessListResponse.accessList,
    account: connectorClient.account,
  })

  return {
    gasLimit: registrationGasFeeModifier(gasEstimate, transactionName),
    accessList: accessListResponse.accessList,
  }
}

const defaultMaxPriorityFeePerGas = 5000000000n
export const getLargestMedianGasFee = async () => {
  let feeHistory
  try {
    feeHistory = await getFeeHistory(wagmiConfig, {
      blockCount: 5,
      rewardPercentiles: [50],
    })
  } catch (e) {
    console.error('Failed to get fee history')
    return defaultMaxPriorityFeePerGas
  }

  if (!feeHistory.reward || feeHistory.reward.length === 0) return defaultMaxPriorityFeePerGas

  const maxPriorityFeePerGas = feeHistory.reward
    .map((block) => block[0])
    .reduce((max, fee) => (fee > max ? fee : max), BigInt(0))

  return maxPriorityFeePerGas
}

export type CreateTransactionRequestQueryKey = CreateQueryKey<
  UniqueTransaction,
  'createTransactionRequest',
  'standard'
>

type CreateTransactionRequestUnsafeParameters = {
  client: ClientWithEns
  connectorClient: ConnectorClientWithEns
  params: UniqueTransaction
  chainId: SupportedChain['id']
  connections: any
}

export const createTransactionRequestUnsafe = async ({
  client,
  connectorClient,
  params,
  chainId,
  connections,
}: CreateTransactionRequestUnsafeParameters) => {
  const transactionRequest = await createTransactionRequest({
    name: params.name,
    data: params.data,
    connectorClient,
    client,
  })

  const txWithZeroGas = {
    ...transactionRequest,
    maxFeePerGas: 0n,
    maxPriorityFeePerGas: 0n,
  }

  const { gasLimit, accessList } = await calculateGasLimit({
    client,
    connectorClient,
    txWithZeroGas,
    transactionName: params.name,
  })

  const isParaConnected = hasParaConnection(connections)

  let largestMedianGasFee = 0n
  if (isParaConnected) {
    largestMedianGasFee = await getLargestMedianGasFee()
  }

  const request = await prepareTransactionRequest(client, {
    to: transactionRequest.to,
    accessList,
    account: connectorClient.account,
    data: transactionRequest.data,
    gas: gasLimit,
    parameters: ['fees', 'nonce', 'type'],
    ...('value' in transactionRequest ? { value: transactionRequest.value } : {}),
    ...(isParaConnected ? { maxPriorityFeePerGas: largestMedianGasFee } : {}),
  })

  if (connectorIsMetaMask(connections, connectorClient)) {
    ;(request as any).__is_metamask = true
  } else if (connectorIsPhantom(connections, connectorClient)) {
    request.accessList = request.accessList?.map((v) => [v.address, v.storageKeys]) as any
  }

  return {
    ...request,
    chain: request.chain!,
    to: request.to!,
    gas: request.gas!,
    chainId,
  }
}

export const createTransactionRequestQueryFn =
  (config: ConfigWithEns) =>
  ({
    connectorClient,
    connections,
  }: {
    connectorClient: ConnectorClientWithEns | undefined
    connections: ReturnType<typeof useConnections>
  }) =>
  async ({
    queryKey: [params, chainId, address],
  }: QueryFunctionContext<CreateTransactionRequestQueryKey>) => {
    const client = config.getClient({ chainId })

    if (!connectorClient) throw new Error('connectorClient is required')
    if (connectorClient.account.address !== address)
      throw new Error('address does not match connector')

    try {
      return {
        data: await createTransactionRequestUnsafe({
          client,
          connectorClient,
          params,
          chainId,
          connections,
        }),
        error: null,
      }
    } catch (e) {
      return {
        data: null,
        error: e as Error,
      }
    }
  }

type GetTransactionErrorQueryKey = CreateQueryKey<
  { hash: Hash | undefined; status: Exclude<TransactionStatus, 'unknown'> | undefined },
  'getTransactionError',
  'standard'
>

export const getTransactionErrorQueryFn =
  (config: ConfigWithEns) =>
  async ({
    queryKey: [{ hash, status }, chainId],
  }: QueryFunctionContext<GetTransactionErrorQueryKey>) => {
    if (!hash || status !== 'failed') return null
    const client = config.getClient({ chainId })
    const failedTransactionData = await getTransaction(client, { hash })
    try {
      await call(client, failedTransactionData as CallParameters<ConfigWithEns>)
      // TODO: better errors for this
      return {
        message: 'transaction.dialog.error.gasLimit',
        type: 'unknown',
      }
    } catch (err: unknown) {
      return getReadableError(err)
    }
  }
