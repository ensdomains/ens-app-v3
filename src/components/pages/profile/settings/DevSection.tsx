/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line import/no-extraneous-dependencies
import type { JsonRpcProvider } from '@ethersproject/providers'
import { useEffect, useState } from 'react'
import { usePrepareSendTransaction, useProvider, useSendTransaction } from 'wagmi'

import { Button } from '@ensdomains/thorin'

import { useAddRecentTransaction } from '@app/hooks/transactions/useAddRecentTransaction'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { DetailedSwitch } from '@app/transaction-flow/input/ProfileEditor/components/DetailedSwitch'
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

const useLocalStorageString = (key: string, defaultValue = '') => {
  const [value, _setValue] = useState(defaultValue)
  useEffect(() => {
    _setValue(localStorage.getItem(key) || defaultValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const setValue = (newValue: string) => {
    localStorage.setItem(key, newValue)
    _setValue(newValue)
  }
  return [value, setValue] as const
}

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

  const [ensjsError, setEnsjsError] = useLocalStorageString('ensjs-debug')
  const [subgraphError, setSubgraphError] = useLocalStorageString('subgraph-debug')

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
        title="ENSJS Subgraph Indexing Error"
        description="An error caused by the subgraph not indexing. In theory, should still be able to get meta data from graph."
        checked={
          ensjsError === 'ENSJSSubgraphError' && subgraphError === 'ENSJSSubgraphIndexingError'
        }
        onChange={(e) => {
          setSubgraphError(e.currentTarget.checked ? 'ENSJSSubgraphIndexingError' : '')
          setEnsjsError(e.currentTarget.checked ? 'ENSJSSubgraphError' : '')
        }}
        data-testid="subgraph-indexing-error"
      />
      <DetailedSwitch
        title="ENSJS Network Error"
        description="An error caused by the subgraph network failing"
        checked={
          ensjsError === 'ENSJSSubgraphError' && subgraphError !== 'ENSJSSubgraphIndexingError'
        }
        onChange={(e) => {
          setSubgraphError('')
          setEnsjsError(e.currentTarget.checked ? 'ENSJSSubgraphError' : '')
        }}
        data-testid="subgraph-network-error"
      />
      <DetailedSwitch
        title="Network Latency Error"
        checked={ensjsError === 'ENSJSSubgraphLatency'}
        onChange={(e) => {
          setEnsjsError(e.currentTarget.checked ? 'ENSJSSubgraphLatency' : '')
          setSubgraphError('')
        }}
        data-testid="network-latency-error"
      />
    </SectionContainer>
  )
}
