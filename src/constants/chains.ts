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

// SNRC on Sepolia is our own ENS-shaped stack (not the canonical ENS Sepolia
// deployment). The contracts are written by `scripts/deploy-testnet.mjs` and
// injected here via the build-time env var.
export const sepoliaDeploymentAddresses = JSON.parse(
  process.env.NEXT_PUBLIC_SEPOLIA_DEPLOYMENT_ADDRESSES || '{}',
) as Register['deploymentAddresses']

export const sepoliaWithEns = makeLocalhostChainWithEnsAndOverrides<typeof sepolia>(
  sepolia,
  sepoliaDeploymentAddresses,
)

// Pick the SNRC contract bundle (controller, registrar, etc.) for a given
// chain. Used by hooks that talk to the SimplexController — they can't
// hard-code one bundle because Sepolia and localhost have different addresses.
export const getSnrcAddresses = (chainId: number | undefined) =>
  chainId === 11155111 ? sepoliaDeploymentAddresses : deploymentAddresses

export const chainsWithEns = [mainnetWithEns, sepoliaWithEns, localhostWithEns] as const

export const getSupportedChainById = (chainId: number | undefined) =>
  chainId ? chainsWithEns.find((c) => c.id === chainId) : undefined

export type SupportedChain =
  | typeof mainnetWithEns
  | typeof sepoliaWithEns
  | typeof localhostWithEns

export const getNetworkFromUrl = (): 'mainnet' | 'sepolia' | 'localhost' | undefined => {
  if (typeof window === 'undefined') return undefined

  const { hostname } = window.location

  // Chain override
  const chain = process.env.NEXT_PUBLIC_CHAIN_NAME
  if (chain === 'sepolia') return 'sepolia' as const
  if (chain === 'mainnet') return 'mainnet' as const

  // Dev environment
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    if (process.env.NEXT_PUBLIC_PROVIDER) return 'localhost' as const
    return 'sepolia' as const
  }

  return undefined
}

export const getChainsFromUrl = () => {
  const network = getNetworkFromUrl()
  return match(network)
    .with('mainnet', () => [mainnetWithEns])
    .with('sepolia', () => [sepoliaWithEns])
    .with('localhost', () => [localhostWithEns])
    .otherwise(() => [sepoliaWithEns])
}
