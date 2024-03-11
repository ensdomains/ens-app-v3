import { holesky } from 'viem/chains'
import { goerli, localhost, mainnet, sepolia } from 'wagmi/chains'

import { addEnsContracts } from '@ensdomains/ensjs'

import type { Register } from '@app/local-contracts'

export const deploymentAddresses = JSON.parse(
  process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES || '{}',
) as Register['deploymentAddresses']

export const makeLocalhostWithEns = (deploymentAddresses_: Register['deploymentAddresses']) => {
  return {
    ...localhost,
    contracts: {
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
    },
    subgraphs: {
      ens: {
        url: 'http://localhost:8000/subgraphs/name/graphprotocol/ens',
      },
    },
  } as const
}

export const localhostWithEns = makeLocalhostWithEns(deploymentAddresses)

export const mainnetWithEns = addEnsContracts(mainnet)
export const goerliWithEns = addEnsContracts(goerli)
export const sepoliaWithEns = addEnsContracts(sepolia)
export const holeskyWithEns = addEnsContracts(holesky)

export const chainsWithEns = [
  mainnetWithEns,
  goerliWithEns,
  sepoliaWithEns,
  holeskyWithEns,
  localhostWithEns,
] as const

export const getSupportedChainById = (chainId: number | undefined) =>
  chainId ? chainsWithEns.find((c) => c.id === chainId) : undefined

export type SupportedChain =
  | typeof mainnetWithEns
  | typeof goerliWithEns
  | typeof sepoliaWithEns
  | typeof holeskyWithEns
  | typeof localhostWithEns
