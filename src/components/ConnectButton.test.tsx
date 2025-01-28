import { useConnectModal } from '@rainbow-me/rainbowkit'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Address } from 'viem'
import { useDisconnect, useEnsAvatar } from 'wagmi'
import { shortenAddress } from '@app/utils/utils'

import { render, screen } from '@app/test-utils'
import { useAccountSafely } from '@app/hooks/account/useAccountSafely'
import { usePrimaryName } from '@app/hooks/ensjs/public/usePrimaryName'
import useHasPendingTransactions from '@app/hooks/transactions/useHasPendingTransactions'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { useZorb } from '@app/hooks/useZorb'

import { ConnectButton, HeaderConnect } from './ConnectButton'

type MockedHooks = {
  useConnectModal: typeof useConnectModal
  useDisconnect: typeof useDisconnect
  useEnsAvatar: typeof useEnsAvatar
  useAccountSafely: typeof useAccountSafely
  usePrimaryName: typeof usePrimaryName
  useBreakpoint: typeof useBreakpoint
  useRouterWithHistory: typeof useRouterWithHistory
  useZorb: typeof useZorb
  useHasPendingTransactions: typeof useHasPendingTransactions
}

vi.mock('@rainbow-me/rainbowkit')
vi.mock('wagmi')
vi.mock('@app/hooks/account/useAccountSafely')
vi.mock('@app/hooks/ensjs/public/usePrimaryName')
vi.mock('@app/utils/BreakpointProvider')
vi.mock('@app/hooks/useRouterWithHistory')
vi.mock('@app/hooks/useZorb')
vi.mock('@app/hooks/transactions/useHasPendingTransactions')

const mockPrimaryName = {
  data: { beautifiedName: 'test.eth', name: 'test.eth', match: true, reverseResolverAddress: '0x123' as `0x${string}`, resolverAddress: '0x123' as `0x${string}` },
  isLoading: false,
  isCachedData: false,
  isError: false,
  error: null,
  refetchIfEnabled: vi.fn(),
  isPending: false,
  isLoadingError: false,
  isRefetchError: false,
  isSuccess: true,
  status: 'success' as const,
  dataUpdatedAt: Date.now(),
  errorUpdatedAt: 0,
  failureCount: 0,
  failureReason: null,
  errorUpdateCount: 0,
  fetchStatus: 'idle' as const,
}

const mockBreakpoint = {
  sm: true,
  md: false,
  lg: false,
  xl: false,
}

