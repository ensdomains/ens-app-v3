import '@rainbow-me/rainbowkit/styles.css'

import { DefaultOptions, QueryClient } from '@tanstack/react-query'
import { createConfig, fallback, http } from 'wagmi'
import { Chain, goerli, localhost, mainnet, sepolia } from 'wagmi/chains'

import {
  goerliWithEns,
  localhostWithEns,
  mainnetWithEns,
  sepoliaWithEns,
} from '@app/constants/chains'
import { makePersistent } from '@app/utils/persist'

import { WC_PROJECT_ID } from './constants'
import { getDefaultWallets } from './getDefaultWallets'

// // fallback cloudflare gateway if infura is down or for IPFS
// providerArray.push(
//   jsonRpcProvider({
//     rpc: (c) => ({
//       http: `https://web3.ens.domains/v1/${c.network === 'homestead' ? 'mainnet' : c.network}`,
//     }),
//   }),
// )

const chainsWithEns = process.env.NEXT_PUBLIC_PROVIDER
  ? [localhostWithEns]
  : [mainnetWithEns, goerliWithEns, sepoliaWithEns]

const connectors = getDefaultWallets({
  appName: 'ENS',
  projectId: WC_PROJECT_ID,
  chains: chainsWithEns as Chain[],
})

const transports = {
  [mainnet.id]: fallback([
    http(process.env.NEXT_PUBLIC_PROVIDER!),
    http(
      `https://mainnet.infura.io/v3/${
        process.env.NEXT_PUBLIC_INFURA_KEY || 'cfa6ae2501cc4354a74e20432507317c'
      }`,
    ),
  ]),
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 0,
    },
  },
})

export const wagmiConfig = createConfig({
  connectors,
  chains: chainsWithEns as unknown as [Chain, ...Chain[]],
  transports,
})

makePersistent(queryClient)

export const refetchOptions: DefaultOptions<Error> = {
  queries: {
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60,
    staleTime: 1000 * 120,
    meta: {
      isRefetchQuery: true,
    },
    refetchOnMount: 'always',
  },
}

export const queryClientWithRefetch = new QueryClient({
  queryCache: queryClient.getQueryCache(),
  defaultOptions: refetchOptions,
  mutationCache: queryClient.getMutationCache(),
})

export const wagmiConfigWithRefetch = createConfig({
  connectors,
  chains: chainsWithEns as unknown as [Chain, ...Chain[]],
  transports,
})

export { chainsWithEns as chains }
