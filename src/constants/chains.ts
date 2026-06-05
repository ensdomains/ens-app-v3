import { match } from 'ts-pattern'
import { localhost, mainnet, sepolia } from 'viem/chains'

import type { Register } from '@app/local-contracts'
import { makeLocalhostChainWithEnsAndOverrides } from '@app/overrides/makeLocalhostChainWithEnsAndOverrides'

export const deploymentAddresses = JSON.parse(
  process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES || '{}',
) as Register['deploymentAddresses']

export const localhostWithEns = makeLocalhostChainWithEnsAndOverrides<typeof localhost>(
  localhost,
  deploymentAddresses,
)

// SNRC on Sepolia and mainnet are our own ENS-shaped stacks (not the
// canonical ENS deployments on those networks). The contracts are written
// by deploy-testnet.mjs / deploy-mainnet.mjs and injected here via
// build-time env vars.
export const sepoliaDeploymentAddresses = JSON.parse(
  process.env.NEXT_PUBLIC_SEPOLIA_DEPLOYMENT_ADDRESSES || '{}',
) as Register['deploymentAddresses']

export const mainnetDeploymentAddresses = JSON.parse(
  process.env.NEXT_PUBLIC_MAINNET_DEPLOYMENT_ADDRESSES || '{}',
) as Register['deploymentAddresses']

export const sepoliaWithEns = makeLocalhostChainWithEnsAndOverrides<typeof sepolia>(
  sepolia,
  sepoliaDeploymentAddresses,
)

export const mainnetWithEns = makeLocalhostChainWithEnsAndOverrides<typeof mainnet>(
  mainnet,
  mainnetDeploymentAddresses,
)

// Pick the SNRC contract bundle (controller, registrar, etc.) for a given
// chain. Used by hooks that talk to the SimplexController.
export const getSnrcAddresses = (chainId: number | undefined) => {
  if (chainId === 1) return mainnetDeploymentAddresses
  if (chainId === 11155111) return sepoliaDeploymentAddresses
  return deploymentAddresses
}

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
