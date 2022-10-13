/* eslint-disable import/no-extraneous-dependencies */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RenderOptions, render } from '@testing-library/react'
import { RenderHookOptions, renderHook } from '@testing-library/react-hooks'
import userEvent from '@testing-library/user-event'
import { Provider, WebSocketProvider, allChains, chain as chain_, defaultChains } from '@wagmi/core'
import { MockConnector } from '@wagmi/core/connectors/mock'
import { providers } from 'ethers'
import { Wallet } from 'ethers/lib/ethers'
import React, { FC, ReactElement } from 'react'
import { ThemeProvider } from 'styled-components'
import { Chain, CreateClientConfig, WagmiConfig, createClient } from 'wagmi'

import { ThorinGlobalStyles, lightTheme } from '@ensdomains/thorin'

jest.mock('wagmi', () => {
  const { useQuery, useInfiniteQuery, createClient, WagmiConfig } = jest.requireActual('wagmi')

  return {
    useQuery,
    useInfiniteQuery,
    createClient,
    WagmiConfig,
    useAccount: jest.fn(),
    useNetwork: jest.fn(),
    useProvider: jest.fn(),
    useSigner: jest.fn(),
    useSignTypedData: jest.fn(),
    useBlockNumber: jest.fn(),
    useSendTransaction: jest.fn(),
  }
})

jest.mock('@app/components/@molecules/NFTTemplate', () => () => <div data-testid="nft-template" />)

console.log('createclient', createClient)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: Infinity,
      retry: false,
    },
  },
  logger: {
    log: console.log,
    warn: console.warn,
    error: () => {},
  },
})

beforeEach(() => queryClient.clear())

export const accounts = [
  {
    privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    balance: '10000000000000000000000',
  },
]

const foundryMainnet: Chain = {
  ...chain_.mainnet,
  rpcUrls: chain_.foundry.rpcUrls,
}

const testChains = [foundryMainnet, ...allChains]

export function getNetwork(chain: Chain) {
  return {
    chainId: chain.id,
    ensAddress: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    name: chain.name,
  }
}

class EthersProviderWrapper extends providers.StaticJsonRpcProvider {
  toJSON() {
    return `<Provider network={${this.network.chainId}} />`
  }
}

// export class WalletSigner extends Wallet {
//   connectUnchecked(): providers.JsonRpcSigner {
//     const uncheckedSigner = (<EthersProviderWrapper>(
//       this.provider
//     )).getUncheckedSigner(this.address)
//     return uncheckedSigner
//   }
// }

export function getProvider({
  chains = testChains,
  chainId,
}: { chains?: Chain[]; chainId?: number } = {}) {
  const chain = testChains.find((x) => x.id === chainId) ?? foundryMainnet
  const url = foundryMainnet.rpcUrls.default
  const provider = new EthersProviderWrapper(url, getNetwork(chain))
  provider.pollingInterval = 1_000
  return Object.assign(provider, { chains })
}

export function getSigners() {
  const provider = getProvider()
  return accounts.map((x) => new Wallet(x.privateKey, provider))
}

type Config = Partial<CreateClientConfig>

export function setupClient(config: Config = {}) {
  return createClient<Provider, WebSocketProvider>({
    connectors: [
      new MockConnector({
        options: {
          signer: getSigners()[0]!,
        },
      }),
    ],
    provider: ({ chainId }) => getProvider({ chainId, chains: defaultChains }),
    ...config,
  })
}

const wagmiClient = createClient<Provider, WebSocketProvider>({
  connectors: [
    new MockConnector({
      options: {
        signer: getSigners()[0]!,
      },
    }),
  ],
  provider: ({ chainId }) => getProvider({ chainId, chains: defaultChains }),
  queryClient,
})

const AllTheProviders: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig client={wagmiClient}>
        <ThemeProvider theme={lightTheme}>
          <ThorinGlobalStyles />
          {children}
        </ThemeProvider>
      </WagmiConfig>
    </QueryClientProvider>
  )
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options })

const customRenderHook = <TProps, TResult>(
  callback: (props: TProps) => TResult,
  options?: Omit<RenderHookOptions<TProps>, 'wrapper'>,
) => renderHook(callback, { wrapper: AllTheProviders as any, ...options })

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

export type PartialMockedFunction<T extends (...args: any) => any> = (
  ...args: Parameters<T>
) => DeepPartial<ReturnType<T>>

export const mockFunction = <T extends (...args: any) => any>(func: T) =>
  func as unknown as jest.MockedFunction<PartialMockedFunction<T>>

export * from '@testing-library/react'
export { customRender as render }
export { customRenderHook as renderHook }
export { userEvent }
