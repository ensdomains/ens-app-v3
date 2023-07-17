import {
  BaseProvider,
  FallbackProvider,
  JsonRpcFetchFunc,
  type TransactionResponse,
  Web3Provider,
} from '@ethersproject/providers'
import { toUtf8String } from '@ethersproject/strings'
import { Hash, fetchBlockNumber, fetchTransaction, getProvider } from '@wagmi/core'
import type { BigNumber, providers } from 'ethers'

import { fetchTxFromSafeTxHash } from '@app/utils/safe'

type EthersReplaceable = {
  data: string
  from: string
  nonce: number
  to: string
  value: BigNumber
  startBlock: number
}

export type WaitForTransactionArgs = {
  /** Chain id to use for provider */
  chainId?: number
  /**
   * Number of blocks to wait for after transaction is mined
   * @default 1
   */
  confirmations?: number
  /** Transaction hash to monitor */
  hash: Hash
  /** Callback to invoke when the transaction has been sped up. */
  onSpeedUp?: (transaction: TransactionResponse) => void
  /*
   * Maximum amount of time to wait before timing out in milliseconds
   * @default 0
   */
  timeout?: number

  isSafeTx?: boolean
}

export type WaitForTransactionResult = providers.TransactionReceipt

export class SafeTxExecutedError extends Error {
  constructor(public reason: string, public replacement?: { hash: string }) {
    super()
  }
}

export async function waitForTransaction({
  chainId,
  confirmations = 1,
  hash,
  onSpeedUp,
  timeout = 0,
  isSafeTx,
}: WaitForTransactionArgs): Promise<WaitForTransactionResult> {
  const fallbackProvider = getProvider<FallbackProvider>({ chainId })
  let provider: BaseProvider = fallbackProvider
  const providerChainId = provider.network.chainId

  if (isSafeTx) {
    const jsonRpcFetchFunc: JsonRpcFetchFunc = async (method, params = []) => {
      if (method === 'eth_getTransactionReceipt' && params[0] === hash) {
        const realTxData = await fetchTxFromSafeTxHash({
          chainId: providerChainId,
          safeTxHash: hash,
        })
        if (!realTxData) return null
        return fallbackProvider.getTransactionReceipt(realTxData.transactionHash)
      }
      if (method === 'eth_chainId' || method === 'net_version') return providerChainId.toString()
      if (method === 'eth_blockNumber') return fallbackProvider.getBlockNumber()
      return null
    }
    provider = new Web3Provider(jsonRpcFetchFunc, providerChainId)
  }

  const [blockNumber, transaction] = await Promise.all([
    fetchBlockNumber(),
    fetchTransaction({ hash }),
  ])

  let replaceable: EthersReplaceable | null = null
  if (confirmations !== 0 && transaction?.to) {
    replaceable = {
      data: transaction.data,
      from: transaction.from,
      nonce: transaction.nonce,
      startBlock: blockNumber,
      to: transaction.to,
      value: transaction.value,
    }
  }

  try {
    const receipt = await provider._waitForTransaction(hash, confirmations, timeout, replaceable!)
    if (receipt.status === 0) {
      const code = await provider.call(receipt, receipt.blockNumber)
      const reason = toUtf8String(`0x${code.substring(138)}`)
      throw new Error(reason)
    }
    if (isSafeTx) throw new SafeTxExecutedError('repriced', { hash: receipt.transactionHash })
    return receipt
  } catch (err: any) {
    if (err?.reason === 'repriced') {
      onSpeedUp?.(err.replacement as TransactionResponse)
      return waitForTransaction({
        hash: err.replacement?.hash,
        confirmations,
        timeout,
      })
    }
    throw err
  }
}