describe('ConnectButton', () => {
  const mockOpenConnectModal = vi.fn()

  beforeEach(() => {
    vi.mocked(useConnectModal).mockReturnValue({ openConnectModal: mockOpenConnectModal, connectModalOpen: false })
    vi.mocked(useBreakpoint).mockReturnValue(mockBreakpoint)
    vi.mocked(useDisconnect).mockReturnValue({
      disconnect: vi.fn(),
      disconnectAsync: vi.fn(),
      error: null,
      isError: false,
      isIdle: true,
      isLoading: false,
      isSuccess: false,
      reset: vi.fn(),
      status: 'idle',
    })
    vi.mocked(useEnsAvatar).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      isError: false,
      isIdle: true,
      isSuccess: false,
      status: 'idle',
      refetch: vi.fn(),
      isRefetching: false,
      isFetching: false,
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      fetchStatus: 'idle',
      isPlaceholderData: false,
      isPending: false,
      isPaused: false,
      isLoadingError: false,
      isRefetchError: false,
    })
    vi.mocked(useAccountSafely).mockReturnValue({
      address: undefined,
      chainId: 1,
      chain: { id: 1, name: 'Mainnet' },
      connector: undefined,
      isConnected: false,
      isConnecting: false,
      isDisconnected: true,
      isReconnecting: false,
      status: 'disconnected',
    })
    vi.mocked(usePrimaryName).mockReturnValue({
      ...mockPrimaryName,
      refetch: vi.fn(),
      isRefetching: false,
      isFetching: false,
      isPlaceholderData: false,
      isPaused: false,
    })
    vi.mocked(useRouterWithHistory).mockReturnValue({ push: vi.fn() } as any)
    vi.mocked(useZorb).mockReturnValue('zorb-url')
    vi.mocked(useHasPendingTransactions).mockReturnValue(false)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should render with default props', () => {
    render(<ConnectButton />)
    const button = screen.getByTestId('body-connect-button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('wallet.connect')
  })

  it('should render with isTabBar prop', () => {
    render(<ConnectButton isTabBar />)
    const button = screen.getByTestId('tabbar-connect-button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('wallet.connect')
  })

  it('should render with inHeader prop', () => {
    render(<ConnectButton inHeader />)
    const button = screen.getByTestId('connect-button')
    expect(button).toBeInTheDocument()
    expect(button.parentElement).toHaveStyle('position: relative')
  })

  it('should render with large prop', () => {
    render(<ConnectButton large />)
    const button = screen.getByTestId('body-connect-button')
    expect(button).toBeInTheDocument()
    expect(button.parentElement).toHaveStyle('width: 100%')
  })

  it('should render small button on mobile without large prop', () => {
    vi.mocked(useBreakpoint).mockReturnValue({ sm: false })
    render(<ConnectButton />)
    const button = screen.getByTestId('body-connect-button')
    expect(button).toHaveAttribute('data-size', 'small')
  })

  it('should render medium button on desktop or with large prop', () => {
    render(<ConnectButton large />)
    const button = screen.getByTestId('body-connect-button')
    expect(button).toHaveAttribute('data-size', 'medium')
  })

  it('should call openConnectModal when clicked', () => {
    render(<ConnectButton />)
    screen.getByTestId('body-connect-button').click()
    expect(mockOpenConnectModal).toHaveBeenCalled()
  })

  it('should render all prop combinations correctly', () => {
    const { rerender } = render(<ConnectButton isTabBar large inHeader />)
    expect(screen.getByTestId('tabbar-connect-button')).toBeInTheDocument()
    
    rerender(<ConnectButton isTabBar large />)
    expect(screen.getByTestId('tabbar-connect-button')).toBeInTheDocument()
    
    rerender(<ConnectButton isTabBar inHeader />)
    expect(screen.getByTestId('tabbar-connect-button')).toBeInTheDocument()
    
    rerender(<ConnectButton large inHeader />)
    expect(screen.getByTestId('connect-button')).toBeInTheDocument()
  })
})

describe('HeaderConnect', () => {
  const mockDisconnect = vi.fn()
  const mockPush = vi.fn()

  beforeEach(() => {
    vi.mocked(useAccountSafely).mockReturnValue({ address: undefined, chainId: 1 })
    vi.mocked(useBreakpoint).mockReturnValue(mockBreakpoint)
    vi.mocked(useDisconnect).mockReturnValue({ disconnect: mockDisconnect, disconnectAsync: vi.fn() })
    vi.mocked(useRouterWithHistory).mockReturnValue({ push: mockPush } as any)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should render ConnectButton when not connected', () => {
    render(<HeaderConnect />)
    expect(screen.getByTestId('connect-button')).toBeInTheDocument()
    expect(screen.queryByTestId('header-profile')).not.toBeInTheDocument()
  })

  it('should render HeaderProfile when connected without ENS name', () => {
    vi.mocked(useAccountSafely).mockReturnValue({ address: '0x123' as Address, chainId: 1 })
    vi.mocked(usePrimaryName).mockReturnValue({ ...mockPrimaryName, data: undefined })
    vi.mocked(useEnsAvatar).mockReturnValue({ data: null, isLoading: false })
    vi.mocked(useZorb).mockReturnValue('zorb-url')
    vi.mocked(useHasPendingTransactions).mockReturnValue(false)

    render(<HeaderConnect />)
    expect(screen.getByTestId('header-profile')).toBeInTheDocument()
    expect(screen.queryByTestId('connect-button')).not.toBeInTheDocument()
  })

  it('should render HeaderProfile when connected with ENS name', () => {
    vi.mocked(useAccountSafely).mockReturnValue({ address: '0x123' as Address, chainId: 1 })
    vi.mocked(usePrimaryName).mockReturnValue(mockPrimaryName)
    vi.mocked(useEnsAvatar).mockReturnValue({ data: 'avatar-url', isLoading: false })
    vi.mocked(useZorb).mockReturnValue('zorb-url')
    vi.mocked(useHasPendingTransactions).mockReturnValue(false)

    render(<HeaderConnect />)
    const profile = screen.getByTestId('header-profile')
    expect(profile).toBeInTheDocument()
    expect(screen.getByText('test.eth')).toBeInTheDocument()
  })

  it('should handle pending transactions indicator', () => {
    vi.mocked(useAccountSafely).mockReturnValue({ address: '0x123' as Address, chainId: 1 })
    vi.mocked(usePrimaryName).mockReturnValue(mockPrimaryName)
    vi.mocked(useEnsAvatar).mockReturnValue({ data: null, isLoading: false })
    vi.mocked(useZorb).mockReturnValue('zorb-url')
    vi.mocked(useHasPendingTransactions).mockReturnValue(true)

    render(<HeaderConnect />)
    expect(screen.getByTestId('header-profile')).toBeInTheDocument()
  })
})

