import '@rainbow-me/rainbowkit/styles.css'

import { DefaultOptions, QueryClient } from '@tanstack/react-query'
import { holesky } from 'viem/chains'
import { ChainProviderFn, configureChains, createConfig } from 'wagmi'
import { goerli, localhost, mainnet, sepolia } from 'wagmi/chains'
import { infuraProvider } from 'wagmi/providers/infura'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

import {
  goerliWithEns,
  holeskyWithEns,
  localhostWithEns,
  mainnetWithEns,
  sepoliaWithEns,
} from '@app/constants/chains'
import { makePersistent } from '@app/utils/persist'

import { WC_PROJECT_ID } from './constants'
import { getDefaultWallets } from './getDefaultWallets'

const providerArray: ChainProviderFn<
  typeof mainnet | typeof goerli | typeof localhost | typeof sepolia | typeof holesky
>[] = []
if (process.env.NEXT_PUBLIC_PROVIDER) {
  // for local testing
  providerArray.push(
    jsonRpcProvider({
      rpc: () => ({ http: process.env.NEXT_PUBLIC_PROVIDER! }),
    }),
  )
} else {
  if (!process.env.NEXT_PUBLIC_IPFS) {
    // only use infura if we are not using IPFS
    // since we don't want to allow all domains to access infura
    providerArray.push(
      infuraProvider({
        apiKey: process.env.NEXT_PUBLIC_INFURA_KEY || 'cfa6ae2501cc4354a74e20432507317c',
      }),
    )
  }
  // fallback cloudflare gateway if infura is down or for IPFS
  providerArray.push(
    jsonRpcProvider({
      rpc: (c) =>
        c.id === holeskyWithEns.id
          ? null
          : {
              http: `https://web3.ens.domains/v1/${
                c.network === 'homestead' ? 'mainnet' : c.network
              }`,
            },
    }),
  )

  providerArray.push(
    jsonRpcProvider({
      rpc: (c) =>
        c.id === holeskyWithEns.id
          ? { http: 'https://holesky.gateway.tenderly.co/4imxc4hQfRjxrVB2kWKvTo' }
          : null,
    }),
  )
}

const chainsWithEns = process.env.NEXT_PUBLIC_PROVIDER
  ? [localhostWithEns]
  : [mainnetWithEns, goerliWithEns, sepoliaWithEns, holeskyWithEns]

const { publicClient, chains } = configureChains(chainsWithEns, providerArray)

const connectors = getDefaultWallets({
  appName: 'ENS',
  projectId: WC_PROJECT_ID,
  chains,
})

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 0,
    },
  },
})

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  queryClient,
  persister: null,
})

makePersistent(queryClient)

export const refetchOptions: DefaultOptions<unknown> = {
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

const queryClientWithRefetch = new QueryClient({
  queryCache: queryClient.getQueryCache(),
  defaultOptions: refetchOptions,
  mutationCache: queryClient.getMutationCache(),
})

export const wagmiConfigWithRefetch = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  queryClient: queryClientWithRefetch,
  persister: null,
})

export { chains }
