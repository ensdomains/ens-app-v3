import { act, render, screen, waitFor } from '@app/test-utils'

import { ReactNode, useContext, useEffect } from 'react'
import { WagmiConfig, useQuery } from 'wagmi'

import { wagmiClientWithRefetch } from '@app/utils/query'

import DynamicLoadingContext from './DynamicLoadingContext'
import InputComponentWrapper from './InputComponentWrapper'

const { queryClient } = wagmiClientWithRefetch
const cache = queryClient.getQueryCache()
queryClient.setDefaultOptions({
  queries: {
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60,
    staleTime: 1000 * 120,
    meta: {
      isRefetchQuery: true,
    },
    refetchOnMount: 'always',
  },
})

const ComponentHelper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="modal" data-testid="modal-card">
      <div>
        <WagmiConfig client={wagmiClientWithRefetch}>
          <InputComponentWrapper>{children}</InputComponentWrapper>
        </WagmiConfig>
      </div>
    </div>
  )
}

const mockObserve = jest.fn()
const mockDisconnect = jest.fn()

const ComponentWithHook = ({ timeout }: { timeout: number }) => {
  useQuery(
    ['test', '123'],
    () =>
      new Promise((resolve) => {
        setTimeout(() => resolve('value-updated'), timeout)
      }),
  )
  return <div data-testid="test" />
}

const ComponentLoading = () => {
  const setLoading = useContext(DynamicLoadingContext)
  useEffect(() => {
    setLoading(true)
    return () => setLoading(false)
  }, [setLoading])

  return <div data-testid="test" />
}

