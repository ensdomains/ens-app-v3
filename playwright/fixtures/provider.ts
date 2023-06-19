/* eslint-disable import/no-extraneous-dependencies */
import { ethers } from 'ethers'

export type Provider = Awaited<ReturnType<typeof createProvider>>

export const createProvider = () => {
  const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545')
  return {
    getSigner: (index: number) => provider.getSigner(index),
    increaseTime: (seconds: number) => provider.send('evm_increaseTime', [seconds]),
    mine: () => provider.send('evm_mine', []),
    setAutomine: (active: boolean) => provider.send('evm_setAutomine', [active]),
    getBlockNumber: () => provider.getBlockNumber(),
  }
}
