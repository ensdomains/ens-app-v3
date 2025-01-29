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
  type MediaQueryData = { matches: boolean; listeners: Set<MediaQueryListener> }
  const mediaQueries = new Map<string, MediaQueryData>()

  beforeEach(() => {
    vi.useFakeTimers()
    mediaQueries.clear()
    Object.values(breakpoints).forEach(query => {
      mediaQueries.set(query, { matches: false, listeners: new Set() })
    })

    window.matchMedia = vi.fn().mockImplementation((query: string) => {
      if (!mediaQueries.has(query)) {
        mediaQueries.set(query, { matches: false, listeners: new Set() })
      }
      const queryData = mediaQueries.get(query)!

      const createEvent = (matches: boolean): MediaQueryListEvent => ({
        matches,
        media: query,
        type: 'change',
      } as MediaQueryListEvent)

      const mql = {
        matches: queryData.matches,
        media: query,
        onchange: null,
        addListener(listener: MediaQueryListener) {
          queryData.listeners.add(listener)
          // Call listener with initial state
          listener(createEvent(queryData.matches))
        },
        removeListener(listener: MediaQueryListener) {
          queryData.listeners.delete(listener)
        },
        addEventListener(type: string, listener: MediaQueryListener) {
          if (type === 'change') {
            queryData.listeners.add(listener)
            // Call listener with initial state
            listener(createEvent(queryData.matches))
          }
        },
        removeEventListener(type: string, listener: MediaQueryListener) {
          if (type === 'change') {
            queryData.listeners.delete(listener)
          }
        },
        dispatchEvent(event: Event) {
          if (event.type === 'change') {
            const mediaQueryEvent = event as MediaQueryListEvent
            queryData.matches = mediaQueryEvent.matches
            mql.matches = mediaQueryEvent.matches
            queryData.listeners.forEach(listener => {
              listener(createEvent(mediaQueryEvent.matches))
            })
          }
          return true
        }
      }

      vi.spyOn(mql, 'addListener')
      vi.spyOn(mql, 'removeListener')
      vi.spyOn(mql, 'addEventListener')
      vi.spyOn(mql, 'removeEventListener')
      vi.spyOn(mql, 'dispatchEvent')

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
      vi.advanceTimersByTime(100)
    })
    const totalListeners = Array.from(mediaQueries.values())
      .reduce((acc, curr) => acc + curr.listeners.size, 0)
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

    // Initial state should have all breakpoints as false
    const initialState = JSON.parse(getByTestId('breakpoint-state').textContent || '{}')
    expect(initialState.xs).toBe(false)
    expect(initialState.sm).toBe(false)

    // Simulate xs breakpoint change
    const xsMediaQuery = window.matchMedia(breakpoints.xs)
    act(() => {
      mediaQueries.get(breakpoints.xs)!.matches = true
      const event = new Event('change') as MediaQueryListEvent
      Object.defineProperties(event, {
        matches: { value: true },
        media: { value: breakpoints.xs },
        type: { value: 'change' },
      })
      xsMediaQuery.dispatchEvent(event)
    })

    await act(async () => {
      vi.advanceTimersByTime(100)
    })
    const updatedState = JSON.parse(getByTestId('breakpoint-state').textContent || '{}')
    expect(updatedState.xs).toBe(true)
    expect(updatedState.sm).toBe(false)

    // Simulate sm breakpoint change
    const smMediaQuery = window.matchMedia(breakpoints.sm)
    act(() => {
      mediaQueries.get(breakpoints.sm)!.matches = true
      const event = new Event('change') as MediaQueryListEvent
      Object.defineProperties(event, {
        matches: { value: true },
        media: { value: breakpoints.sm },
        type: { value: 'change' },
      })
      smMediaQuery.dispatchEvent(event)
    })

    await act(async () => {
      vi.advanceTimersByTime(100)
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
      vi.advanceTimersByTime(100)
    })
    const totalListeners = Array.from(mediaQueries.values())
      .reduce((acc, curr) => acc + curr.listeners.size, 0)
    expect(totalListeners).toBe(Object.keys(breakpoints).length)

    unmount()

    const remainingListeners = Array.from(mediaQueries.values())
      .reduce((acc, curr) => acc + curr.listeners.size, 0)
    expect(remainingListeners).toBe(0)
  })
})
