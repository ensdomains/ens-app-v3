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
  class MockMediaQueryListEvent extends Event {
    matches: boolean
    media: string
    constructor(type: string, init: { matches: boolean; media: string }) {
      super(type)
      this.matches = init.matches
      this.media = init.media
    }
  }

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

      const listeners = mediaQueries.get(query)!

      return {
        matches: mediaMatches.get(query),
        media: query,
        onchange: null,
        addListener: (listener: MediaQueryListener) => {
          listeners.add(listener)
        },
        removeListener: (listener: MediaQueryListener) => {
          listeners.delete(listener)
        },
        addEventListener: (type: string, listener: MediaQueryListener) => {
          if (type === 'change') {
            listeners.add(listener)
          }
        },
        removeEventListener: (type: string, listener: MediaQueryListener) => {
          if (type === 'change') {
            listeners.delete(listener)
          }
        },
        dispatchEvent: (event: Event) => {
          if (event.type === 'change' && event instanceof MockMediaQueryListEvent) {
            mediaMatches.set(query, event.matches)
            listeners.forEach(listener => {
              listener(event as unknown as MediaQueryListEvent)
            })
          }
          return true
        }
      }

      }
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
      vi.runAllTimers()
      await Promise.resolve()
    })

    const totalListeners = Array.from(mediaQueries.values())
      .reduce((acc, curr) => acc + curr.size, 0)

    expect(totalListeners).toBe(Object.keys(breakpoints).length)
    expect(window.matchMedia).toHaveBeenCalledTimes(Object.keys(breakpoints).length)
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
      vi.runAllTimers()
      await Promise.resolve()
    })

    const initialState = JSON.parse(getByTestId('breakpoint-state').textContent || '{}')
    expect(initialState).toEqual({
      xs: false,
      sm: false,
      md: false,
      lg: false,
      xl: false,
    })

    await act(async () => {
      Object.keys(breakpoints).forEach(key => {
        const query = window.matchMedia(breakpoints[key])
        mediaMatches.set(breakpoints[key], true)
        const event = new MockMediaQueryListEvent('change', { matches: true, media: breakpoints[key] })
        query.dispatchEvent(event)
      })
      vi.runAllTimers()
      await Promise.resolve()
    })

    const updatedState = JSON.parse(getByTestId('breakpoint-state').textContent || '{}')
    expect(updatedState).toEqual({
      xs: true,
      sm: true,
      md: true,
      lg: true,
      xl: true
    })
  })

  it('should clean up event listeners when unmounted', async () => {
    const TestComponent = () => {
      useBreakpoint()
      return <div>Test</div>
    }

    const { unmount } = render(
      <BreakpointProvider queries={breakpoints}>
        <TestComponent />
      </BreakpointProvider>,
    )

    await act(async () => {
      vi.runAllTimers()
      await Promise.resolve()
    })

    const initialListeners = Array.from(mediaQueries.values())
      .reduce((acc, curr) => acc + curr.size, 0)
    expect(initialListeners).toBe(Object.keys(breakpoints).length)

    unmount()

    await act(async () => {
      vi.runAllTimers()
      await Promise.resolve()
    })

    const finalListeners = Array.from(mediaQueries.values())
      .reduce((acc, curr) => acc + curr.size, 0)
    expect(finalListeners).toBe(0)
  })
})
