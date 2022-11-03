/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line import/no-extraneous-dependencies
// import type { JsonRpcProvider } from '@ethersproject/providers'
import { chains } from '@web3modal/ethereum'
import { useProvider, useSendTransaction } from '@web3modal/react'

import { Button } from '@ensdomains/thorin'

import { useAddRecentTransaction } from '@app/hooks/transactions/useAddRecentTransaction'
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
  const { provider } = useProvider()
  const { id: chainId } = chains.goerli

  const addTransaction = useAddRecentTransaction()
  const { createTransactionFlow } = useTransactionFlow()

  const transactionOptions = {
    request: {
      to: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
      data: '0x1231237123423423',
      gasLimit: '1000000',
    },
    chainId,
  }

  const { sendTransaction: sendFailure } = useSendTransaction(transactionOptions)

  const { sendTransaction: sendSuccess } = useSendTransaction(transactionOptions)

  const addSuccess = async () => {
    const tx = await sendSuccess!()
    addTransaction({
      // @ts-ignore
      hash: tx?.hash,
      action: 'test',
    })
  }

  const sendName = async () => {
    createTransactionFlow('dev-sendName', {
      transactions: [makeTransactionItem('testSendName', {})],
    })
  }

  const addFailure = async () => {
    const tx = await sendFailure!()
    addTransaction({
      // @ts-ignore
      hash: tx?.hash,
      action: 'test',
    })
  }

  const startAutoMine = async () =>
    // @ts-ignore // W3M does not have hardhat evn_setAutomine
    provider.send('evm_setAutomine', [true]).then(() => provider.send('evm_mine', []))

  // @ts-ignore
  const stopAutoMine = async () => provider.send('evm_setAutomine', [false])

  const revert = async () => {
    const currBlock = await provider?.getBlockNumber()
    // @ts-ignore
    await provider.send('evm_revert', [1])
    // @ts-ignore
    await provider.send('evm_snapshot', [])
    const revertBlock = await provider?.getBlockNumber()
    // @ts-ignore
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
