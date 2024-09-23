import { QueryFunctionContext } from '@tanstack/react-query'
import { CallParameters, SendTransactionReturnType } from '@wagmi/core'
import { Address, BlockTag, Hash, Hex, toHex, TransactionRequest } from 'viem'
import { call, estimateGas, getTransaction, prepareTransactionRequest } from 'viem/actions'
import type { SendTransactionVariables } from 'wagmi/query'

import { SupportedChain, type TargetChain } from '@app/constants/chains'
import type {
  GenericStoredTransaction,
  StoredTransactionIdentifiers,
  StoredTransactionStatus,
} from '@app/transaction/slices/createTransactionSlice'
import { useTransactionManager } from '@app/transaction/transactionManager'
import {
  createTransactionRequest,
  type UserTransactionData,
  type UserTransactionName,
} from '@app/transaction/user/transaction'
import {
  BasicTransactionRequest,
  ClientWithEns,
  ConfigWithEns,
  ConnectorClientWithEns,
  CreateQueryKey,
} from '@app/types'
import { getReadableError } from '@app/utils/errors'
import type { wagmiConfig } from '@app/utils/query/wagmi'
import { CheckIsSafeAppReturnType } from '@app/utils/safe'

type AccessListResponse = {
  accessList: {
    address: Address
    storageKeys: Hex[]
  }[]
  gasUsed: Hex
}

type TransactionIdentifiersWithData<name extends UserTransactionName = UserTransactionName> =
  StoredTransactionIdentifiers & {
    name: name
    data: UserTransactionData<name>
  }

export const getTransactionIdentifiersWithData = <
  name extends UserTransactionName = UserTransactionName,
>(
  transaction: GenericStoredTransaction<name>,
): TransactionIdentifiersWithData<name> => {
  const { sourceChainId, targetChainId, account, transactionId, flowId, name, data } = transaction
  return { sourceChainId, targetChainId, account, transactionId, flowId, name, data }
}

export const transactionMutateHandler =
  ({
    transactionIdentifiers,
    isSafeApp,
  }: {
    transactionIdentifiers: StoredTransactionIdentifiers
    isSafeApp: CheckIsSafeAppReturnType
  }) =>
  (request: SendTransactionVariables<typeof wagmiConfig, SupportedChain['id']>) => {
    useTransactionManager.getState().setTransactionSubmission(transactionIdentifiers, {
      input: request.data!,
      nonce: request.nonce!,
      timestamp: Date.now(),
      transactionType: isSafeApp ? 'safe' : 'standard',
    })
  }

export const transactionSuccessHandler =
  (transactionIdentifiers: StoredTransactionIdentifiers) =>
  async (transactionHash: SendTransactionReturnType) => {
    useTransactionManager.getState().setTransactionHash(transactionIdentifiers, transactionHash)
  }

export const registrationGasFeeModifier = (
  gasLimit: bigint,
  transactionName: UserTransactionName,
) =>
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
  transactionName: UserTransactionName
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

type CreateTransactionRequestQueryKey<name extends UserTransactionName> = CreateQueryKey<
  TransactionIdentifiersWithData<name>,
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
  async <name extends UserTransactionName>({
    queryKey: [params],
  }: QueryFunctionContext<CreateTransactionRequestQueryKey<name>>) => {
    const client = config.getClient({ chainId: params.targetChainId })

    if (!connectorClient) throw new Error('connectorClient is required')
    if (connectorClient.account.address !== params.account)
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

    const prepareParameters =
      params.name === '__dev_failure' ? [] : (['fees', 'nonce', 'type'] as const)

    const request = await prepareTransactionRequest(client, {
      to: transactionRequest.to,
      accessList,
      account: connectorClient.account,
      data: transactionRequest.data,
      gas: gasLimit,
      parameters: prepareParameters,
      ...('value' in transactionRequest ? { value: transactionRequest.value } : {}),
    })

    return {
      ...request,
      chain: request.chain!,
      to: request.to!,
      gas: request.gas!,
      chainId: params.targetChainId,
    }
  }

type GetTransactionErrorParameters = {
  hash: Hash | null
  status: StoredTransactionStatus | undefined
  targetChainId: TargetChain['id']
}

type GetTransactionErrorQueryKey = CreateQueryKey<
  GetTransactionErrorParameters,
  'getTransactionError',
  'standard'
>

export const getTransactionErrorQueryFn =
  (config: ConfigWithEns) =>
  async ({
    queryKey: [{ hash, status, targetChainId }],
  }: QueryFunctionContext<GetTransactionErrorQueryKey>) => {
    if (!hash || status !== 'reverted') return null
    const client = config.getClient({ chainId: targetChainId })
    const failedTransactionData = await getTransaction(client, { hash })
    try {
      await call(client, failedTransactionData as CallParameters<ConfigWithEns>)
      // TODO: better errors for this
      return 'transaction.dialog.error.gasLimit'
    } catch (err: unknown) {
      return getReadableError(err)
    }
  }
