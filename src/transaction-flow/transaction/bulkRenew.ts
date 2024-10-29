import { TFunction } from 'react-i18next'
import { goerli, holesky, localhost, mainnet, sepolia } from 'viem/chains'
import { encodeFunctionData } from 'viem/utils'

import type { Transaction, TransactionDisplayItem, TransactionFunctionParameters } from '@app/types'

type Data = { names: `0x${string}`[]; durations: bigint[]; prices: bigint[] }

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
  {
    inputs: [
      {
        internalType: 'string[]',
        name: 'names',
        type: 'string[]',
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
    name: 'renewAllWithTargetExpiry',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

export const bulkRenewalContract = {
  [mainnet.id]: '0xnotdeployedyet',
  [goerli.id]: '0xdeprecated',
  [localhost.id]: '0xnotdeployedyet',
  [holesky.id]: '0x76aafA281Ed5155f83926a12ACB92e237e322A8C',
  [sepolia.id]: '0xf9c8c83adda8d52d9284cdbef23da10b5f9869bf',
} as const

const displayItems = (
  { names }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'names',
    value: names.map((name) => `0x${name}`).join(', '),
  },
  {
    label: 'action',
    value: t('transaction.info.fuses.CAN_EXTEND_EXPIRY'),
  },
]

const transaction = async ({ client, data }: TransactionFunctionParameters<Data>) => {
  return {
    to: bulkRenewalContract[client.chain.id],
    data: encodeFunctionData({
      abi: targetExpiryAbi,
      functionName: 'renewAllWithTargetExpiry',
      args: [data.names, data.durations, data.prices],
    }),
  }
}

export default { displayItems, transaction } satisfies Transaction<Data>
