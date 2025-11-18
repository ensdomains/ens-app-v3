import type { Address, Chain } from 'viem'

import { ChainWithEns } from '@ensdomains/ensjs/contracts'

import type { Register } from '@app/local-contracts'

export const makeLocalhostChainWithEns = <T extends Chain>(
  localhost: T,
  deploymentAddresses_: Register['deploymentAddresses'],
): ChainWithEns<T> => {
  return {
    ...localhost,
    contracts: {
      ...localhost.contracts,
      ensRegistry: {
        address: deploymentAddresses_.ENSRegistry as Address,
      },
      ensUniversalResolver: {
        address: deploymentAddresses_.UniversalResolver as Address,
      },
      multicall3: {
        address: deploymentAddresses_.Multicall as Address,
      },
      ensBaseRegistrarImplementation: {
        address: deploymentAddresses_.BaseRegistrarImplementation as Address,
      },
      ensDnsRegistrar: {
        address: deploymentAddresses_.DNSRegistrar as Address,
      },
      ensEthRegistrarController: {
        address: deploymentAddresses_.ETHRegistrarController as Address,
      },
      ensNameWrapper: {
        address: deploymentAddresses_.NameWrapper as Address,
      },
      ensPublicResolver: {
        address: deploymentAddresses_.PublicResolver as Address,
      },
      ensReverseRegistrar: {
        address: deploymentAddresses_.ReverseRegistrar as Address,
      },
      ensBulkRenewal: {
        address: deploymentAddresses_.WrappedStaticBulkRenewal as Address,
      },
      ensDnssecImpl: {
        address: deploymentAddresses_.DNSSECImpl as Address,
      },
      legacyEthRegistrarController: {
        address: deploymentAddresses_.LegacyETHRegistrarController as Address,
      },
      legacyPublicResolver: {
        address: deploymentAddresses_.LegacyPublicResolver as Address,
      },
      wrappedEthRegistrarController: {
        address: deploymentAddresses_.WrappedEthRegistrarController as Address,
      },
      wrappedPublicResolver: {
        address: deploymentAddresses_.NameWrapperPublicResolver as Address,
      },
      ensDefaultReverseRegistrar: {
        address: deploymentAddresses_.DefaultReverseRegistrar as Address,
      },
      wrappedBulkRenewal: {
        address: deploymentAddresses_.WrappedStaticBulkRenewal as Address,
      },
    },
    subgraphs: {
      ens: {
        url: 'http://localhost:42069/subgraph',
      },
    },
  }
}
