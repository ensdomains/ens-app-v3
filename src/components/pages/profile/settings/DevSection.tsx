import { useMemo } from 'react'
import {
  revert as evmRevert,
  snapshot as evmSnapshot,
  getBlockNumber,
  mine,
  setAutomine,
} from 'viem/actions'
import { Config, useClient } from 'wagmi'

import { Button } from '@ensdomains/thorin'

import { localhostWithEns } from '@app/constants/chains'
import { useLocalStorage } from '@app/hooks/useLocalStorage'
import { useTransactionManager } from '@app/transaction/transactionManager'
import { DetailedSwitch } from '@app/transaction/user/input/ProfileEditor/components/DetailedSwitch'

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

type TestConfig = Config<[typeof localhostWithEns]>

export const DevSection = () => {
  const client = useClient<TestConfig>()
  const testClient = useMemo(() => ({ ...client, mode: 'anvil' }) as const, [client])

  const startFlow = useTransactionManager((s) => s.startFlow)

  const sendName = () => {
    startFlow({
      flowId: 'dev-sendName',
      transactions: [{ name: 'testSendName', data: {} }],
    })
  }

  const addFailure = () => {
    startFlow({
      flowId: 'dev-addFailure',
      transactions: [{ name: '__dev_failure', data: {} }],
    })
  }

  const startAutoMine = async () =>
    setAutomine(testClient, true).then(() => mine(testClient, { blocks: 1 }))

  const stopAutoMine = async () => setAutomine(testClient, false)

  const revert = async () => {
    const currBlock = await getBlockNumber(client)
    await evmRevert(testClient, { id: '0x1' })
    await evmSnapshot(testClient)
    const revertBlock = await getBlockNumber(client)
    const blocksToMine = currBlock - revertBlock
    await rpcSendBatch(
      Array.from({ length: Number(blocksToMine) + 1 }, () => ({ method: 'evm_mine', params: [] })),
    )
  }

  const [subgraphError, setSubgraphError] = useLocalStorage<string | null>('subgraph-debug', null)

  return (
    <SectionContainer title="Developer">
      {true && (
        <>
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
