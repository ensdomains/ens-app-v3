import { FallbackTransport, HttpTransport } from 'viem'
import { createConfig, createStorage, fallback, http } from 'wagmi'
import { localhost, luksoTestnet } from 'wagmi/chains'

import { localhostWithEns, luksoTestnetWithEns } from '@app/constants/chains'

import { WC_PROJECT_ID } from '../constants'
import { getDefaultWallets } from '../getDefaultWallets'

const isLocalProvider = !!process.env.NEXT_PUBLIC_PROVIDER

const connectors = getDefaultWallets({
  appName: 'UNS',
  projectId: WC_PROJECT_ID,
})

const luksoTestnetRpcURL = 'https://4201.rpc.thirdweb.com'

type SupportedUrlFunc = typeof luksoTestnetRpcURL

const initialiseTransports = <const UrlFuncArray extends SupportedUrlFunc[]>(
  chainName: string,
  urlFuncArray: UrlFuncArray,
) => {
  const transportArray: HttpTransport[] = []

  for (const rpcUrl of urlFuncArray) {
    // eslint-disable-next-line no-continue
    // if (urlFunc === infuraUrl && process.env.NEXT_PUBLIC_IPFS) continue
    transportArray.push(http(rpcUrl))
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
  luksoTestnetWithEns,
] as const

const wagmiConfig_ = createConfig({
  connectors,
  ssr: true,
  multiInjectedProviderDiscovery: true,
  batch: {
    multicall: {
      batchSize: 8196,
      wait: 50,
    },
  },
  storage: createStorage({ storage: localStorageWithInvertMiddleware(), key: prefix }),
  chains,
  transports: {
    ...(isLocalProvider
      ? ({
          [localhost.id]: http(process.env.NEXT_PUBLIC_PROVIDER!) as unknown as FallbackTransport,
        } as const)
      : ({} as unknown as {
          // this is a hack to make the types happy, dont remove pls
          [localhost.id]: HttpTransport
        })),
    [luksoTestnet.id]: initialiseTransports('luksoTestnet', [luksoTestnetRpcURL]),
  },
})

const isSupportedChain = (chainId: number): chainId is (typeof chains)[number]['id'] =>
  chains.some((c) => c.id === chainId)

// hotfix for wagmi bug
wagmiConfig_.subscribe(
  ({ connections, current }) => (current ? connections.get(current)?.chainId : undefined),
  (chainId_) => {
    const chainId = chainId_ || chains[0].id
    // If chain is not configured, then don't switch over to it.
    const isChainConfigured = isSupportedChain(chainId)
    if (!isChainConfigured) return

    return wagmiConfig_.setState((x) => ({
      ...x,
      chainId: chainId ?? x.chainId,
    }))
  },
)

export const wagmiConfig = wagmiConfig_ as typeof wagmiConfig_ & {
  _isEns: true
}

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig
  }
}
