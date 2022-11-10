/* eslint-disable import/no-extraneous-dependencies */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RenderOptions, render } from '@testing-library/react'
import { RenderHookOptions, renderHook } from '@testing-library/react-hooks'
import userEvent from '@testing-library/user-event'
import { Web3Modal } from '@web3modal/react'
import React, { FC, ReactElement } from 'react'
import { ThemeProvider } from 'styled-components'

import { ThorinGlobalStyles, lightTheme } from '@ensdomains/thorin'

jest.mock('@web3modal/react', () => {
  return {
    ...jest.requireActual('@tanstack/react-query'),
    useAccount: jest.fn(),
    useNetwork: jest.fn(),
    useProvider: jest.fn(),
    useSigner: jest.fn(),
    useSignTypedData: jest.fn(),
    useBlockNumber: jest.fn(),
    useSendTransaction: jest.fn(),
  }
})

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

const config = {
  projectId: 'cfb005f7419ba8ced7ab20955a7c252a',
  theme: 'dark' as const,
  accentColor: 'default' as const,
  ethereum: {
    appName: 'ens',
    autoConnect: true,
  },
}

const AllTheProviders: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lightTheme}>
        <ThorinGlobalStyles />
        {children}
      </ThemeProvider>
      <Web3Modal config={config} />
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
