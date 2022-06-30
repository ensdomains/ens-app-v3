import { render, screen, mockFunction } from '@app/test-utils'

import { useActiveRoute } from '@app/hooks/useActiveRoute'

import { RouteItem } from './RouteItem'

jest.mock('@app/hooks/useActiveRoute')
const mockUseActiveRoute = mockFunction(useActiveRoute)

describe('RouteItem', () => {
  it('should be a link if route is not disabled', () => {
    mockUseActiveRoute.mockReturnValue({
      route: {
        name: 'nick.eth',
      },
      isLoading: false,
      error: null,
    })

    const route = {
      name: 'test',
      href: '/test',
      disabled: false,
      label: 'test',
    }
    render(<RouteItem route={route} asText />)
    expect(screen.getByText('test').closest('a')).toHaveAttribute(
      'href',
      '/test',
    )
  })
  it('should NOT be a link if route is disabled', () => {
    mockUseActiveRoute.mockReturnValue({
      route: {
        name: 'nick.eth',
      },
      isLoading: false,
      error: null,
    })

    const route = {
      name: 'test',
      href: '/test',
      disabled: true,
      label: 'test',
    }
    render(<RouteItem route={route} asText />)
    expect(screen.getByText('test').closest('a')).not.toHaveAttribute('href')
  })
  it('should show text if asText is true', () => {
    mockUseActiveRoute.mockReturnValue({
      route: {
        name: 'nick.eth',
      },
      isLoading: false,
      error: null,
    })

    const route = {
      name: 'test',
      href: '/test',
      disabled: false,
      label: 'testLabel',
    }
    render(<RouteItem route={route} asText />)
    expect(screen.getByText('testLabel')).toBeInTheDocument()
  })
  it('should show icon if asText is false', () => {
    mockUseActiveRoute.mockReturnValue({
      route: {
        name: 'nick.eth',
      },
      isLoading: false,
      error: null,
    })

    const route = {
      name: 'test',
      href: '/test',
      disabled: false,
      label: 'testLabel',
    }
    render(<RouteItem route={route} asText={false} />)
    expect(screen.getByTestId('route-item-icon')).toBeInTheDocument()
  })
})
