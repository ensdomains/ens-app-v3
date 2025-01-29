import { render, screen, waitFor } from '@app/test-utils'

import { act } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { BreakpointProvider, useBreakpoint } from './BreakpointProvider'

const breakpoints = {
  xs: '(min-width: 360px)',
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
}

describe('BreakpointProvider', () => {
  type MediaQueryListener = (e: MediaQueryListEvent) => void
  const mediaQueries = new Map<string, Set<MediaQueryListener>>()
  const mediaMatches = new Map<string, boolean>()

  beforeEach(() => {
    vi.useFakeTimers()
    mediaQueries.clear()
    mediaMatches.clear()

    window.matchMedia = vi.fn().mockImplementation((query: string) => {
      if (!mediaQueries.has(query)) {
        mediaQueries.set(query, new Set())
        mediaMatches.set(query, false)
      }

      const mql = {
        matches: mediaMatches.get(query),
        media: query,
        onchange: null,
        addListener: (listener: MediaQueryListener) => {
          mediaQueries.get(query)!.add(listener)
        },
        removeListener: (listener: MediaQueryListener) => {
          mediaQueries.get(query)!.delete(listener)
        },
        addEventListener: (type: string, listener: MediaQueryListener) => {
          if (type === 'change') mediaQueries.get(query)!.add(listener)
        },
        removeEventListener: (type: string, listener: MediaQueryListener) => {
          if (type === 'change') mediaQueries.get(query)!.delete(listener)
        },
        dispatchEvent: (event: { type: string; matches?: boolean }) => {
          if (event.type === 'change' && event.matches !== undefined) {
            mediaMatches.set(query, event.matches)
            const mediaQueryEvent = new Event('change') as MediaQueryListEvent
            Object.defineProperty(mediaQueryEvent, 'matches', { value: event.matches })
            Object.defineProperty(mediaQueryEvent, 'media', { value: query })
            mediaQueries.get(query)!.forEach(listener => listener(mediaQueryEvent))
          }
          return true
        }
      }

      return mql
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
    mediaQueries.clear()
  })

  it('should set a MediaQueryList listener for each breakpoint query', async () => {
    const TestComponent = () => {
      useBreakpoint()
      return <div>TestComponent</div>
    }

    render(
      <BreakpointProvider queries={breakpoints}>
        <TestComponent />
      </BreakpointProvider>,
    )

    await act(async () => {
      vi.runOnlyPendingTimers()
      await Promise.resolve()
    })

    const totalListeners = Array.from(mediaQueries.values())
      .reduce((acc, curr) => acc + curr.size, 0)
    expect(totalListeners).toBe(Object.keys(breakpoints).length)
  })

  it('should update the queryMatch state when the breakpoint changes', async () => {
    const TestComponent = () => {
      const breakpoints = useBreakpoint()
      return <div data-testid="breakpoint-state">{JSON.stringify(breakpoints)}</div>
    }

    const { getByTestId } = render(
      <BreakpointProvider queries={breakpoints}>
        <TestComponent />
      </BreakpointProvider>,
    )

    await act(async () => {
      vi.runOnlyPendingTimers()
      await Promise.resolve()
    })

    // Initial state should have all breakpoints as false
    const initialState = JSON.parse(getByTestId('breakpoint-state').textContent || '{}')
    expect(initialState.xs).toBe(false)
    expect(initialState.sm).toBe(false)

    // Simulate xs breakpoint change
    const xsMediaQuery = window.matchMedia(breakpoints.xs)
    await act(async () => {
      xsMediaQuery.dispatchEvent({ type: 'change', matches: true })
      vi.runOnlyPendingTimers()
      await Promise.resolve()
    })

    const updatedState = JSON.parse(getByTestId('breakpoint-state').textContent || '{}')
    expect(updatedState.xs).toBe(true)
    expect(updatedState.sm).toBe(false)

    // Simulate sm breakpoint change
    const smMediaQuery = window.matchMedia(breakpoints.sm)
    await act(async () => {
      smMediaQuery.dispatchEvent({ type: 'change', matches: true })
      vi.runOnlyPendingTimers()
      await Promise.resolve()
    })

    const finalState = JSON.parse(getByTestId('breakpoint-state').textContent || '{}')
    expect(finalState.xs).toBe(true)
    expect(finalState.sm).toBe(true)
  })

  it('should clean up event listeners when unmounted', async () => {
    const { unmount } = render(
      <BreakpointProvider queries={breakpoints}>
        <div>Test</div>
      </BreakpointProvider>,
    )

    await act(async () => {
      vi.runOnlyPendingTimers()
      await Promise.resolve()
    })

    const totalListeners = Array.from(mediaQueries.values())
      .reduce((acc, curr) => acc + curr.size, 0)
    expect(totalListeners).toBe(Object.keys(breakpoints).length)

    unmount()

    await act(async () => {
      vi.runOnlyPendingTimers()
      await Promise.resolve()
    })

    const remainingListeners = Array.from(mediaQueries.values())
      .reduce((acc, curr) => acc + curr.size, 0)
    expect(remainingListeners).toBe(0)
  })
})
