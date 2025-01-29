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
  const mediaQueryLists = new Map<string, { matches: boolean; listeners: Set<(e: MediaQueryListEvent) => void> }>()

  beforeEach(() => {
    mediaQueryLists.clear()
    
    const mockMatchMedia = (query: string) => {
      if (!mediaQueryLists.has(query)) {
        mediaQueryLists.set(query, { matches: false, listeners: new Set() })
      }
      const queryData = mediaQueryLists.get(query)!
      
      const mediaQueryList = {
        matches: queryData.matches,
        media: query,
        onchange: null,
        addListener: (listener: (e: MediaQueryListEvent) => void) => {
          queryData.listeners.add(listener)
        },
        removeListener: (listener: (e: MediaQueryListEvent) => void) => {
          queryData.listeners.delete(listener)
        },
        addEventListener: (type: string, listener: (e: MediaQueryListEvent) => void) => {
          if (type === 'change') queryData.listeners.add(listener)
        },
        removeEventListener: (type: string, listener: (e: MediaQueryListEvent) => void) => {
          if (type === 'change') queryData.listeners.delete(listener)
        },
        dispatchEvent: () => {
          queryData.matches = true
          const mediaQueryEvent = new Event('change') as MediaQueryListEvent
          Object.defineProperties(mediaQueryEvent, {
            matches: { value: queryData.matches },
            media: { value: query }
          })
          queryData.listeners.forEach(listener => listener(mediaQueryEvent))
          return true
        }
      }

      return mediaQueryList
    }

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    })
  })

  it('should set a MediaQueryList listener for each breakpoint query', () => {
    const TestComponent = () => {
      useBreakpoint()
      return <div>TestComponent</div>
    }

    render(
      <BreakpointProvider queries={breakpoints}>
        <TestComponent />
      </BreakpointProvider>,
    )

    const totalListeners = Array.from(mediaQueryLists.values())
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
    act(() => {
      const mediaQueryList = window.matchMedia(breakpoints.xs)
      mediaQueryList.dispatchEvent(new Event('change'))
    })

    await waitFor(() => {
      const updatedState = JSON.parse(getByTestId('breakpoint-state').textContent || '{}')
      expect(updatedState.xs).toBe(true)
      expect(updatedState.sm).toBe(false)
    })

    // Simulate sm breakpoint change
    act(() => {
      const mediaQueryList = window.matchMedia(breakpoints.sm)
      mediaQueryList.dispatchEvent(new Event('change'))
    })

    await waitFor(() => {
      const finalState = JSON.parse(getByTestId('breakpoint-state').textContent || '{}')
      expect(finalState.xs).toBe(true)
      expect(finalState.sm).toBe(true)
    })
  })

  it('should clean up event listeners when unmounted', async () => {
    const { unmount } = render(
      <BreakpointProvider queries={breakpoints}>
        <div>Test</div>
      </BreakpointProvider>,
    )

    await vi.waitFor(() => {
      const totalListeners = Array.from(mediaQueryLists.values())
        .reduce((acc, curr) => acc + curr.listeners.size, 0)
      expect(totalListeners).toBe(Object.keys(breakpoints).length)
    })

    unmount()

    const remainingListeners = Array.from(mediaQueryLists.values())
      .reduce((acc, curr) => acc + curr.listeners.size, 0)
    expect(remainingListeners).toBe(0)
  })
})
