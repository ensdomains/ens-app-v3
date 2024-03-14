import { mockFunction, render, screen } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import { useActiveRoute } from '@app/hooks/useActiveRoute'
import { RouteItemObj } from '@app/routes'

import { RouteItem } from './RouteItem'

vi.mock('@app/hooks/useActiveRoute')
const mockUseActiveRoute = mockFunction(useActiveRoute)

describe('RouteItem', () => {
  it('should be a link if route is not disabled', () => {
    mockUseActiveRoute.mockReturnValue('unknown')

    const route: RouteItemObj = {
      name: 'unknown',
      href: '/test',
      disabled: false,
      label: 'test',
      connected: true,
    }
    render(<RouteItem route={route} asText />)
    expect(screen.getByText('test').closest('a')).toHaveAttribute('href', '/test')
  })
  it('should NOT be a link if route is disabled', () => {
    mockUseActiveRoute.mockReturnValue('unknown')

    const route: RouteItemObj = {
      name: 'unknown',
      href: '/test',
      disabled: true,
      label: 'test',
      connected: true,
    }
    render(<RouteItem route={route} asText />)
    expect(screen.getByText('test').closest('a')).not.toHaveAttribute('href')
  })

  it('should show text if asText is true', () => {
    mockUseActiveRoute.mockReturnValue('unknown')

    const route: RouteItemObj = {
      name: 'unknown',
      href: '/test',
      disabled: false,
      label: 'testLabel',
      connected: true,
    }
    render(<RouteItem route={route} asText />)
    expect(screen.getByText('testLabel')).toBeInTheDocument()
  })

  it('should show icon if asText is false', () => {
    mockUseActiveRoute.mockReturnValue('unknown')

    const route: RouteItemObj = {
      name: 'unknown',
      href: '/test',
      disabled: false,
      label: 'testLabel',
      connected: true,
    }
    render(<RouteItem route={route} asText={false} />)
    expect(screen.getByTestId('route-item-icon')).toBeInTheDocument()
  })
})
