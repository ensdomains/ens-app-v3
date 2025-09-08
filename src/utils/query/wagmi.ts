import {
  createClient,
  formatTransactionRequest,
  type ExactPartial,
  type FallbackTransport,
  type HttpTransport,
  type TransactionRequest,
  type TransactionType,
  type Transport,
} from 'viem'
import { createConfig, createStorage, fallback, http } from 'wagmi'
import { holesky, localhost, mainnet, sepolia } from 'wagmi/chains'

import { ccipRequest } from '@ensdomains/ensjs/utils'

import { getChainsFromUrl, SupportedChain } from '@app/constants/chains'

import { isInsideSafe } from '../safe'
import { rainbowKitConnectors } from './wallets'

const isLocalProvider = !!process.env.NEXT_PUBLIC_PROVIDER

const tenderlyKey = process.env.NEXT_PUBLIC_TENDERLY_KEY || '4imxc4hQfRjxrVB2kWKvTo'
const drpcKey = process.env.NEXT_PUBLIC_DRPC_KEY || 'AnmpasF2C0JBqeAEzxVO8aRuvzLTrWcR75hmDonbV6cR'

const tenderlyUrl = (chainName: string) => `https://${chainName}.gateway.tenderly.co/${tenderlyKey}`
export const drpcUrl = (chainName: string) =>
  `https://lb.drpc.org/ogrpc?network=${
    chainName === 'mainnet' ? 'ethereum' : chainName
  }&dkey=${drpcKey}`

type SupportedUrlFunc = typeof drpcUrl | typeof tenderlyUrl

const initialiseTransports = <const UrlFuncArray extends SupportedUrlFunc[]>(
  chainName: string,
  urlFuncArray: UrlFuncArray,
) => {
  const transportArray: HttpTransport[] = []

  for (const urlFunc of urlFuncArray) transportArray.push(http(urlFunc(chainName)))

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
  [mainnet.id]: initialiseTransports('mainnet', [drpcUrl, tenderlyUrl]),
  [sepolia.id]: initialiseTransports('sepolia', [drpcUrl, tenderlyUrl]),
  [holesky.id]: initialiseTransports('holesky', [drpcUrl, tenderlyUrl]),
} as const

// This is a workaround to fix MetaMask defaulting to the wrong transaction type
// when no type is specified, but an access list is provided.
// See: https://github.com/MetaMask/core/issues/5720
// Viem by default doesn't include the type in a TransactionRequest, because it's generally not required.
// To fix the MetaMask issue, we need to include it. However, we don't want to break other wallets, so we only add it
// for MetaMask.
// Viem will use a chain specific transactionRequest formatter if provided, so we can utilise this to
// add `type`.
// References to the formatter are:
// 1. Call to `extract` with all extra parameters (i.e. unused by call by default), and the chain specific formatter
//   a. If a formatter is not provided, the function returns `{}` (existing behaviour)
//   b. If a formatter is provided, returns the formatted extra parameters
// 2. Call to chain specific formatter if provided, otherwise `formatTransactionRequest`, with the request and the formatted extra parameters
//
// We want to capture only the first call, so `type` is added to the final request object without
// modifying existing behaviour.
const formatExtraTransactionRequestParameters = (
  request:
    | { type: TransactionType }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    | { type: TransactionType; __is_metamask: boolean }
    | ExactPartial<TransactionRequest>,
) => {
  // 1: Call will never have `from`
  if (!('from' in request)) {
    // 1a: Default behaviour when not MetaMask
    if (!('__is_metamask' in request) || !request.__is_metamask) return {}
    // 1b: Add `type` to the request
    return {
      type: request.type,
    }
  }
  // 2: Standard call to formatter
  return formatTransactionRequest(request)
}

const chains = getChainsFromUrl().map((c) => ({
  ...c,
  formatters: {
    ...(c.formatters || {}),
    transactionRequest: {
      format: formatExtraTransactionRequestParameters,
    },
  },
})) as unknown as readonly [SupportedChain, ...SupportedChain[]]

const wagmiConfig_ = createConfig({
  syncConnectedChain: false,
  connectors: rainbowKitConnectors,
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
