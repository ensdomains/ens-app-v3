import type { Address } from 'viem'
import { holesky } from 'viem/chains'
import { goerli, localhost, mainnet, sepolia } from 'wagmi/chains'

import { addEnsContracts } from '@ensdomains/ensjs'

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
  | 'LegacyPublicResolver'

export const deploymentAddresses = JSON.parse(
  process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES || '{}',
) as Record<ContractName | 'ENSRegistry', Address>

export const localhostWithEns = {
  ...localhost,
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
  },
  subgraphs: {
    ens: {
      url: 'http://localhost:8000/subgraphs/name/graphprotocol/ens',
    },
  },
} as const

export const mainnetWithEns = addEnsContracts(mainnet)
export const goerliWithEns = addEnsContracts(goerli)
export const sepoliaWithEns = addEnsContracts(
  // TODO: once viem v2 implemented remove this type hack
  sepolia as typeof sepolia & {
    contracts: { ensRegistry: { address: Address }; ensUniversalResolver: { address: Address } }
  },
)
export const holeskyWithEns = addEnsContracts(
  holesky as typeof holesky & {
    contracts: { ensRegistry: { address: Address }; ensUniversalResolver: { address: Address } }
  },
)

export const chainsWithEns = [
  mainnetWithEns,
  goerliWithEns,
  sepoliaWithEns,
  holeskyWithEns,
  localhostWithEns,
]

export const getSupportedChainById = (chainId: number | undefined) =>
  chainId ? chainsWithEns.find((c) => c.id === chainId) : undefined

export type SupportedChain =
  | typeof mainnetWithEns
  | typeof goerliWithEns
  | typeof sepoliaWithEns
  | typeof holeskyWithEns
