import { Chain } from 'viem'

import type { Register } from '@app/local-contracts'

export const makeLocalhostChainWithEns = <T extends Chain>(
  localhost: T,
  deploymentAddresses_: Register['deploymentAddresses'],
) => {
  return {
    ...localhost,
    contracts: {
      ...localhost.contracts,
      ensRegistry: {
        address: deploymentAddresses_.ENSRegistry,
      },
      ensUniversalResolver: {
        address: deploymentAddresses_.UniversalResolver,
      },
      multicall3: {
        address: deploymentAddresses_.Multicall,
      },
      ensBaseRegistrarImplementation: {
        address: deploymentAddresses_.BaseRegistrarImplementation,
      },
      ensDnsRegistrar: {
        address: deploymentAddresses_.DNSRegistrar,
      },
      ensEthRegistrarController: {
        address: deploymentAddresses_.ETHRegistrarController,
      },
      ensNameWrapper: {
        address: deploymentAddresses_.NameWrapper,
      },
      ensPublicResolver: {
        address: deploymentAddresses_.PublicResolver,
      },
      ensReverseRegistrar: {
        address: deploymentAddresses_.ReverseRegistrar,
      },
      ensBulkRenewal: {
        address: deploymentAddresses_.StaticBulkRenewal,
      },
      ensDnssecImpl: {
        address: deploymentAddresses_.DNSSECImpl,
      },
      legacyEthRegistrarController: {
        address: deploymentAddresses_.LegacyETHRegistrarController,
      },
      legacyPublicResolver: {
        address: deploymentAddresses_.LegacyPublicResolver,
      },
    },
    subgraphs: {
      ens: {
        url: 'http://localhost:42069/subgraph',
      },
    },
  } as const
}
