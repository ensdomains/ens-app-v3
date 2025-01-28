import { mockFunction, render, screen } from '@app/test-utils'
import { useRouter } from 'next/router'
import { vi } from 'vitest'
import { useEnsAvatar } from 'wagmi'
import { TabBar } from './TabBar'
import { useAccountSafely } from '@app/hooks/account/useAccountSafely'
import { usePrimaryName } from '@app/hooks/ensjs/public/usePrimaryName'
import useHasPendingTransactions from '@app/hooks/transactions/useHasPendingTransactions'
import { useZorb } from '@app/hooks/useZorb'

vi.mock('next/router')
vi.mock('@app/hooks/account/useAccountSafely')
vi.mock('@app/hooks/ensjs/public/usePrimaryName')
vi.mock('@app/hooks/transactions/useHasPendingTransactions')
vi.mock('@app/hooks/useZorb')
vi.mock('wagmi')

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
    on: vi.fn(),
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

    // Reset localStorage
    localStorage.clear()
  })

  const renderWithAddress = () => {
    mockUseAccountSafely.mockReturnValue({ address: mockAddress })
    mockUsePrimaryName.mockReturnValue({ data: { name: mockName }, isLoading: false })
    mockUseEnsAvatar.mockReturnValue({ data: mockAvatarUrl, isLoading: false })
    render(<TabBar />)
  }

  it('should show Connect button when not connected', () => {
    render(<TabBar />)
    expect(screen.getByText('Connect')).toBeVisible()
  })

  it('should display avatar and route items when connected', () => {
    renderWithAddress()
    expect(screen.getByAltText('avatar')).toHaveAttribute('src', mockAvatarUrl)
    expect(screen.getByText('Search')).toBeVisible()
    expect(screen.getByText('Names')).toBeVisible()
  })

  it('should show back button and navigate back when from query param exists', async () => {
    mockUseRouter.mockReturnValue({
      ...mockUseRouter.mock.results[0].value,
      query: { from: '/previous-page' },
    })
    render(<TabBar />)
    
    const backButton = screen.getByRole('button', { name: /back/i })
    expect(backButton).toBeVisible()
    
    await userEvent.click(backButton)
    expect(mockBack).toHaveBeenCalled()
  })

  it('should expand profile section when avatar is clicked', async () => {
    renderWithAddress()
    
    const avatar = screen.getByAltText('avatar')
    await userEvent.click(avatar)
    
    expect(screen.getByText(mockName)).toBeVisible()
    expect(screen.getByText('Settings')).toBeVisible()
  })

  it('should show zorb when no avatar is available', () => {
    mockUseAccountSafely.mockReturnValue({ address: mockAddress })
    mockUseEnsAvatar.mockReturnValue({ data: undefined, isLoading: false })
    render(<TabBar />)
    
    expect(screen.getByAltText('zorb')).toHaveAttribute('src', mockZorbUrl)
  })

  it('should show notification on settings when there are pending transactions', () => {
    mockUseHasPendingTransactions.mockReturnValue(true)
    renderWithAddress()
    
    const settings = screen.getByText('Settings')
    expect(settings.parentElement).toHaveAttribute('hasNotification', 'true')
  })
})
