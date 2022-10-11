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

export const revert = async (toSnapshot = 2) => {
  const currBlock = parseInt(await provider.send('eth_blockNumber', []), 16)
  await provider.send('evm_revert', [toSnapshot - 1])
  await provider.send('evm_snapshot', [])
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const revertBlock = parseInt(await provider.send('eth_blockNumber', []), 16)
  const blocksToMine = currBlock - revertBlock
  await rpcSendBatch([
    { method: 'anvil_mine', params: [blocksToMine + 1] },
    { method: 'evm_setAutomine', params: [true] },
  ])

  return [currBlock, revertBlock]
}

export const increaseTime = async (seconds) => {
  await provider.send('evm_increaseTime', [seconds])
  await provider.send('evm_mine', [])
}

export const getTime = async () => {
  const currTime = (await provider.getBlock()).timestamp
  return currTime * 1000
}

export const syncTime = (difference) => {
  cy.wrap(revert(1))
    .then(() =>
      provider.send('anvil_setNextBlockTimestamp', [Math.floor(Date.now() / 1000) - difference]),
    )
    .then(() => provider.send('evm_mine', []))
}

export const globalIncreaseTime = async (seconds) => {
  await provider.send('evm_increaseTime', [seconds])
  await provider.send('evm_mine', [])
}
