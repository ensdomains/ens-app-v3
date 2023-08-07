/* eslint-disable import/no-extraneous-dependencies */
import { StaticJsonRpcProvider } from '@ethersproject/providers/lib/url-json-rpc-provider'
import { Wallet } from '@ethersproject/wallet'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RenderOptions, render } from '@testing-library/react'
import { RenderHookOptions, renderHook } from '@testing-library/react-hooks'
import userEvent from '@testing-library/user-event'
import { MockConnector } from '@wagmi/core/connectors/mock'
import React, { FC, ReactElement } from 'react'
import { ThemeProvider } from 'styled-components'
import { WagmiConfig, createClient } from 'wagmi'

import { ThorinGlobalStyles, lightTheme } from '@ensdomains/thorin'

import { DeepPartial } from './types'

window.scroll = jest.fn()

jest.mock('@app/hooks/useRegistrationReducer', () => jest.fn(() => ({ item: { stepIndex: 0 } })))
jest.mock('@app/hooks/useChainId', () => ({ useChainId: () => 1 }))

export const mockUseAccountReturnValue = { address: '0x123' }

jest.mock('wagmi', () => {
  const {
    useQuery,
    useQueryClient,
    useInfiniteQuery,
    useMutation,
    createClient: _createClient,
    WagmiConfig: _WagmiConfig,
  } = jest.requireActual('wagmi')

  return {
    useQuery,
    useQueryClient,
    useInfiniteQuery,
    useMutation,
    createClient: _createClient,
    WagmiConfig: _WagmiConfig,
    useAccount: jest.fn(() => mockUseAccountReturnValue),
    useBalance: jest.fn(() => ({ data: { value: { lt: () => false } } })),
    useNetwork: jest.fn(() => ({ chainId: 1 })),
    useFeeData: jest.fn(),
    useProvider: jest.fn(() => ({
      providerConfigs: [{ provider: { send: jest.fn(() => ({ gasUsed: 0, accessList: [] })) } }],
    })),
    useSigner: jest.fn(),
    useSignTypedData: jest.fn(),
    useBlockNumber: jest.fn(),
    useSendTransaction: jest.fn(),
    configureChains: jest.fn(() => ({})),
  }
})

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (value: string, opts: any) => {
      const optsTxt = opts?.value || opts?.count || ''
      return [value, ...(optsTxt ? [optsTxt] : [])].join('.')
    },
    i18n: {
      isInitialized: true,
    },
  }),
  Trans: ({ i18nKey, values }: { i18nKey: string; values: string[] }) =>
    `${i18nKey} ${values ? Object.values(values).join(', ') : ''}`,
}))

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

// eslint-disable-next-line no-restricted-syntax
const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

class EthersProviderWrapper extends StaticJsonRpcProvider {
  toJSON() {
    return `<Provider network={${this.network.chainId}} />`
  }
}

const wagmiClient = createClient({
  connectors: [
    new MockConnector({
      options: {
        signer: new Wallet(privateKey, new EthersProviderWrapper()),
      },
    }) as any,
  ],
  provider: () => new EthersProviderWrapper(),
})

jest.mock('@app/utils/query', () => ({
  wagmiClientWithRefetch: wagmiClient,
}))

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

export type PartialMockedFunction<T extends (...args: any) => any> = (
  ...args: Parameters<T>
) => DeepPartial<ReturnType<T>>

export const mockFunction = <T extends (...args: any) => any>(func: T) =>
  func as unknown as jest.MockedFunction<PartialMockedFunction<T>>

export * from '@testing-library/react'
export { customRender as render }
export { customRenderHook as renderHook }
export { userEvent }
