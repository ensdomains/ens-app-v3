import { QueryFunctionContext } from '@tanstack/react-query'
import { CallParameters, SendTransactionReturnType } from '@wagmi/core'
import { Dispatch } from 'react'
import {
  Address,
  BlockTag,
  Hash,
  Hex,
  PrepareTransactionRequestRequest,
  toHex,
  Transaction,
  TransactionRequest,
} from 'viem'
import { call, estimateGas, getTransaction, prepareTransactionRequest } from 'viem/actions'

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
import { getReadableError } from '@app/utils/errors'
import { CheckIsSafeAppReturnType } from '@app/utils/safe'

type AccessListResponse = {
  accessList: {
    address: Address
    storageKeys: Hex[]
  }[]
  gasUsed: Hex
}

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
    request: PrepareTransactionRequestRequest<SupportedChain> | undefined
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
  transactionName === 'registerName' ? gasLimit + 5000n : gasLimit

export const calculateGasLimit = async ({
  client,
  connectorClient,
  isSafeApp,
  txWithZeroGas,
  transactionName,
}: {
  client: ClientWithEns
  connectorClient: ConnectorClientWithEns
  isSafeApp: boolean
  txWithZeroGas: BasicTransactionRequest
  transactionName: TransactionName
}) => {
  if (isSafeApp) {
    const accessListResponse = await client.request<{
      Method: 'eth_createAccessList'
      Parameters: [tx: TransactionRequest<Hex>, blockTag: BlockTag]
      ReturnType: AccessListResponse
    }>({
      method: 'eth_createAccessList',
      params: [
        {
          to: txWithZeroGas.to,
          data: txWithZeroGas.data,
          from: connectorClient.account!.address,
          value: toHex(txWithZeroGas.value ? txWithZeroGas.value + 1000000n : 0n),
        },
        'latest',
      ],
    })

    return {
      gasLimit: registrationGasFeeModifier(BigInt(accessListResponse.gasUsed), transactionName),
      accessList: accessListResponse.accessList,
    }
  }

  const gasEstimate = await estimateGas(client, {
    ...txWithZeroGas,
    account: connectorClient.account!,
  })
  return {
    gasLimit: registrationGasFeeModifier(gasEstimate, transactionName),
    accessList: undefined,
  }
}

type CreateTransactionRequestQueryKey = CreateQueryKey<
  UniqueTransaction,
  'createTransactionRequest',
  'standard'
>

export const createTransactionRequestQueryFn =
  (config: ConfigWithEns) =>
  ({
    connectorClient,
    isSafeApp,
  }: {
    connectorClient: ConnectorClientWithEns | undefined
    isSafeApp: CheckIsSafeAppReturnType | undefined
  }) =>
  async ({
    queryKey: [params, chainId, address],
  }: QueryFunctionContext<CreateTransactionRequestQueryKey>) => {
    const client = config.getClient({ chainId })

    if (!connectorClient) throw new Error('connectorClient is required')
    if (connectorClient.account.address !== address)
      throw new Error('address does not match connector')

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
      isSafeApp: !!isSafeApp,
      txWithZeroGas,
      transactionName: params.name,
    })

    const request = await prepareTransactionRequest(client, {
      to: transactionRequest.to,
      accessList,
      account: connectorClient.account,
      data: transactionRequest.data,
      gas: gasLimit,
      parameters: ['fees', 'nonce', 'type'],
      ...('value' in transactionRequest ? { value: transactionRequest.value } : {}),
    })

    return {
      ...request,
      chain: request.chain!,
      to: request.to!,
      gas: request.gas!,
      chainId,
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
      return 'transaction.dialog.error.gasLimit'
    } catch (err: unknown) {
      return getReadableError(err)
    }
  }
