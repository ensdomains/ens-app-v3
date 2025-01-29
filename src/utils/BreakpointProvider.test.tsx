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
    const mockMatchMedia = (query: string) => ({
      addListener: vi.fn(), // deprecated method
      removeListener: vi.fn(), // deprecated method
      matches: false,
      media: query,
      onchange: null,
      addEventListener: (type: string, listener: (e: MediaQueryListEvent) => void) => {
        if (type === 'change') {
          listeners.push(listener)
        }
      },
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })
    return { listeners, mockMatchMedia }
  }

  it('should set a listener for each breakpoint', () => {
    const { listeners, mockMatchMedia } = createMockMatchMedia()
    const originalMatchMedia = window.matchMedia
    vi.stubGlobal('matchMedia', mockMatchMedia)

    afterEach(() => {
      vi.stubGlobal('matchMedia', originalMatchMedia)
    })

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
    const { listeners, mockMatchMedia } = createMockMatchMedia()

    const originalMatchMedia = window.matchMedia
    vi.stubGlobal('matchMedia', mockMatchMedia)

    afterEach(() => {
      vi.stubGlobal('matchMedia', originalMatchMedia)
    })

    const TestComponent = () => {
      const _breakpoints = useBreakpoint()
      return <div>{JSON.stringify(_breakpoints)}</div>
    }

    const { rerender } = render(
      <BreakpointProvider queries={breakpoints}>
        <TestComponent />
      </BreakpointProvider>,
    )

    act(() => {
      const mockEvent = new Event('change') as MediaQueryListEvent
      Object.defineProperty(mockEvent, 'matches', { value: true })
      Object.defineProperty(mockEvent, 'media', { value: Object.values(breakpoints)[0] })
      if (typeof listeners[0] === 'function') {
        listeners[0](mockEvent)
      }
    })

    rerender(
      <BreakpointProvider queries={breakpoints}>
        <TestComponent />
      </BreakpointProvider>,
    )

    await waitFor(() => {
      expect(
        screen.getByText('{"xs":true,"sm":true,"md":true,"lg":true,"xl":true}'),
      ).toBeInTheDocument()
    })
  })
})
