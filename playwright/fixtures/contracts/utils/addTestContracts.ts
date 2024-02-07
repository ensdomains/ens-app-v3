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
  type Address,
  type Hash,
  type PublicClient,
  type TestClient,
  type TransactionReceipt,
  type WalletClient,
} from 'viem'
import { localhost as _localhost } from 'viem/chains'

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

const deploymentAddressesStr = process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES || '{}'
export const deploymentAddresses = JSON.parse(deploymentAddressesStr) as Record<
  | ContractName
  | 'ENSRegistry'
  | 'LegacyPublicResolver'
  | 'NoMulticallResolver'
  | 'LegacyETHRegistrarController',
  Address
>

export const localhost = {
  ..._localhost,
  contracts: {
    ensRegistry: {
      address: deploymentAddresses.ENSRegistry,
    },
    ensUniversalResolver: {
      address: deploymentAddresses.UniversalResolver,
    },
    multicall3: {
      address: deploymentAddresses.Multicall,
    },
    ensBaseRegistrarImplementation: {
      address: deploymentAddresses.BaseRegistrarImplementation,
    },
    ensDnsRegistrar: {
      address: deploymentAddresses.LegacyDNSRegistrar,
    },
    ensEthRegistrarController: {
      address: deploymentAddresses.ETHRegistrarController,
    },
    ensLegacyEthRegistrarController: {
      address: deploymentAddresses.LegacyETHRegistrarController,
    },
    ensNameWrapper: {
      address: deploymentAddresses.NameWrapper,
    },
    ensPublicResolver: {
      address: deploymentAddresses.PublicResolver,
    },
    ensReverseRegistrar: {
      address: deploymentAddresses.ReverseRegistrar,
    },
    ensBulkRenewal: {
      address: deploymentAddresses.StaticBulkRenewal,
    },
    ensDnssecImpl: {
      address: deploymentAddresses.LegacyDNSSECImpl,
    },
    legacyPublicResolver: {
      address: deploymentAddresses.LegacyPublicResolver,
    },
    publicResolver: {
      address: deploymentAddresses.PublicResolver,
    },
  },
  subgraphs: {
    ens: {
      url: 'http://localhost:8000/subgraphs/name/graphprotocol/ens',
    },
  },
} as const

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