describe('<InputComponentWrapper />', () => {
  let mutationObserverCb: () => void
  beforeEach(() => {
    ;(global.MutationObserver as any) = class {
      constructor(cb: any) {
        mutationObserverCb = cb
      }

      observe = mockObserve

      disconnect = mockDisconnect
    }
  })
  it('should render children', () => {
    render(
      <ComponentHelper>
        <div data-testid="test" />
      </ComponentHelper>,
    )
    expect(screen.getByTestId('test')).toBeVisible()
  })
  it('should set all queries with no observers to idle', () => {
    queryClient.setQueryData(['test', '123'], 'value')
    queryClient.setQueryData(['test', '456'], 'value')
    const item1 = cache.get('["test","123"]')!
    const item2 = cache.get('["test","456"]')!
    item1.setState({ ...item1.state, fetchStatus: 'fetching' })
    item2.setState({ ...item2.state, fetchStatus: 'fetching' })
    render(
      <ComponentHelper>
        <div data-testid="test" />
      </ComponentHelper>,
    )
    expect(item1.state.fetchStatus).toBe('idle')
    expect(item2.state.fetchStatus).toBe('idle')
  })
  it('should add cacheable-component class to modal card on mount', async () => {
    render(
      <ComponentHelper>
        <div data-testid="test" />
      </ComponentHelper>,
    )
    mutationObserverCb()
    await waitFor(() => {
      expect(screen.getByTestId('modal-card')).toHaveClass('cacheable-component')
    })
  })
  it('should add cacheable-component-cached class to modal card when cached data exists', async () => {
    queryClient.setQueryData(['test', '123'], 'value')
    render(
      <ComponentHelper>
        <ComponentWithHook timeout={3000} />
      </ComponentHelper>,
    )
    mutationObserverCb()
    await waitFor(() => {
      expect(screen.getByTestId('modal-card')).toHaveClass('cacheable-component-cached')
    })
  })
  it('should show spinner after data is cached for 3 seconds', async () => {
    jest.useFakeTimers()
    queryClient.setQueryData(['test', '123'], 'value')
    render(
      <ComponentHelper>
        <ComponentWithHook timeout={5000} />
      </ComponentHelper>,
    )
    mutationObserverCb()
    act(() => {
      jest.advanceTimersByTime(3000)
    })
    await waitFor(() => {
      expect(screen.getByTestId('modal-card')).toHaveClass('cacheable-component-cached')
      expect(screen.getByTestId('spinner-overlay')).toBeVisible()
    })
  })
  it('should not show spinner if componentLoading is true', async () => {
    jest.useFakeTimers()
    render(
      <ComponentHelper>
        <ComponentLoading />
      </ComponentHelper>,
    )
    mutationObserverCb()
    act(() => {
      jest.advanceTimersByTime(3000)
    })
    await waitFor(() => {
      expect(screen.getByTestId('modal-card')).toHaveClass('cacheable-component')
      expect(screen.queryByTestId('spinner-overlay')).toBeNull()
    })
  })
  it('should remove cacheable-component-cached class from modal once data is refetched', async () => {
    jest.useFakeTimers()
    queryClient.setQueryData(['test', '123'], 'value')
    render(
      <ComponentHelper>
        <ComponentWithHook timeout={5000} />
      </ComponentHelper>,
    )
    mutationObserverCb()
    await waitFor(() => {
      expect(screen.getByTestId('modal-card')).toHaveClass('cacheable-component-cached')
    })
    act(() => {
      jest.advanceTimersByTime(3000)
    })
    await waitFor(() => {
      expect(screen.getByTestId('spinner-overlay')).toBeVisible()
    })
    act(() => {
      jest.advanceTimersByTime(2000)
    })
    await waitFor(() => {
      expect(screen.getByTestId('modal-card')).not.toHaveClass('cacheable-component-cached')
      expect(screen.queryByTestId('spinner-overlay')).toBeNull()
    })
  })
  it('should remove cacheable-component class from modal card on unmount', async () => {
    render(<div className="modal" data-testid="modal-card" />)
    const { unmount } = render(
      <WagmiConfig client={wagmiClientWithRefetch}>
        <InputComponentWrapper>
          <div data-testid="test" />
        </InputComponentWrapper>
      </WagmiConfig>,
    )
    mutationObserverCb()
    await waitFor(() => {
      expect(screen.getByTestId('modal-card')).toHaveClass('cacheable-component')
    })
    unmount()
    await waitFor(() => {
      expect(screen.getByTestId('modal-card')).not.toHaveClass('cacheable-component')
    })
  })
  it('should not initially wait for queries to be fetched if there are no queries', async () => {
    render(
      <ComponentHelper>
        <div data-testid="test" />
      </ComponentHelper>,
    )
    mutationObserverCb()
    await waitFor(() => {
      expect(screen.getByTestId('modal-card')).toHaveClass('cacheable-component')
      expect(screen.getByTestId('modal-card')).not.toHaveClass('cacheable-component-cached')
    })
  })
  it('should add cacheable-component-cached class if there are stale queries', async () => {
    jest.useFakeTimers()
    render(
      <ComponentHelper>
        <ComponentWithHook timeout={100} />
      </ComponentHelper>,
    )
    mutationObserverCb()
    act(() => {
      jest.advanceTimersByTime(100)
    })
    await waitFor(() => {
      expect(screen.getByTestId('modal-card')).toHaveClass('cacheable-component')
      expect(screen.getByTestId('modal-card')).not.toHaveClass('cacheable-component-cached')
    })
    const item1 = cache.get('["test","123"]')!
    act(() => {
      item1.setState({ ...item1.state, dataUpdatedAt: Date.now() - 1000 * 240 })
      jest.advanceTimersByTime(5000)
    })
    await waitFor(() => {
      expect(screen.getByTestId('modal-card')).toHaveClass('cacheable-component-cached')
    })
  })
  it('should remove cacheable-component-cached class once stale queries are refetched', async () => {
    jest.useFakeTimers()
    render(
      <ComponentHelper>
        <ComponentWithHook timeout={100} />
      </ComponentHelper>,
    )
    mutationObserverCb()
    act(() => {
      jest.advanceTimersByTime(100)
    })
    await waitFor(() => {
      expect(screen.getByTestId('modal-card')).toHaveClass('cacheable-component')
      expect(screen.getByTestId('modal-card')).not.toHaveClass('cacheable-component-cached')
    })
    const item1 = cache.get('["test","123"]')!
    act(() => {
      item1.setState({ ...item1.state, dataUpdatedAt: Date.now() - 1000 * 240 })
      jest.advanceTimersByTime(5000)
    })
    await waitFor(() => {
      expect(screen.getByTestId('modal-card')).toHaveClass('cacheable-component-cached')
    })
    act(() => {
      // remaining time for refetch interval
      jest.advanceTimersByTime(1000 * 55)
    })
    await waitFor(() => {
      expect(screen.getByTestId('modal-card')).not.toHaveClass('cacheable-component-cached')
    })
  })
})
