/* eslint-disable import/no-extraneous-dependencies */

import { resolve } from 'path'

import { config } from 'dotenv'
import {
  Address,
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
} from 'viem'
import { localhost } from 'viem/chains'

import { Register } from '@app/local-contracts'
import { makeLocalhostChainWithEns } from '@app/utils/chains/makeLocalhostChainWithEns'

config({
  path: resolve(__dirname, '../../../../.env.local'),
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

export const localhostWithEns = makeLocalhostChainWithEns<typeof localhost>(
  localhost,
  deploymentAddresses,
)

const localhostWithEnsAndAdditionalTestContracts = {
  ...localhostWithEns,
  contracts: {
    ...localhostWithEns.contracts,
    legacyPublicResolver: {
      address: deploymentAddresses.LegacyPublicResolver as Address,
    },
    legacyRegistrarController: {
      address: deploymentAddresses.LegacyETHRegistrarController as Address,
    },
    publicResolver: {
      address: deploymentAddresses.PublicResolver as Address,
    },
  },
} as const

const transport = http('http://localhost:8545')

export const publicClient: PublicClient<
  typeof transport,
  typeof localhostWithEnsAndAdditionalTestContracts
> = createPublicClient({
  chain: localhostWithEnsAndAdditionalTestContracts,
  transport,
})

export const testClient: TestClient<
  'anvil',
  typeof transport,
  typeof localhostWithEnsAndAdditionalTestContracts
> = createTestClient({
  chain: localhostWithEnsAndAdditionalTestContracts,
  transport,
  mode: 'anvil',
})

export const walletClient: WalletClient<
  typeof transport,
  typeof localhostWithEnsAndAdditionalTestContracts,
  Account
> = createWalletClient({
  chain: localhostWithEnsAndAdditionalTestContracts,
  transport,
})

export const waitForTransaction = async (hash: Hash) =>
  new Promise<TransactionReceipt>((resolveFn, reject) => {
    publicClient
      .getTransactionReceipt({ hash })
      .then(resolveFn)
      .catch((e) => {
        if (e instanceof TransactionReceiptNotFoundError) {
          setTimeout(() => {
            waitForTransaction(hash).then(resolveFn)
          }, 100)
        } else {
          reject(e)
        }
      })
  })
