import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { connectorsForWallets, WalletList } from '@usecapsule/rainbowkit'
import {
  argentWallet,
  braveWallet,
  coinbaseWallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  phantomWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from '@usecapsule/rainbowkit/wallets'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { createClient, type FallbackTransport, type HttpTransport, type Transport } from 'viem'
import { createConfig, createStorage, fallback, http, WagmiProvider } from 'wagmi'
import { goerli, holesky, localhost, mainnet, sepolia } from 'wagmi/chains'

import { ccipRequest } from '@ensdomains/ensjs/utils'

import {
  goerliWithEns,
  holeskyWithEns,
  localhostWithEns,
  mainnetWithEns,
  sepoliaWithEns,
} from '@app/constants/chains'

import { WC_PROJECT_ID } from '../constants'
import { createPersistConfig } from './persist'
import { queryClient } from './reactQuery'

type Props = {
  children: ReactNode
}

const isLocalProvider = !!process.env.NEXT_PUBLIC_PROVIDER

const wallets: WalletList = [
  // injected / not always shown
  injectedWallet,
  safeWallet,
  braveWallet,
  () => ({
    ...phantomWallet(),
    iconUrl: async () => (await import('../../assets/PhantomWallet')).default,
    iconBackground: '#9A8AEE',
    downloadUrls: {},
  }),
  // always shown
  walletConnectWallet,
  rainbowWallet,
  coinbaseWallet,
  metaMaskWallet,
  ledgerWallet,
  argentWallet,
  // capsuleWallet,
]

const infuraKey = process.env.NEXT_PUBLIC_INFURA_KEY || 'cfa6ae2501cc4354a74e20432507317c'
const tenderlyKey = process.env.NEXT_PUBLIC_TENDERLY_KEY || '4imxc4hQfRjxrVB2kWKvTo'

export const infuraUrl = (chainName: string) => `https://${chainName}.infura.io/v3/${infuraKey}`
const cloudflareUrl = (chainName: string) => `https://web3.ens.domains/v1/${chainName}`
const tenderlyUrl = (chainName: string) => `https://${chainName}.gateway.tenderly.co/${tenderlyKey}`

type SupportedUrlFunc = typeof infuraUrl | typeof cloudflareUrl | typeof tenderlyUrl

const initialiseTransports = <const UrlFuncArray extends SupportedUrlFunc[]>(
  chainName: string,
  urlFuncArray: UrlFuncArray,
) => {
  const transportArray: HttpTransport[] = []

  for (const urlFunc of urlFuncArray) {
    // eslint-disable-next-line no-continue
    if (urlFunc === infuraUrl && process.env.NEXT_PUBLIC_IPFS) continue
    transportArray.push(http(urlFunc(chainName)))
  }

  return fallback(transportArray)
}

const prefix = 'wagmi'

const localStorageWithInvertMiddleware = (): Storage | undefined => {
  if (typeof window === 'undefined') return undefined
  const storage = window.localStorage
  const isMatchingKey = (key: string) => {
    if (!key.startsWith(prefix)) return false
    if (!key.endsWith('.disconnected')) return false
    return true
  }
  return {
    ...storage,
    getItem: (key_) => {
      if (!isMatchingKey(key_)) return storage.getItem(key_)

      const key = key_.replace('.disconnected', '.connected')
      const connectedStatus = storage.getItem(key)
      return connectedStatus ? null : 'true'
    },
    removeItem: (key_) => {
      if (!isMatchingKey(key_)) return storage.removeItem(key_)

      const key = key_.replace('.disconnected', '.connected')
      storage.setItem(key, 'true')
    },
    setItem: (key_, value) => {
      if (!isMatchingKey(key_)) return storage.setItem(key_, value)

      const key = key_.replace('.disconnected', '.connected')
      storage.removeItem(key)
    },
  }
}

const chains = [
  ...(isLocalProvider ? ([localhostWithEns] as const) : ([] as const)),
  mainnetWithEns,
  goerliWithEns,
  sepoliaWithEns,
  holeskyWithEns,
] as const

const transports = {
  ...(isLocalProvider
    ? ({
        [localhost.id]: http(process.env.NEXT_PUBLIC_PROVIDER!) as unknown as FallbackTransport,
      } as const)
    : ({} as unknown as {
        // this is a hack to make the types happy, dont remove pls
        [localhost.id]: HttpTransport
      })),
  [mainnet.id]: initialiseTransports('mainnet', [infuraUrl, cloudflareUrl, tenderlyUrl]),
  [sepolia.id]: initialiseTransports('sepolia', [infuraUrl, cloudflareUrl, tenderlyUrl]),
  [goerli.id]: initialiseTransports('goerli', [infuraUrl, cloudflareUrl, tenderlyUrl]),
  [holesky.id]: initialiseTransports('holesky', [tenderlyUrl]),
} as const

export function QueryProviders({ children }: Props) {
  const [_wallets, setWallets] = useState(wallets)

  useEffect(() => {
    ;(async () => {
      try {
        const { capsuleWallet } = await import('../capsuleWallet')
        // So far haven't figured out a way around the timeout
        setTimeout(() => {
          setWallets([...wallets, capsuleWallet])
        }, 1000)
      } catch (error) {
        console.error('Error fetching capsuleWallet:', error)
      }
    })()
  }, [])

  const connectors = useMemo(
    () =>
      connectorsForWallets(
        [
          {
            groupName: 'Popular',
            wallets: _wallets,
          },
        ],
        { appName: 'ENS', projectId: WC_PROJECT_ID },
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [_wallets.length],
  )

  const wagmiConfig = useMemo(() => {
    const wagmiConfig_ = createConfig({
      connectors: connectorsForWallets(
        [
          {
            groupName: 'Popular',
            wallets: _wallets,
          },
        ],
        { appName: 'ENS', projectId: WC_PROJECT_ID },
      ),
      ssr: false, // TODO: CHeck if this is neccessary since usecapsule is client-only
      multiInjectedProviderDiscovery: true,
      storage: createStorage({ storage: localStorageWithInvertMiddleware(), key: prefix }),
      chains,
      client: ({ chain }) => {
        const chainId = chain.id

        return createClient<Transport, typeof chain>({
          chain,
          batch: {
            multicall: {
              batchSize: 8196,
              wait: 50,
            },
          },
          transport: (params) => transports[chainId]({ ...params }),
          ccipRead: {
            request: ccipRequest(chain),
          },
        })
      },
    })

    return wagmiConfig_ as typeof wagmiConfig_ & {
      _isEns: true
    }
  }, [connectors])

  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount={typeof window !== 'undefined'}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={createPersistConfig({ queryClient })}
      >
        {children}
      </PersistQueryClientProvider>
    </WagmiProvider>
  )
}
