import { useMemo } from 'react'
import { revert as evmRevert, snapshot as evmSnapshot, mine, setAutomine } from 'viem/test'
import { usePrepareSendTransaction, useSendTransaction } from 'wagmi'

import { Button } from '@ensdomains/thorin'

import { useAddRecentTransaction } from '@app/hooks/transactions/useAddRecentTransaction'
import { useLocalStorage } from '@app/hooks/useLocalStorage'
import { usePublicClient } from '@app/hooks/usePublicClient'
import { DetailedSwitch } from '@app/transaction-flow/input/ProfileEditor/components/DetailedSwitch'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import { SectionContainer } from './Section'

const rpcSendBatch = (items: { method: string; params: any[] }[]) =>
  fetch('http://localhost:8545', {
    method: 'POST',
    headers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
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
  const publicClient = usePublicClient()
  const testClient = useMemo(
    () =>
      (({
        ...publicClient,
        mode: 'anvil'
      }) as const),
    [publicClient],
  )

  const addTransaction = useAddRecentTransaction()
  const { createTransactionFlow } = useTransactionFlow()
  const { config: successConfig } = usePrepareSendTransaction({
    to: '0x0000000000000000000000000000000000000000',
    value: 0n,
  })
  const { sendTransactionAsync: sendFailure } = useSendTransaction({
    mode: 'prepared',
    to: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    data: '0x1231237123423423',
    gas: 1000000n,
  })
  const { sendTransactionAsync: sendSuccess } = useSendTransaction(successConfig)

  const addSuccess = async () => {
    const transaction = await sendSuccess!()
    addTransaction({
      hash: transaction.hash,
      action: 'test',
      searchRetries: 0,
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
      hash: transaction.hash,
      action: 'test',
      searchRetries: 0,
    })
  }

  const startAutoMine = async () =>
    setAutomine(testClient, true).then(() => mine(testClient, { blocks: 1 }))

  const stopAutoMine = async () => setAutomine(testClient, false)

  const revert = async () => {
    const currBlock = await publicClient.getBlockNumber()
    await evmRevert(testClient, { id: '0x1' })
    await evmSnapshot(testClient)
    const revertBlock = await publicClient.getBlockNumber()
    const blocksToMine = currBlock - revertBlock
    await rpcSendBatch(
      Array.from({ length: Number(blocksToMine) + 1 }, () => ({ method: 'evm_mine', params: [] })),
    )
  }

  const [subgraphError, setSubgraphError] = useLocalStorage<string | null>('subgraph-debug', null)

  return (
    <SectionContainer title="Developer">
      {process.env.NEXT_PUBLIC_PROVIDER && (
        <>
          <Button onClick={() => addSuccess()}>Add Successful Transaction</Button>
          <Button onClick={() => sendName()}>Test Send Name</Button>
          <Button onClick={() => addFailure()}>Add Failing Transaction</Button>
          <Button onClick={() => startAutoMine()}>Start Automine</Button>
          <Button onClick={() => stopAutoMine()}>Stop Automine</Button>
          <Button onClick={() => revert()}>Revert</Button>
        </>
      )}
      <DetailedSwitch
        title="ENSJS Network Error"
        description="An error caused by the subgraph network failing"
        checked={subgraphError === 'ENSJSSubgraphError'}
        onChange={(e) => {
          setSubgraphError(e.currentTarget.checked ? 'ENSJSSubgraphError' : '')
        }}
        data-testid="subgraph-network-error"
      />
      <DetailedSwitch
        title="Network Latency Error"
        checked={subgraphError === 'ENSJSSubgraphLatency'}
        onChange={(e) => {
          setSubgraphError(e.currentTarget.checked ? 'ENSJSSubgraphLatency' : '')
        }}
        data-testid="network-latency-error"
      />
    </SectionContainer>
  )
}
