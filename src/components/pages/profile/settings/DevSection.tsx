/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line import/no-extraneous-dependencies
import type { JsonRpcProvider } from '@ethersproject/providers'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { usePrepareSendTransaction, useProvider, useSendTransaction } from 'wagmi'

import { Button } from '@ensdomains/thorin'

import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { makeTransactionItem } from '@app/transaction-flow/transaction'

import { SectionContainer } from './Section'

const rpcSendBatch = (items: { method: string; params: any[] }[]) =>
  fetch('http://localhost:8545', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(
      items.map(({ method, params }, i) => ({
        jsonrpc: '2.0',
        method,
        params,
        id: i + 1,
      })),
    ),
  })

export const DevSection = () => {
  const provider: JsonRpcProvider = useProvider()
  const addTransaction = useAddRecentTransaction()
  const { createTransactionFlow } = useTransactionFlow()
  const { config: successConfig } = usePrepareSendTransaction({
    request: {
      to: '0x0000000000000000000000000000000000000000',
      value: '0',
    },
  })
  const { sendTransactionAsync: sendFailure } = useSendTransaction({
    mode: 'prepared',
    request: {
      to: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
      data: '0x1231237123423423',
      gasLimit: '1000000',
    },
  })
  const { sendTransactionAsync: sendSuccess } = useSendTransaction(successConfig)

  const addSuccess = async () => {
    const transaction = await sendSuccess!()
    addTransaction({
      description: JSON.stringify({ action: 'test' }),
      hash: transaction.hash,
    })
  }

  const sendName = async () => {
    createTransactionFlow('dev-sendName', {
      transactions: [makeTransactionItem('testSendName', {})],
    })
  }

  const addFailure = async () => {
    const transaction = await sendFailure!()
    addTransaction({
      description: JSON.stringify({ action: 'test' }),
      hash: transaction.hash,
    })
  }

  const startAutoMine = async () =>
    provider.send('evm_setAutomine', [true]).then(() => provider.send('evm_mine', []))

  const stopAutoMine = async () => provider.send('evm_setAutomine', [false])

  const revert = async () => {
    const currBlock = await provider.getBlockNumber()
    await provider.send('evm_revert', [1])
    await provider.send('evm_snapshot', [])
    const revertBlock = await provider.getBlockNumber()
    const blocksToMine = currBlock - revertBlock
    await rpcSendBatch(
      Array.from({ length: blocksToMine + 1 }, () => ({ method: 'evm_mine', params: [] })),
    )
  }

  return (
    <SectionContainer title="Developer">
      <Button shadowless onClick={() => addSuccess()}>
        Add Successful Transaction
      </Button>
      <Button shadowless onClick={() => sendName()}>
        Test Send Name
      </Button>
      <Button shadowless onClick={() => addFailure()}>
        Add Failing Transaction
      </Button>
      <Button shadowless onClick={() => startAutoMine()}>
        Start Automine
      </Button>
      <Button shadowless onClick={() => stopAutoMine()}>
        Stop Automine
      </Button>
      <Button shadowless onClick={() => revert()}>
        Revert
      </Button>
    </SectionContainer>
  )
}