describe('HeaderProfile', () => {
  const mockDisconnect = vi.fn()
  const mockPush = vi.fn()
  const TEST_ADDRESS = '0x123456789abcdef' as Address

  beforeEach(() => {
    vi.mocked(usePrimaryName).mockReturnValue(mockPrimaryName)
    vi.mocked(useEnsAvatar).mockReturnValue({ data: null, isLoading: false })
    vi.mocked(useZorb).mockReturnValue('zorb-url')
    vi.mocked(useHasPendingTransactions).mockReturnValue(false)
    vi.mocked(useDisconnect).mockReturnValue({ disconnect: mockDisconnect, disconnectAsync: vi.fn() })
    vi.mocked(useRouterWithHistory).mockReturnValue({ push: mockPush } as any)
    vi.mocked(useAccountSafely).mockReturnValue({ address: TEST_ADDRESS, chainId: 1 })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should render with ENS name', () => {
    render(<HeaderConnect />)
    expect(screen.getByText('test.eth')).toBeInTheDocument()
    expect(screen.getByTestId('header-profile')).toBeInTheDocument()
  })

  it('should render with address when no ENS name', () => {
    vi.mocked(useAccountSafely).mockReturnValue({
      address: TEST_ADDRESS,
      chainId: 1,
      chain: { id: 1, name: 'Mainnet' },
      connector: undefined,
      isConnected: true,
      isConnecting: false,
      isDisconnected: false,
      isReconnecting: false,
      status: 'connected',
    })
    vi.mocked(usePrimaryName).mockReturnValue({
      ...mockPrimaryName,
      data: undefined,
      isSuccess: true,
      status: 'success',
      refetch: vi.fn(),
      isRefetching: false,
      isFetching: false,
      isPlaceholderData: false,
      isPaused: false,
    })
    render(<HeaderConnect />)
    expect(screen.getByText('0x1234...cdef')).toBeInTheDocument()
  })

  it('should render with avatar when available', () => {
    vi.mocked(useEnsAvatar).mockReturnValue({ data: 'avatar-url' })
    render(<HeaderConnect />)
    const profile = screen.getByTestId('header-profile')
    expect(profile).toBeInTheDocument()
  })

  it('should render with zorb when no avatar', () => {
    vi.mocked(useEnsAvatar).mockReturnValue({ data: null })
    render(<HeaderConnect />)
    const profile = screen.getByTestId('header-profile')
    expect(profile).toBeInTheDocument()
  })

  it('should render with pending transactions indicator', () => {
    vi.mocked(useHasPendingTransactions).mockReturnValue(true)
    render(<HeaderConnect />)
    const profile = screen.getByTestId('header-profile')
    expect(profile).toBeInTheDocument()
  })
})
