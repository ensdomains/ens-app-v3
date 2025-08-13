import { match } from 'ts-pattern'
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  holesky,
  linea,
  lineaSepolia,
  mainnet,
  optimism,
  optimismSepolia,
  scroll,
  scrollSepolia,
  sepolia,
} from 'viem/chains'

import { evmChainIdToCoinType } from '@ensdomains/address-encoder/utils'

import { getNetworkFromUrl } from './chains'

const network = getNetworkFromUrl()

export type Network = {
  name: string
  chainId: number
  coinType: number
}

const defaultNetwork = {
  name: 'default',
  chainId: 0,
  coinType: evmChainIdToCoinType(0),
} satisfies Network

const mainnetNetworks = [
  {
    name: 'arb1',
    chainId: arbitrum.id,
    coinType: evmChainIdToCoinType(arbitrum.id),
  },
  {
    name: 'base',
    chainId: base.id,
    coinType: evmChainIdToCoinType(base.id),
  },
  {
    name: 'op',
    chainId: optimism.id,
    coinType: evmChainIdToCoinType(optimism.id),
  },
  {
    name: 'linea',
    chainId: linea.id,
    coinType: evmChainIdToCoinType(linea.id),
  },
  {
    name: 'scr',
    chainId: scroll.id,
    coinType: evmChainIdToCoinType(scroll.id),
  },
] satisfies Network[]

export const testnetNetworks = [
  {
    name: 'arb1-sep',
    chainId: arbitrumSepolia.id,
    coinType: evmChainIdToCoinType(arbitrumSepolia.id),
  },
  {
    name: 'base-sep',
    chainId: baseSepolia.id,
    coinType: evmChainIdToCoinType(baseSepolia.id),
  },
  {
    name: 'op-sep',
    chainId: optimismSepolia.id,
    coinType: evmChainIdToCoinType(optimismSepolia.id),
  },
  {
    name: 'linea-sep',
    chainId: lineaSepolia.id,
    coinType: evmChainIdToCoinType(lineaSepolia.id),
  },
  {
    name: 'scr-sep',
    chainId: scrollSepolia.id,
    coinType: evmChainIdToCoinType(scrollSepolia.id),
  },
]

export const networks = match(network)
  .with(
    'mainnet',
    () =>
      [
        defaultNetwork,
        {
          name: 'eth',
          chainId: mainnet.id,
          coinType: 60,
        },
        ...mainnetNetworks,
      ] satisfies Network[],
  )
  .with('sepolia', () => [
    defaultNetwork,
    {
      name: 'eth',
      chainId: sepolia.id,
      coinType: 60,
    },
    ...testnetNetworks,
  ])
  .otherwise(() => [defaultNetwork, { name: 'eth', chainId: holesky.id, coinType: 60 }])

// NOTE: Remove and switch to testNetworks when address encoder has been updated to support default coin
export const defaultAndTestNetworks = [defaultNetwork, ...testnetNetworks]

console.log(networks)
