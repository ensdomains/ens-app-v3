import { render, waitFor } from '@app/test-utils'

import { QueryClientProvider, useQuery } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { WagmiProvider } from 'wagmi'

import { queryClient } from './reactQuery'
import { wagmiConfig } from './wagmi'

const mockFetchData = vi.fn().mockResolvedValue('Test data')

const TestComponentWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

const TestComponentWithHook = () => {
  const { data, isFetching } = useQuery({
    queryKey: ['test-hook'],
    queryFn: mockFetchData,
    enabled: true,
  })

  return (
    <div data-testid="test">{isFetching ? <span>Loading...</span> : <span>Data: {data}</span>}</div>
  )
}

describe('reactQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    queryClient.clear()
  })

  afterEach(() => {
    queryClient.clear()
  })

  it('should create a query client with default options', () => {
    expect(queryClient.getDefaultOptions()).toEqual({
      queries: {
        refetchOnWindowFocus: true,
        refetchOnMount: 'always',
        staleTime: 1_000 * 12,
        gcTime: 1_000 * 60 * 60 * 24,
        queryKeyHashFn: expect.any(Function),
      },
    })
  })

  it('should not refetch query on rerender', async () => {
    const { getByTestId, rerender } = render(
      <TestComponentWrapper>
        <TestComponentWithHook />
      </TestComponentWrapper>,
    )

    await waitFor(() => {
      expect(mockFetchData).toHaveBeenCalledTimes(1)
      expect(getByTestId('test')).toHaveTextContent('Test data')
    })

    rerender(
      <TestComponentWrapper>
        <TestComponentWithHook />
      </TestComponentWrapper>,
    )

    await waitFor(() => {
      expect(mockFetchData).toHaveBeenCalledTimes(1)
    })
  })

  it('should refetch query on mount', async () => {
    const { getByTestId, unmount } = render(
      <TestComponentWrapper>
        <TestComponentWithHook />
      </TestComponentWrapper>,
    )

    await waitFor(() => {
      expect(mockFetchData).toHaveBeenCalledTimes(1)
      expect(getByTestId('test')).toHaveTextContent('Test data')
    })

    unmount()
    const { getByTestId: getByTestId2 } = render(
      <TestComponentWrapper>
        <TestComponentWithHook />
      </TestComponentWrapper>,
    )

    await waitFor(() => {
      expect(mockFetchData).toHaveBeenCalledTimes(2)
      expect(getByTestId2('test')).toHaveTextContent('Test data')
    })
  })
})
