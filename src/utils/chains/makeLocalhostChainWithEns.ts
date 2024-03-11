import { Address, Chain } from 'viem'

import type { Register } from '@app/local-contracts'

export const makeLocalhostChainWithEns = (
  localhost: Chain,
  deploymentAddresses_: Register['deploymentAddresses'],
) => {
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
        address: deploymentAddresses_.StaticBulkRenewal as Address,
      },
      ensDnssecImpl: {
        address: deploymentAddresses_.DNSSECImpl as Address,
      },
    },
    subgraphs: {
      ens: {
        url: 'http://localhost:8000/subgraphs/name/graphprotocol/ens',
      },
    },
  } as const
}
