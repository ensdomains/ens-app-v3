import { getPublicClient } from '@wagmi/core'
import type {
  CallParameters,
  GetTransactionReceiptParameters,
  Hash,
  WaitForTransactionReceiptParameters,
  WaitForTransactionReceiptReturnType,
} from 'viem'
import { hexToString } from 'viem'

import { fetchTxFromSafeTxHash } from '@app/utils/safe'

export type WaitForTransactionArgs = {
  /** Chain id to use for Public Client. */
  chainId?: number
  /**
   * Number of blocks to wait for after transaction is mined
   * @default 1
   */
  confirmations?: number
  /** Transaction hash to monitor */
  hash: Hash
  /** Callback to invoke when the transaction has been replaced (sped up). */
  onReplaced?: WaitForTransactionReceiptParameters['onReplaced']
  /*
   * Maximum amount of time to wait before timing out in milliseconds
   * @default 0
   */
  timeout?: number
  isSafeTx?: boolean
}

export type WaitForTransactionResult = WaitForTransactionReceiptReturnType

export async function waitForTransaction({
  chainId,
  confirmations = 1,
  hash,
  onReplaced,
  timeout = 0,
  isSafeTx,
}: WaitForTransactionArgs): Promise<WaitForTransactionResult> {
  let publicClient = getPublicClient({ chainId })
  const clientChainId = publicClient.chain.id

  if (isSafeTx) {
    publicClient = publicClient.extend((client) => ({
      getTransactionReceipt: async (args: GetTransactionReceiptParameters) => {
        const realTxData = await fetchTxFromSafeTxHash({
          chainId: clientChainId,
          safeTxHash: args.hash,
        })
        if (!realTxData) return null
        return client.getTransactionReceipt({ hash: realTxData.transactionHash })
      },
    }))
  }

  const receipt = await publicClient.waitForTransactionReceipt({
    hash,
    confirmations,
    onReplaced,
    timeout,
  })
  if (receipt.status === 'reverted') {
    const txn = await publicClient.getTransaction({
      hash: receipt.transactionHash,
    })
    const code = (await publicClient.call({
      ...txn,
      gasPrice: txn.type !== 'eip1559' ? txn.gasPrice : undefined,
      maxFeePerGas: txn.type === 'eip1559' ? txn.maxFeePerGas : undefined,
      maxPriorityFeePerGas: txn.type === 'eip1559' ? txn.maxPriorityFeePerGas : undefined,
    } as CallParameters)) as unknown as string
    const reason = hexToString(`0x${code.substring(138)}`)
    throw new Error(reason)
  }
  return receipt
}
