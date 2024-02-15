/* eslint-disable import/no-extraneous-dependencies */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, renderHook, RenderHookOptions, RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockConnector } from '@wagmi/core/connectors/mock'
import React, { FC, ReactElement } from 'react'
import { ThemeProvider } from 'styled-components'
import { createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'
import { beforeEach, expect, MockedFunction, vi } from 'vitest'
import { createConfig, WagmiConfig } from 'wagmi'

import { lightTheme, ThorinGlobalStyles } from '@ensdomains/thorin'

import { DeepPartial } from './types'

// @ts-ignore: Unreachable code error
// eslint-disable-next-line no-extend-native, func-names
BigInt.prototype.toJSON = function () {
  return this.toString()
}

window.scroll = vi.fn() as (opts?: ScrollOptions) => void

vi.mock('@app/hooks/useRegistrationReducer', () => vi.fn(() => ({ item: { stepIndex: 0 } })))
vi.mock('@app/hooks/chain/useChainId', () => ({ useChainId: () => 1 }))

export const mockUseAccountReturnValue = { address: '0x123' }

vi.mock('wagmi', async () => {
  const {
    useQuery,
    useQueryClient,
    useInfiniteQuery,
    useMutation,
    createConfig: _createConfig,
    WagmiConfig: _WagmiConfig,
  } = await vi.importActual('wagmi')

  return {
    useQuery,
    useQueryClient,
    useInfiniteQuery,
    useMutation,
    createConfig: _createConfig,
    WagmiConfig: _WagmiConfig,
    useAccount: vi.fn(() => mockUseAccountReturnValue),
    useBalance: vi.fn(() => ({ data: { value: { lt: () => false } } })),
    useNetwork: vi.fn(() => ({ chainId: 1 })),
    useFeeData: vi.fn(),
    useWalletClient: vi.fn(),
    usePrepareContractWrite: vi.fn(),
    usePublicClient: vi.fn(),
    useSignTypedData: vi.fn(),
    useBlockNumber: vi.fn(),
    useSendTransaction: vi.fn(),
    useEnsAvatar: vi.fn(() => ({ data: undefined })),
    configureChains: vi.fn(() => ({})),
  }
})

vi.mock('react-i18next', () => ({
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

const privateKeyAccount = privateKeyToAccount(
  // eslint-disable-next-line no-restricted-syntax
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
)
const publicClient = createPublicClient({ transport: http('http://mock.local'), chain: mainnet })

const wagmiConfig = createConfig({
  connectors: [
    new MockConnector({
      options: {
        walletClient: createWalletClient({
          account: privateKeyAccount,
          transport: http('http://mock.local'),
        }),
      },
    }) as any,
  ],
  publicClient: () => publicClient,
})

vi.mock('@app/utils/query', () => ({
  wagmiConfigWithRefetch: wagmiConfig,
}))

const AllTheProviders: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
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

export type MockHookData<THookFn extends (...args: any[]) => { data: any }> = DeepPartial<
  ReturnType<THookFn>['data']
>

export const expectEnabledHook = (fn: PartialMockedFunction<any>, enabled: boolean) =>
  expect(fn).toHaveBeenCalledWith(expect.objectContaining({ enabled }))

export const mockFunction = <T extends (...args: any) => any>(func: T) =>
  func as unknown as MockedFunction<PartialMockedFunction<T>>

export * from '@testing-library/react'
export { customRender as render, customRenderHook as renderHook, userEvent }
