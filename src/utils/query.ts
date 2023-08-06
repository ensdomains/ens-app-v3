import '@rainbow-me/rainbowkit/styles.css'
import { DefaultOptions, QueryClient } from '@tanstack/react-query'
import { Address, Chain, ChainProviderFn, configureChains, createClient } from 'wagmi'
import { goerli, localhost, mainnet } from 'wagmi/chains'
import { infuraProvider } from 'wagmi/providers/infura'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

import { makePersistent } from '@app/utils/persist'

import { WC_PROJECT_ID } from './constants'
import { getDefaultWallets } from './getDefaultWallets'

const providerArray: ChainProviderFn<typeof mainnet | typeof goerli | typeof localhost>[] = []

const ensAddress: Address = '0x0A6d64413c07E10E890220BBE1c49170080C6Ca0'
export const ewc: Chain = {
  id: 246,
  name: 'Energy Web Chain',
  network: 'ewc',
  nativeCurrency: { name: 'EWT', symbol: 'EWT', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.energyweb.org/'],
    },
    public: {
      http: ['https://rpc.energyweb.org/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Energy Web Chain Explorer',
      url: 'https://explorer.energyweb.org',
    },
  },
  contracts: {
    ensRegistry: {
      address: ensAddress,
    },
  },
}

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
      rpc: (c) => ({
        http: `https://web3.ens.domains/v1/${c.network === 'homestead' ? 'mainnet' : c.network}`,
      }),
    }),
  )
}

const ewcProvider = jsonRpcProvider({
  rpc: () => ({
    http: 'https://rpc.energyweb.org/',
  }),
})
const { provider, chains } = configureChains([ewc], [ewcProvider])

const connectors = getDefaultWallets({
  appName: 'ENS',
  projectId: WC_PROJECT_ID,
  chains,
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 0,
    },
  },
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
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

const wagmiClientWithRefetch = createClient({
  autoConnect: true,
  connectors,
  provider,
  queryClient: queryClientWithRefetch,
  persister: null,
})

export { chains, queryClient, wagmiClient, wagmiClientWithRefetch }
