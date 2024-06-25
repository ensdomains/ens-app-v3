/* eslint-disable import/no-extraneous-dependencies */

import { resolve } from 'path'
import { localhost } from 'viem/chains'

import { config } from 'dotenv'
import {
  createPublicClient,
  createTestClient,
  createWalletClient,
  http,
  TransactionReceiptNotFoundError,
  type Account,
  type Hash,
  type PublicClient,
  type TestClient,
  type TransactionReceipt,
  type WalletClient,
  Address,
} from 'viem'
import { makeLocalhostChainWithEns } from '@app/utils/chains/makeLocalhostChainWithEns'
import { Register } from '@app/local-contracts'

import { emptyAddress } from '@app/utils/constants'

config({
  path: resolve(__dirname, '../../.env.local'),
  override: true,
})

type ContractName =
  | 'BaseRegistrarImplementation'
  | 'ETHRegistrarController'
  | 'Multicall'
  | 'NameWrapper'
  | 'DNSRegistrar'
  | 'PublicResolver'
  | 'ENSRegistry'
  | 'ReverseRegistrar'
  | 'UniversalResolver'
  | 'StaticBulkRenewal'
  | 'DNSSECImpl'
  | 'LegacyDNSRegistrar'
  | 'LegacyDNSSECImpl'

export const deploymentAddresses = JSON.parse(
  process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES || '{}',
) as Register['deploymentAddresses']

export const localhostWithEns = makeLocalhostChainWithEns<typeof localhost>(localhost, deploymentAddresses)

const localhostWithEnsAndAdditionalTestContracts = {
  ...localhostWithEns,
  contracts: {
    ...localhostWithEns.contracts,
    legacyPublicResolver: { 
      address: deploymentAddresses.LegacyPublicResolver as Address
    },
    publicResolver: {
      address: deploymentAddresses.PublicResolver as Address
    },
  }
} as const

const transport = http('http://127.0.0.1:8545')

export const publicClient: PublicClient<typeof transport, typeof localhostWithEnsAndAdditionalTestContracts> = createPublicClient({
  chain: localhostWithEnsAndAdditionalTestContracts,
  transport,
})

export const testClient: TestClient<'anvil', typeof transport, typeof localhostWithEnsAndAdditionalTestContracts> = createTestClient(
  {
    chain: localhostWithEnsAndAdditionalTestContracts,
    transport,
    mode: 'anvil',
  },
)

export const walletClient = (
  createWalletClient({
    chain: localhostWithEnsAndAdditionalTestContracts,
    transport,
  }) as WalletClient<typeof transport, typeof localhost, Account>
).extend((client) => ({
  mine: async ({ account }: { account: Account }) =>
    client.sendTransaction({
      to: emptyAddress,
      data: '0x',
      account,
    }),
})) as WalletClient<typeof transport, typeof localhost, Account> & {
  mine: (params: { account: Account }) => Promise<Hash>
}

export const waitForTransaction = async (hash: Hash): Promise<TransactionReceipt> =>
  publicClient
    .getTransactionReceipt({ hash })
    .catch(async (err) => {
      if (err instanceof TransactionReceiptNotFoundError) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        return waitForTransaction(hash)
      }
      throw err
    })
    .then((receipt) => {
      if (receipt.status === 'reverted') throw new Error(`Transaction ${hash} reverted`)
      return receipt
    })
