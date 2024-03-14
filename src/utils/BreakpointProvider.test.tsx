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

  it('should set a listener for each breakpoint', () => {
    const listeners = []

    const mockMatchMedia = () => {
      return {
        addListener: (listener: any) => listeners.push(listener),
        removeListener: vi.fn(),
        matches: false,
      }
    }

    ;(window as any).matchMedia = mockMatchMedia

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
    const listeners: any[] = []
    const returnObject = {
      addListener: (listener: any) => listeners.push(listener),
      removeListener: vi.fn(),
      matches: false,
    }

    ;(window as any).matchMedia = () => {
      return returnObject
    }

    const TestComponent = () => {
      const _breakpoints = useBreakpoint()
      return <div>{JSON.stringify(_breakpoints)}</div>
    }

    const { rerender } = render(
      <BreakpointProvider queries={breakpoints}>
        <TestComponent />
      </BreakpointProvider>,
    )

    returnObject.matches = true
    act(() => {
      listeners[0]()
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
