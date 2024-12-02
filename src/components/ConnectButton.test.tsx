import { mockFunction, render, screen } from '@app/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useBreakpoint } from '@app/utils/BreakpointProvider'

import { ConnectButton } from './ConnectButton'

vi.mock('@app/utils/BreakpointProvider')

const baseBreakpoints: ReturnType<typeof useBreakpoint> = {
  xs: true,
  sm: true,
  md: true,
  lg: false,
  xl: false,
}

const mockUseBreakpoint = mockFunction(useBreakpoint)

describe('ConnectButton', () => {
  beforeEach(() => {
    mockUseBreakpoint.mockReturnValue(baseBreakpoints)
  })

  it('should render button in header', () => {
    render(<ConnectButton inHeader />)
    expect(screen.getByTestId('connect-button')).toBeInTheDocument()
  })
  it('should render button in body', () => {
    render(<ConnectButton inHeader={false} />)
    expect(screen.getByTestId('body-connect-button')).toBeInTheDocument()
  })
  it('should render button in tabbar', () => {
    render(<ConnectButton isTabBar />)
    expect(screen.getByTestId('tabbar-connect-button')).toBeInTheDocument()
  })
})
