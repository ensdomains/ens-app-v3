import { ethers } from 'ethers'

const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545', 1337)

const rpcSendBatch = (items) =>
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

export const revert = async () => {
  const currBlock = await provider.getBlockNumber()
  await provider.send('evm_revert', [1])
  await provider.send('evm_snapshot', [])
  const revertBlock = await provider.getBlockNumber()
  const blocksToMine = currBlock - revertBlock
  await rpcSendBatch([
    ...Array.from({ length: blocksToMine + 1 }, () => ({ method: 'evm_mine', params: [] })),
    { method: 'evm_setAutomine', params: [true] },
  ])
  cy.resetMetamaskAccount()
}
