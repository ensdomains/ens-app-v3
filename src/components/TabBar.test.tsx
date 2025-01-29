import { mockFunction, render, screen, userEvent } from '@app/test-utils'

import { useRouter } from 'next/router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useDisconnect, useEnsAvatar } from 'wagmi'

import { useAccountSafely } from '@app/hooks/account/useAccountSafely'
import { usePrimaryName } from '@app/hooks/ensjs/public/usePrimaryName'
import useHasPendingTransactions from '@app/hooks/transactions/useHasPendingTransactions'
import { useZorb } from '@app/hooks/useZorb'
import { BreakpointProvider } from '@app/utils/BreakpointProvider'

import { TabBar } from './TabBar'

vi.mock('@app/utils/BreakpointProvider', () => ({
  BreakpointProvider: ({ children }: { children: React.ReactNode }) => children,
  useBreakpoint: () => ({ sm: true, md: true, lg: true }),
}))

vi.mock('next/router', () => ({
  useRouter: vi.fn(() => ({
    query: {},
    events: {
      on: vi.fn(),
      off: vi.fn(),
    },
    back: vi.fn(),
    asPath: '/',
  })),
}))
vi.mock('@app/hooks/account/useAccountSafely')
vi.mock('@app/hooks/ensjs/public/usePrimaryName')
vi.mock('@app/hooks/transactions/useHasPendingTransactions')
vi.mock('@app/hooks/useZorb')
vi.mock('wagmi', () => ({
  useEnsAvatar: vi.fn(),
  useDisconnect: vi.fn(() => ({ disconnect: vi.fn() })),
}))

const mockUseRouter = mockFunction(useRouter)
const mockUseAccountSafely = mockFunction(useAccountSafely)
const mockUsePrimaryName = mockFunction(usePrimaryName)
const mockUseHasPendingTransactions = mockFunction(useHasPendingTransactions)
const mockUseZorb = mockFunction(useZorb)
const mockUseEnsAvatar = mockFunction(useEnsAvatar)

