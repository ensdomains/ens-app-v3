/* eslint-disable import/no-extraneous-dependencies */
import { lightTheme, ThorinGlobalStyles } from '@ensdomains/thorin'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, RenderOptions } from '@testing-library/react'
import { renderHook, RenderHookOptions } from '@testing-library/react-hooks'
import userEvent from '@testing-library/user-event'
import React, { FC, ReactElement } from 'react'
import { ThemeProvider } from 'styled-components'

jest.mock('wagmi', () => {
  const { useQuery, useInfiniteQuery } = jest.requireActual('wagmi')

  return {
    useQuery,
    useInfiniteQuery,
    useAccount: jest.fn(),
    useNetwork: jest.fn(),
    useProvider: jest.fn(),
    useSigner: jest.fn(),
    useSignTypedData: jest.fn(),
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

const AllTheProviders: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lightTheme}>
        <ThorinGlobalStyles />
        {children}
      </ThemeProvider>
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
