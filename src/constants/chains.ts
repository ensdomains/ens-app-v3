import { match } from 'ts-pattern'
import { holesky, localhost, mainnet, sepolia } from 'viem/chains'

import { addEnsContracts } from '@ensdomains/ensjs'

import type { Register } from '@app/local-contracts'
import { addEnsContractsWithSubgraph } from '@app/utils/chains/addEnsContractsWithSubgraph'
import { makeLocalhostChainWithEns } from '@app/utils/chains/makeLocalhostChainWithEns'

const isLocalProvider = !!process.env.NEXT_PUBLIC_PROVIDER

export const deploymentAddresses = JSON.parse(
  process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES || '{}',
) as Register['deploymentAddresses']

export const localhostWithEns = makeLocalhostChainWithEns<typeof localhost>(
  localhost,
  deploymentAddresses,
)

const ENS_SUBGRAPH_API_KEY = '9ad5cff64d93ed2c33d1a57b3ec03ea9'

export const mainnetWithEns = addEnsContractsWithSubgraph({
  chain: mainnet,
  subgraphId: '5XqPmWe6gjyrJtFn9cLy237i4cWw2j9HcUJEXsP5qGtH',
  apiKey: ENS_SUBGRAPH_API_KEY,
})

export const sepoliaWithEnsBase = addEnsContractsWithSubgraph({
  chain: sepolia,
  subgraphId: 'G1SxZs317YUb9nQX3CC98hDyvxfMJNZH5pPRGpNrtvwN',
  apiKey: ENS_SUBGRAPH_API_KEY,
})

export const sepoliaWithEns = {
  ...sepoliaWithEnsBase,
  contracts: {
    ...sepoliaWithEnsBase.contracts,
    ensEthRegistrarController: { address: '0xFED6a969AaA60E4961FCD3EBF1A2e8913ac65B72' as const },
    ensPublicResolver: { address: '0x8FADE66B79cC9f707aB26799354482EB93a5B7dD' as const },
    ensReverseRegistrar: { address: '0xA0a1AbcDAe1a2a4A2EF8e9113Ff0e02DD81DC0C6' as const },
  },
} as unknown as typeof sepoliaWithEnsBase

export const holeskyWithEnsBase = addEnsContracts(holesky)

export const holeskyWithEns = {
  ...holeskyWithEnsBase,
  contracts: {
    ...holeskyWithEnsBase.contracts,
    ensEthRegistrarController: { address: '0x179Be112b24Ad4cFC392eF8924DfA08C20Ad8583' as const },
    ensPublicResolver: { address: '0x9010A27463717360cAD99CEA8bD39b8705CCA238' as const },
    ensReverseRegistrar: { address: '0x132AC0B116a73add4225029D1951A9A707Ef673f ' as const },
  },
} as unknown as typeof holeskyWithEnsBase

export const chainsWithEns = [
  mainnetWithEns,
  sepoliaWithEns,
  holeskyWithEns,
  localhostWithEns,
] as const

export const getSupportedChainById = (chainId: number | undefined) =>
  chainId ? chainsWithEns.find((c) => c.id === chainId) : undefined

export type SupportedChain =
  | typeof mainnetWithEns
  | typeof sepoliaWithEns
  | typeof holeskyWithEns
  | typeof localhostWithEns

export const getChainsFromUrl = () => {
  if (typeof window === 'undefined') {
    return [
      ...(isLocalProvider ? ([localhostWithEns] as const) : ([] as const)),
      holeskyWithEns,
      mainnetWithEns,
      sepoliaWithEns,
    ]
  }

  const { hostname } = window.location
  const segments = hostname.split('.')

  // Chain override
  const chain = process.env.NEXT_PUBLIC_CHAIN_NAME
  if (chain === 'holesky') return [holeskyWithEns]
  if (chain === 'sepolia') return [sepoliaWithEns]
  if (chain === 'mainnet') return [mainnetWithEns]

  // Previews
  if (segments.length === 4) {
    /* Used for testing preview on mainnet at: test.app.ens.domains. Update by configuring dns */
    if (segments[0] === 'test') {
      return [mainnetWithEns]
    }
    if (segments.slice(1).join('.') === 'ens-app-v3.pages.dev') {
      return [sepoliaWithEns]
    }
  }

  // Dev environment
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    if (isLocalProvider) return [localhostWithEns]
    return [sepoliaWithEns]
  }

  return match(segments[0])
    .with('sepolia', () => [sepoliaWithEns])
    .with('holesky', () => [holeskyWithEns])
    .otherwise(() => [mainnetWithEns])
}