describe('TabBar', () => {
  const mockAddress = '0x123'
  const mockName = 'test.eth'
  const mockAvatarUrl = 'https://example.com/avatar.png'
  const mockZorbUrl = 'https://example.com/zorb.png'
  const mockRouterEvents = {
    on: vi.fn((event, handler) => handler),
    off: vi.fn(),
  }
  const mockBack = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    mockUseRouter.mockReturnValue({
      query: {},
      events: mockRouterEvents,
      back: mockBack,
      asPath: '/',
    })

    mockUseAccountSafely.mockReturnValue({ address: undefined })
    mockUsePrimaryName.mockReturnValue({ data: undefined, isLoading: false })
    mockUseHasPendingTransactions.mockReturnValue(false)
    mockUseZorb.mockReturnValue(mockZorbUrl)
    mockUseEnsAvatar.mockReturnValue({ data: undefined, isLoading: false })

    localStorage.clear()
  })

  const renderWithAddress = () => {
    mockUseAccountSafely.mockReturnValue({ address: mockAddress })
    mockUsePrimaryName.mockReturnValue({ data: { name: mockName }, isLoading: false })
    mockUseEnsAvatar.mockReturnValue({ data: mockAvatarUrl, isLoading: false })
    return render(<TabBar />)
  }

  it('should show Connect button when not connected', () => {
    render(<TabBar />)
    expect(screen.getByTestId('tabbar-connect-button')).toBeVisible()
    expect(screen.getByText('wallet.connect')).toBeVisible()
  })

  it('should display avatar and route items when connected', () => {
    renderWithAddress()
    expect(screen.getByAltText('avatar')).toHaveAttribute('src', mockAvatarUrl)

    const routeIcons = screen.getAllByTestId('route-item-icon')
    expect(routeIcons.length).toBeGreaterThanOrEqual(2)
    expect(routeIcons[0].closest('a')).toBeVisible()
  })

  it('should show back button and navigate back when from query param exists', async () => {
    mockUseRouter.mockReturnValue({
      query: { from: '/previous-page' },
      events: mockRouterEvents,
      back: mockBack,
      asPath: '/',
    })
    render(<TabBar />)

    const backButton = screen.getByTestId('tabbar-back-button')
    expect(backButton).toBeVisible()

    await userEvent.click(backButton)
    expect(mockBack).toHaveBeenCalled()
  })

  it('should expand profile section when avatar is clicked', async () => {
    renderWithAddress()

    const avatar = screen.getByAltText('avatar')
    await userEvent.click(avatar)

    const profileWrapper = screen
      .getAllByRole('link')
      .find((el) => el.getAttribute('href') === '/my/profile')
    expect(profileWrapper?.closest('div')).toHaveClass('sc-lnPyaJ')
  })

  it('should show zorb when no avatar is available', () => {
    mockUseAccountSafely.mockReturnValue({ address: mockAddress })
    mockUseEnsAvatar.mockReturnValue({ data: undefined, isLoading: false })
    render(<TabBar />)

    expect(screen.getByAltText('zorb')).toHaveAttribute('src', mockZorbUrl)
  })

  it('should show notification on settings when there are pending transactions', async () => {
    mockUseHasPendingTransactions.mockReturnValue(true)
    mockUseAccountSafely.mockReturnValue({ address: mockAddress })
    mockUsePrimaryName.mockReturnValue({ data: { name: mockName }, isLoading: false })
    mockUseEnsAvatar.mockReturnValue({ data: mockAvatarUrl, isLoading: false })
    render(<TabBar />)

    const avatar = screen.getByAltText('avatar')
    await userEvent.click(avatar)

    const settingsLink = screen
      .getAllByRole('link')
      .find((el) => el.getAttribute('href') === '/my/settings')
    expect(settingsLink).toHaveClass('indicator-container')
  })

  it('should close profile section on route change', async () => {
    mockUseAccountSafely.mockReturnValue({ address: mockAddress })
    mockUsePrimaryName.mockReturnValue({ data: { name: mockName }, isLoading: false })
    mockUseEnsAvatar.mockReturnValue({ data: mockAvatarUrl, isLoading: false })
    render(<TabBar />)

    const avatar = screen.getByAltText('avatar')
    await userEvent.click(avatar)

    const routeChangeHandler = mockRouterEvents.on.mock.calls[0][1]
    routeChangeHandler()

    const profileLinks = screen.queryAllByRole('link').filter(link => 
      link.getAttribute('href')?.includes('/profile/')
    )
    expect(profileLinks.length).toBe(0)
  })

  it('should show legacy favourites route when localStorage has ensFavourites', () => {
    mockUseAccountSafely.mockReturnValue({ address: mockAddress })
    mockUsePrimaryName.mockReturnValue({ data: { name: mockName }, isLoading: false })
    mockUseEnsAvatar.mockReturnValue({ data: mockAvatarUrl, isLoading: false })
    globalThis.localStorage.setItem('ensFavourites', '["test.eth"]')
    render(<TabBar />)

    const links = screen.getAllByRole('link')
    const hasFavouritesLink = links.some((el) => el.getAttribute('href')?.includes('favourites'))
    expect(hasFavouritesLink).toBe(true)
  })

  it('should close profile section when address becomes undefined', async () => {
    const { rerender } = renderWithAddress()
    const avatar = screen.getByAltText('avatar')
    await userEvent.click(avatar)

    const profileWrapper = screen
      .getAllByRole('link')
      .find((el) => el.getAttribute('href') === '/my/profile')
    expect(profileWrapper?.closest('div')).toHaveClass('sc-lnPyaJ')

    mockUseAccountSafely.mockReturnValue({ address: undefined })
    rerender(<TabBar />)

    const profileLinks = screen.queryAllByRole('link').filter(link => 
      link.getAttribute('href')?.includes('/profile/')
    )
    expect(profileLinks.length).toBe(0)
  })

  it('should handle loading state of avatar', () => {
    mockUseAccountSafely.mockReturnValue({ address: mockAddress })
    mockUsePrimaryName.mockReturnValue({ data: { name: mockName }, isLoading: false })
    mockUseEnsAvatar.mockReturnValue({ data: undefined, isLoading: true })
    render(<TabBar />)

    expect(screen.getByAltText('zorb')).toHaveAttribute('src', mockZorbUrl)
  })

  it('should handle primary data without name', () => {
    mockUseAccountSafely.mockReturnValue({ address: mockAddress })
    mockUsePrimaryName.mockReturnValue({ data: {}, isLoading: false })
    mockUseEnsAvatar.mockReturnValue({ data: mockAvatarUrl, isLoading: false })
    render(<TabBar />)

    const profileLinks = screen.queryAllByRole('link').filter(link => 
      link.getAttribute('href')?.includes('/profile/')
    )
    expect(profileLinks.length).toBe(0)
  })
})
