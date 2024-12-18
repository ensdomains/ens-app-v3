import { render, waitFor } from '@app/test-utils'

import { QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren, ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { WagmiProvider } from 'wagmi'

import { queryClient } from './reactQuery'
import { useQuery } from './useQuery'
import { wagmiConfig } from './wagmi'

const mockFetchData = vi.fn().mockResolvedValue('Test data')

const TestComponentWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

const TestComponentWithHook = ({ children, ...props }: PropsWithChildren<{}>) => {
  const { data, isFetching, isLoading } = useQuery({
    queryKey: ['test-hook'],
    queryFn: mockFetchData,
    enabled: true,
  })

  return (
    <div {...props}>
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <span>
          Data: {data}
          {children}
        </span>
      )}
    </div>
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
        refetchOnMount: true,
        staleTime: 0,
        gcTime: 1_000 * 60 * 60 * 24,
        queryKeyHashFn: expect.any(Function),
      },
    })
  })

  it('should not refetch query on rerender', async () => {
    const { getByTestId, rerender } = render(
      <TestComponentWrapper>
        <TestComponentWithHook data-testid="test" />
      </TestComponentWrapper>,
    )

    await waitFor(() => {
      expect(mockFetchData).toHaveBeenCalledTimes(1)
      expect(getByTestId('test')).toHaveTextContent('Test data')
    })

    rerender(
      <TestComponentWrapper>
        <TestComponentWithHook data-testid="test" />
      </TestComponentWrapper>,
    )

    await waitFor(() => {
      expect(getByTestId('test')).toHaveTextContent('Test data')
      expect(mockFetchData).toHaveBeenCalledTimes(1)
    })
  })

  it('should refetch query on mount', async () => {
    const { getByTestId, unmount } = render(
      <TestComponentWrapper>
        <TestComponentWithHook data-testid="test" />
      </TestComponentWrapper>,
    )

    await waitFor(() => {
      expect(mockFetchData).toHaveBeenCalledTimes(1)
      expect(getByTestId('test')).toHaveTextContent('Test data')
    })

    unmount()
    const { getByTestId: getByTestId2 } = render(
      <TestComponentWrapper>
        <TestComponentWithHook data-testid="test" />
      </TestComponentWrapper>,
    )

    await waitFor(() => {
      expect(getByTestId2('test')).toHaveTextContent('Test data')
      expect(mockFetchData).toHaveBeenCalledTimes(2)
    })
  })

  it('should fetch twice on nested query with no cache and once with cache', async () => {
    const { getByTestId, unmount } = render(
      <TestComponentWrapper>
        <TestComponentWithHook data-testid="test">
          <TestComponentWithHook data-testid="nested" />
        </TestComponentWithHook>
      </TestComponentWrapper>,
    )

    await waitFor(() => {
      expect(getByTestId('test')).toHaveTextContent('Test data')
      expect(getByTestId('nested')).toHaveTextContent('Test data')
      expect(mockFetchData).toHaveBeenCalledTimes(2)
    })

    unmount()
    const { getByTestId: getByTestId2 } = render(
      <TestComponentWrapper>
        <TestComponentWithHook data-testid="test">
          <TestComponentWithHook data-testid="nested" />
        </TestComponentWithHook>
      </TestComponentWrapper>,
    )

    await waitFor(() => {
      expect(getByTestId2('test')).toHaveTextContent('Test data')
      expect(getByTestId2('nested')).toHaveTextContent('Test data')
      expect(mockFetchData).toHaveBeenCalledTimes(3)
    })
  })
})
