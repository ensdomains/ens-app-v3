import { fireEvent, mockFunction, render, screen, waitFor } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import { useBreakpoint } from '@app/utils/BreakpointProvider'

import Hamburger from './Hamburger'

// vi.mock('@app/hooks/useInitial')
vi.mock('@app/utils/BreakpointProvider')

vi.mock('@app/utils/SyncProvider/SyncProvider', () => ({
  useGraphOutOfSync: vi.fn(() => false),
}))
vi.mock('@app/hooks/useInitial', () => ({
  useInitial: vi.fn(() => false),
}))

const mockUseBreakpoint = mockFunction(useBreakpoint)

describe('Hamburger', () => {
  it('renders the menu button', () => {
    mockUseBreakpoint.mockReturnValue({ sm: false })
    render(<Hamburger />)
    const button = screen.getByTestId('humburger-button')
    expect(button).toBeInTheDocument()
  })

  it('opens the menu when clicked', async () => {
    mockUseBreakpoint.mockReturnValue({ sm: false })
    render(<Hamburger />)
    const button = screen.getByTestId('humburger-button')

    expect(screen.queryByTestId('main-menu')).not.toBeInTheDocument()

    fireEvent.click(button)

    await waitFor(() => expect(screen.queryByTestId('main-menu')).toBeInTheDocument())
  })

  it('closes the menu when clicked outside', async () => {
    mockUseBreakpoint.mockReturnValue({ sm: false })
    render(<Hamburger />)
    const button = screen.getByTestId('humburger-button')

    fireEvent.click(button)

    const menu = screen.getByTestId('main-menu')

    expect(menu).toBeInTheDocument()

    fireEvent.click(document.body)

    await waitFor(() => expect(menu).not.toBeInTheDocument())
  })

  it('switches between views', () => {
    mockUseBreakpoint.mockReturnValue({ sm: false })

    render(<Hamburger />)

    const button = screen.getByTestId('humburger-button')

    fireEvent.click(button)

    expect(screen.getByTestId('main-menu')).toBeInTheDocument()

    fireEvent.click(screen.getByText('navigation.language'))

    expect(screen.getByTestId('lang-menu')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('lang-header'))

    expect(screen.getByTestId('main-menu')).toBeInTheDocument()
  })

  it('renders the mobile modal on mobile', () => {
    mockUseBreakpoint.mockReturnValue({ xs: true })

    render(<Hamburger />)

    const button = screen.getByTestId('humburger-button')

    fireEvent.click(button)

    expect(screen.getByTestId('mobile-humburger-menu')).toBeInTheDocument()
  })

  it('renders the desktop dropdown on desktop', () => {
    mockUseBreakpoint.mockReturnValue({ xs: false, sm: true })

    render(<Hamburger />)

    const button = screen.getByTestId('humburger-button')

    fireEvent.click(button)

    expect(screen.getByTestId('desktop-humburger-menu')).toBeInTheDocument()
  })
})
