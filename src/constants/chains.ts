import { match } from 'ts-pattern'
import { holesky } from 'viem/chains'
import { localhost, mainnet, sepolia } from 'wagmi/chains'

import { addEnsContracts } from '@ensdomains/ensjs'

import type { Register } from '@app/local-contracts'
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

export const mainnetWithEns = {
  ...addEnsContracts(mainnet),
  subgraphs: {
    ens: {
      url: `https://gateway-arbitrum.network.thegraph.com/api/${ENS_SUBGRAPH_API_KEY}/subgraphs/id/5XqPmWe6gjyrJtFn9cLy237i4cWw2j9HcUJEXsP5qGtH`,
    },
  },
}
export const sepoliaWithEns = addEnsContracts(sepolia)
export const holeskyWithEns = addEnsContracts(holesky)

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

  // Previews
  if (segments.length === 4) {
    /* Used for testing preview on mainnet at: test.app.ens.domains. Update by configuring dns */
    if (segments[0] === 'test') {
      return [mainnetWithEns]
    }
    if (segments.slice(1).join('.') === 'ens-app-v3.pages.dev') {
      return [holeskyWithEns]
    }
  }

  // Dev environment
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    if (isLocalProvider) return [localhostWithEns]
    return [holeskyWithEns]
  }

  return match(segments[0])
    .with('sepolia', () => [
      sepoliaWithEns,
    ])
    .with('holesky', () => [
      holeskyWithEns,
    ])
    .otherwise(() => [
      mainnetWithEns,
    ])
}
