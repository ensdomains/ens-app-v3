import { match } from 'ts-pattern'
import { localhost, mainnet, sepolia } from 'viem/chains'

import type { Register } from '@app/local-contracts'
import { addEnsContractsWithSubgraphAndOverrides } from '@app/overrides/addEnsContractsWithSubgraphAndOverrides'
import { makeLocalhostChainWithEnsAndOverrides } from '@app/overrides/makeLocalhostChainWithEnsAndOverrides'

export const deploymentAddresses = JSON.parse(
  process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES || '{}',
) as Register['deploymentAddresses']

export const localhostWithEns = makeLocalhostChainWithEnsAndOverrides<typeof localhost>(
  localhost,
  deploymentAddresses,
)

const ENS_SUBGRAPH_API_KEY = '9ad5cff64d93ed2c33d1a57b3ec03ea9'

export const mainnetWithEns = addEnsContractsWithSubgraphAndOverrides({
  chain: mainnet,
  subgraphId: '5XqPmWe6gjyrJtFn9cLy237i4cWw2j9HcUJEXsP5qGtH',
  apiKey: ENS_SUBGRAPH_API_KEY,
})

export const sepoliaWithEns = addEnsContractsWithSubgraphAndOverrides({
  chain: sepolia,
  subgraphId: 'G1SxZs317YUb9nQX3CC98hDyvxfMJNZH5pPRGpNrtvwN',
  apiKey: ENS_SUBGRAPH_API_KEY,
})

export const chainsWithEns = [mainnetWithEns, sepoliaWithEns, localhostWithEns] as const

export const getSupportedChainById = (chainId: number | undefined) =>
  chainId ? chainsWithEns.find((c) => c.id === chainId) : undefined

export type SupportedChain = typeof mainnetWithEns | typeof sepoliaWithEns | typeof localhostWithEns

export const getNetworkFromUrl = (): 'mainnet' | 'sepolia' | 'localhost' | undefined => {
  if (typeof window === 'undefined') return undefined

  const { hostname } = window.location
  const segments = hostname.split('.')

  // Chain override
  const chain = process.env.NEXT_PUBLIC_CHAIN_NAME
  if (chain === 'sepolia') return 'sepolia' as const
  if (chain === 'mainnet') return 'mainnet' as const

  // Previews
  if (segments.length === 4) {
    /* Used for testing preview on mainnet at: test.app.ens.domains. Update by configuring dns */
    if (segments[0] === 'test') {
      return 'mainnet' as const
    }
    // TODO: SWITCH BACK TO SEPOLIA LATER
    if (segments.slice(1).join('.') === 'ens-app-v3.pages.dev') {
      return 'mainnet' as const
    }
  }

  // Dev environment
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    if (process.env.NEXT_PUBLIC_PROVIDER) return 'localhost' as const
    return 'sepolia' as const
  }

  return match(segments[0])
    .with('sepolia', () => 'sepolia' as const)
    .otherwise(() => 'mainnet' as const)
}

export const getChainsFromUrl = () => {
  const network = getNetworkFromUrl()
  return match(network)
    .with('mainnet', () => [mainnetWithEns])
    .with('sepolia', () => [sepoliaWithEns])
    .with('localhost', () => [localhostWithEns])
    .otherwise(() => [mainnetWithEns])
}
