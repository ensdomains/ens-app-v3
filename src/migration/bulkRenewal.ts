import { holesky, sepolia } from 'viem/chains'

export const targetExpiryAbi = [
  {
    inputs: [
      {
        internalType: 'string[]',
        name: 'names',
        type: 'string[]',
      },
      {
        internalType: 'uint256',
        name: 'targetExpiry',
        type: 'uint256',
      },
    ],
    name: 'getTargetExpiryPriceData',
    outputs: [
      {
        internalType: 'uint256',
        name: 'total',
        type: 'uint256',
      },
      {
        internalType: 'uint256[]',
        name: 'durations',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'prices',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

export const bulkRenewalContract = {
  [holesky.id]: '0x3dCE478E4C880E96Ad3BF022acae38bef43F13eB',
  [sepolia.id]: '0x0E714019e4BC65164d29960805259C1fA70E508a',
}
