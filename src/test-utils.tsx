/* eslint-disable import/no-extraneous-dependencies */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, renderHook, RenderHookOptions, RenderOptions } from '@testing-library/react'
import user from '@testing-library/user-event'
import { mock } from '@wagmi/core'
import React, { FC, ReactElement } from 'react'
import { ThemeProvider } from 'styled-components'
import { beforeEach, expect, MockedFunction, vi } from 'vitest'
import type { Register } from 'wagmi'
import { hashFn } from 'wagmi/query'

import { lightTheme, ThorinGlobalStyles } from '@ensdomains/thorin'

import { mainnetWithEns } from '@app/constants/chains'

import { DeepPartial } from './types'
import { BreakpointProvider, useBreakpoint } from './utils/BreakpointProvider'

vi.mock('./utils/BreakpointProvider', () => ({
  BreakpointProvider: ({ children }: { children: React.ReactNode }) => children,
  useBreakpoint: () => ({ sm: true, md: true, lg: true }),
}))

const { createClient, http } = await vi.importActual<typeof import('viem')>('viem')
const { privateKeyToAccount } =
  await vi.importActual<typeof import('viem/accounts')>('viem/accounts')
const { createConfig, WagmiProvider } = await vi.importActual<typeof import('wagmi')>('wagmi')

window.scroll = vi.fn() as (opts?: ScrollOptions) => void

vi.mock('@app/hooks/useRegistrationReducer', () => vi.fn(() => ({ item: { stepIndex: 0 } })))

export const mockUseAccountReturnValue = { address: '0x123' }

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (value: string, opts: any) => {
      const optsTxt = opts?.value || opts?.count || ''
      return [value, ...(optsTxt ? [optsTxt] : [])].join('.')
    },
    i18n: {
      isInitialized: true,
    },
    ready: true,
  }),
  Trans: ({ i18nKey, values }: { i18nKey: string; values: string[] }) =>
    `${i18nKey} ${values ? Object.values(values).join(', ') : ''}`,
}))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: Infinity,
      retry: false,
      queryKeyHashFn: hashFn,
    },
  },
})

beforeEach(() => queryClient.clear())

const privateKeyAccount = privateKeyToAccount(
  // eslint-disable-next-line no-restricted-syntax
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
)
const client = createClient({
  transport: http('http://mock.local'),
  chain: mainnetWithEns,
})

const wagmiConfig = {
  ...createConfig({
    connectors: [
      mock({
        accounts: [privateKeyAccount.address],
        features: {},
      }),
    ],
    chains: [mainnetWithEns],
    client: () => client,
  }),
  _isEns: true,
} as unknown as Register['config']

vi.mock('@app/utils/query/wagmi', () => ({
  wagmiConfig,
  infuraUrl: () => 'http://infura.io',
}))

const defaultQueries = {
  xs: '(min-width: 360px)',
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
}

const AllTheProviders: FC<{ children: React.ReactNode }> = ({ children }) => {
  const content = (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={lightTheme}>
          <ThorinGlobalStyles />
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )

  // Only wrap with BreakpointProvider if:
  // 1. We're in a browser environment
  // 2. BreakpointProvider is not being mocked
  // 3. We're not testing BreakpointProvider itself
  const isTestingBreakpointProvider =
    React.isValidElement(children) && children.type === BreakpointProvider

  const shouldUseBreakpointProvider =
    typeof window !== 'undefined' &&
    !vi.isMockFunction(useBreakpoint) &&
    !isTestingBreakpointProvider

  return shouldUseBreakpointProvider ? (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={lightTheme}>
          <ThorinGlobalStyles />
          <BreakpointProvider queries={defaultQueries}>{children}</BreakpointProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  ) : (
    content
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

export const expectEnabledHook = <TFn extends (...args: any[]) => any>(fn: TFn, enabled: boolean) =>
  expect(fn).toHaveBeenCalledWith(expect.objectContaining({ enabled }))

export const mockFunction = <T extends (...args: any) => any>(func: T) =>
  func as unknown as MockedFunction<PartialMockedFunction<T>>

export * from '@testing-library/react'

const userEvent = user.setup()

export { customRender as render, customRenderHook as renderHook, userEvent }
