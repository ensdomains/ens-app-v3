import { inAppWalletConnector } from '@thirdweb-dev/wagmi-adapter'
import { createThirdwebClient, defineChain as thirdwebDefineChain } from 'thirdweb'
import { createClient, type FallbackTransport, type HttpTransport, type Transport } from 'viem'
import { createConfig, createStorage, fallback, http } from 'wagmi'
import { holesky, localhost, mainnet, sepolia } from 'wagmi/chains'

import { ccipRequest } from '@ensdomains/ensjs/utils'

import { getChainsFromUrl, SupportedChain } from '@app/constants/chains'

import { isInsideSafe } from '../safe'
import { rainbowKitConnectors } from './wallets'

const isLocalProvider = !!process.env.NEXT_PUBLIC_PROVIDER

const thirdwebClientId =
  process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || '4e8c81182c3709ee441e30d776223354'
const unicornFactoryAddress =
  process.env.NEXT_PUBLIC_NEXT_PUBLIC_UNICORN_FACTORY_ADDRESS ||
  '0xD771615c873ba5a2149D5312448cE01D677Ee48A'

// Create Thirdweb Client
const client = createThirdwebClient({
  clientId: thirdwebClientId,
})

// Create the Unicorn Wallet Connector (using Thirdweb In-App Wallet)
// Note: The chain specified here is for the smart account functionality as per Unicorn docs.
const unicornConnector = inAppWalletConnector({
  client,
  smartAccount: {
    sponsorGas: true, // or false based on your needs / Unicorn requirements
    chain: thirdwebDefineChain(mainnet.id),
    factoryAddress: unicornFactoryAddress,
  },
})

const infuraKey = process.env.NEXT_PUBLIC_INFURA_KEY || 'cfa6ae2501cc4354a74e20432507317c'
const tenderlyKey = process.env.NEXT_PUBLIC_TENDERLY_KEY || '4imxc4hQfRjxrVB2kWKvTo'
const drpcKey = process.env.NEXT_PUBLIC_DRPC_KEY || 'AnmpasF2C0JBqeAEzxVO8aRuvzLTrWcR75hmDonbV6cR'

export const infuraUrl = (chainName: string) => `https://${chainName}.infura.io/v3/${infuraKey}`
const tenderlyUrl = (chainName: string) => `https://${chainName}.gateway.tenderly.co/${tenderlyKey}`
const drpcUrl = (chainName: string) =>
  `https://lb.drpc.org/ogrpc?network=${
    chainName === 'mainnet' ? 'ethereum' : chainName
  }&dkey=${drpcKey}`

type SupportedUrlFunc = typeof infuraUrl | typeof drpcUrl | typeof tenderlyUrl

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

export const prefix = 'wagmi'

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

export const transports = {
  ...(isLocalProvider
    ? ({
        [localhost.id]: http(process.env.NEXT_PUBLIC_PROVIDER!) as unknown as FallbackTransport,
      } as const)
    : ({} as unknown as {
        // this is a hack to make the types happy, dont remove pls
        [localhost.id]: HttpTransport
      })),
  [mainnet.id]: initialiseTransports('mainnet', [drpcUrl, infuraUrl, tenderlyUrl]),
  [sepolia.id]: initialiseTransports('sepolia', [drpcUrl, infuraUrl, tenderlyUrl]),
  [holesky.id]: initialiseTransports('holesky', [drpcUrl, tenderlyUrl]),
} as const

const chains = getChainsFromUrl() as unknown as readonly [SupportedChain, ...SupportedChain[]]

const combinedConnectors = [unicornConnector, ...rainbowKitConnectors]

const wagmiConfig_ = createConfig({
  syncConnectedChain: false,
  connectors: combinedConnectors,
  ssr: true,
  multiInjectedProviderDiscovery: !isInsideSafe(),
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

export const wagmiConfig = wagmiConfig_ as typeof wagmiConfig_ & {
  _isEns: true
}

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig
  }
}
