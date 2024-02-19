import '@rainbow-me/rainbowkit/styles.css'

import { DefaultOptions, QueryClient } from '@tanstack/react-query'
import { HttpTransport, Transport } from 'viem'
import { createConfig, fallback, http } from 'wagmi'
import { Chain, goerli, localhost, mainnet, sepolia } from 'wagmi/chains'

import { ChainWithEns } from '@ensdomains/ensjs/contracts'

import {
  goerliWithEns,
  localhostWithEns,
  mainnetWithEns,
  sepoliaWithEns,
} from '@app/constants/chains'
import { makePersistent } from '@app/utils/persist'

import { WC_PROJECT_ID } from './constants'
import { getDefaultWallets } from './getDefaultWallets'

const chainsWithEns: ChainWithEns[] = process.env.NEXT_PUBLIC_PROVIDER
  ? [localhostWithEns]
  : [mainnetWithEns, goerliWithEns, sepoliaWithEns]

const connectors = getDefaultWallets({
  appName: 'ENS',
  projectId: WC_PROJECT_ID,
  chains: chainsWithEns as Chain[],
})

const initializeTransports = (c: Chain) => {
  const transportArray: HttpTransport[] = []
  if (!process.env.NEXT_PUBLIC_IPFS) {
    // only use infura if we are not using IPFS
    // since we don't want to allow all domains to access infura
    transportArray.push(
      http(
        `https://${c.id === 1 ? 'mainnet' : c.name.toLowerCase()}.infura.io/v3/${
          process.env.NEXT_PUBLIC_INFURA_KEY || 'cfa6ae2501cc4354a74e20432507317c'
        }`,
      ),
    )
  }
  // fallback cloudflare gateway if infura is down or for IPFS
  transportArray.push(
    http(`https://web3.ens.domains/v1/${c.id === 1 ? 'mainnet' : c.name.toLowerCase()}`),
  )

  return fallback(transportArray)
}

const transports: Record<number, Transport> = process.env.NEXT_PUBLIC_PROVIDER
  ? {
      [localhost.id]: http(process.env.NEXT_PUBLIC_PROVIDER!),
    }
  : {
      [mainnet.id]: initializeTransports(mainnet),
      [sepolia.id]: initializeTransports(sepolia),
      [goerli.id]: initializeTransports(goerli),
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
  chains: chainsWithEns as [ChainWithEns, ...ChainWithEns[]],
  transports,
})

export { chainsWithEns as chains }
