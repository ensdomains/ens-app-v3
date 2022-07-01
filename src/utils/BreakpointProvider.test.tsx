import { render, screen, mockFunction, waitFor } from '@app/test-utils'

import { BreakpointProvider, useBreakpoint } from './BreakpointProvider'

/*


  <BreakpointProvider queries={breakpoints}>
                  <GlobalStyle />
                  <ThorinGlobalStyles />
                  <Notifications />
                  <Basic>{getLayout(<Component {...pageProps} />)}</Basic>
                </BreakpointProvider>
*/

const breakpoints = {
  xs: '(min-width: 360px)',
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
}

describe('BreakpointProvider', () => {
  afterEach(() => {
    delete window.matchMedia
  })

  it('should set a listener for each breakpoint', () => {
    const listeners = []

    const mockMatchMedia = () => {
      return {
        addListener: (listener) => listeners.push(listener),
        removeListener: jest.fn(),
        matches: false,
      }
    }

    window.matchMedia = mockMatchMedia

    const TestComponent = () => {
      const breakpoints = useBreakpoint()
      console.log('breakpoints: ', breakpoints)
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
    const listeners = []
    const returnObject = {
      addListener: (listener) => listeners.push(listener),
      removeListener: jest.fn(),
      matches: false,
    }

    window.matchMedia = () => {
      return returnObject
    }

    const TestComponent = () => {
      const breakpoints = useBreakpoint()
      return <div>{JSON.stringify(breakpoints)}</div>
    }

    const { rerender } = render(
      <BreakpointProvider queries={breakpoints}>
        <TestComponent />
      </BreakpointProvider>,
    )

    returnObject.matches = true
    listeners[0]()

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
