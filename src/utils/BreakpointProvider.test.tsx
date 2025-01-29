import { render, screen, waitFor } from '@app/test-utils'

import { act } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { BreakpointProvider, useBreakpoint } from './BreakpointProvider'

const breakpoints = {
  xs: '(min-width: 360px)',
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
}

describe('BreakpointProvider', () => {
  afterEach(() => {
    delete (window as any).matchMedia
  })

  const createMockMatchMedia = () => {
    const listeners: ((e: MediaQueryListEvent) => void)[] = []
    const mockMatchMedia = (query: string) => {
      const mediaQueryList = {
        matches: false,
        media: query,
        onchange: null,
        addListener: (listener: (e: MediaQueryListEvent) => void) => {
          listeners.push(listener)
        },
        removeListener: vi.fn(),
        addEventListener: (type: string, listener: (e: MediaQueryListEvent) => void) => {
          if (type === 'change') {
            listeners.push(listener)
          }
        },
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }
      return mediaQueryList
    }
    vi.stubGlobal('matchMedia', mockMatchMedia)
    return { listeners }
  }

  it('should set a MediaQueryList listener for each breakpoint query', () => {
    const { listeners } = createMockMatchMedia()

    const TestComponent = () => {
      useBreakpoint()
      return <div>TestComponent</div>
    }

    render(
      <BreakpointProvider queries={breakpoints}>
        <TestComponent />
      </BreakpointProvider>,
    )

    expect(listeners.length).toBe(Object.keys(breakpoints).length)
  })

  it('should update the queryMatch state when the breakpoint changes', async () => {
    const { listeners } = createMockMatchMedia()

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
      const mockEvent = new Event('change') as MediaQueryListEvent
      Object.defineProperty(mockEvent, 'matches', { value: true })
      Object.defineProperty(mockEvent, 'media', { value: breakpoints.xs })
      if (typeof listeners[0] === 'function') {
        listeners[0](mockEvent)
      }
    })

    await waitFor(() => {
      const updatedState = JSON.parse(getByTestId('breakpoint-state').textContent || '{}')
      expect(updatedState.xs).toBe(true)
      expect(updatedState.sm).toBe(false)
    })

    // Simulate sm breakpoint change
    act(() => {
      const mockEvent = new Event('change') as MediaQueryListEvent
      Object.defineProperty(mockEvent, 'matches', { value: true })
      Object.defineProperty(mockEvent, 'media', { value: breakpoints.sm })
      if (typeof listeners[1] === 'function') {
        listeners[1](mockEvent)
      }
    })

    await waitFor(() => {
      const finalState = JSON.parse(getByTestId('breakpoint-state').textContent || '{}')
      expect(finalState.xs).toBe(true)
      expect(finalState.sm).toBe(true)
    })
  })

  it('should clean up event listeners when unmounted', () => {
    const { listeners } = createMockMatchMedia()
    const removeEventListenerSpy = vi.fn()
    vi.spyOn(window.matchMedia(''), 'removeEventListener').mockImplementation(removeEventListenerSpy)

    const { unmount } = render(
      <BreakpointProvider queries={breakpoints}>
        <div>Test</div>
      </BreakpointProvider>,
    )

    expect(listeners.length).toBe(Object.keys(breakpoints).length)
    unmount()
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(Object.keys(breakpoints).length)
  })
})
