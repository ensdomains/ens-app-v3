/* eslint-disable import/no-extraneous-dependencies */

import { resolve } from 'path'

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
} from 'viem'
import { localhost as _localhost } from 'viem/chains'
import { makeLocalhostWithEns } from '@app/constants/chains'
import { Register } from '@app/local-contracts'

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

export const localhost = makeLocalhostWithEns(deploymentAddresses)

const transport = http('http://localhost:8545')

export const publicClient: PublicClient<typeof transport, typeof localhost> = createPublicClient({
  chain: localhost,
  transport,
})

export const testClient: TestClient<'anvil', typeof transport, typeof localhost> = createTestClient(
  {
    chain: localhost,
    transport,
    mode: 'anvil',
  },
)

export const walletClient: WalletClient<typeof transport, typeof localhost, Account> =
  createWalletClient({
    chain: localhost,
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
