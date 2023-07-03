/* eslint-disable import/no-extraneous-dependencies */
import { ethers } from 'ethers'

export type Provider = Awaited<ReturnType<typeof createProvider>>

export const createProvider = () => {
  const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545')
  let snapshotId = 0
  return {
    send: (method: string, params: any[]) => provider.send(method, params),
    getSigner: (index: number) => provider.getSigner(index),
    increaseTime: (seconds: number) => provider.send('evm_increaseTime', [seconds]),
    mine: () => provider.send('evm_mine', []),
    setAutomine: (active: boolean) => provider.send('evm_setAutomine', [active]),
    getBlockNumber: () => provider.getBlockNumber(),
    revert: async () => {
      if (snapshotId) {
        await provider.send('evm_revert', [snapshotId])
      }
      snapshotId = await provider.send('evm_snapshot', [])
      console.log('snapshotId', snapshotId)
    },
  }
}
