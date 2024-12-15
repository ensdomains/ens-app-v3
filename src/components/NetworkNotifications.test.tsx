import { mockFunction, render, screen } from '@app/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAccount } from 'wagmi'

import { NetworkNotifications, shouldOpenModal } from './NetworkNotifications'

vi.mock('wagmi')
const mockUseAccount = mockFunction(useAccount)

vi.mock('./NetworkNotifications', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    shouldOpenModal: (connectedChainName, connectedChainId, setOpen) => {
      console.log('sdfsd')
      setOpen(false)
    },
  }
})

describe('NetworkNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it.only('should show notification if shouldOpenModal sets true', () => {
    mockUseAccount.mockReturnValue({
      chain: {
        name: 'sepolia',
        id: 11155111,
      },
    })

    const { rerender } = render(<NetworkNotifications />)
    rerender(<NetworkNotifications />)
    expect(screen.getByTestId('toast-desktop')).toBeInTheDocument()
  })

  it('should not show notification if on correct chain', () => {
    mockUseAccount.mockReturnValue({
      chain: {
        name: 'ethereum',
        id: 1,
      },
    })

    render(<NetworkNotifications />)
    expect(screen.queryByTestId('toast-desktop')).not.toBeInTheDocument()
  })

  it('should show notification if on wrong chain', () => {
    mockUseAccount.mockReturnValue({
      chain: {
        name: 'sepolia',
        id: 11155111,
      },
    })

    render(<NetworkNotifications />)
    expect(screen.getByTestId('toast-desktop')).toBeInTheDocument()
  })

  it('should close notification when close button is clicked', () => {
    mockUseAccount.mockReturnValue({
      chain: {
        name: 'sepolia',
        id: 11155111,
      },
    })

    render(<NetworkNotifications />)
    const closeButton = screen.getByRole('button', { name: /close/i })
    closeButton.click()
    expect(screen.queryByTestId('toast-desktop')).not.toBeInTheDocument()
  })

  it('should have correct redirect link for sepolia network', () => {
    mockUseAccount.mockReturnValue({
      chain: {
        name: 'sepolia',
        id: 11155111,
      },
    })

    render(<NetworkNotifications />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://sepolia.app.ens.domains')
  })

  it('should have correct redirect link for holesky network', () => {
    mockUseAccount.mockReturnValue({
      chain: {
        name: 'holesky',
        id: 17000,
      },
    })

    render(<NetworkNotifications />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://holesky.app.ens.domains')
  })

  it('should have correct redirect link for ethereum mainnet', () => {
    mockUseAccount.mockReturnValue({
      chain: {
        name: 'ethereum',
        id: 1,
      },
    })

    render(<NetworkNotifications />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://app.ens.domains')
  })

  it('should not show notification if chain is not supported', () => {
    mockUseAccount.mockReturnValue({
      chain: {
        name: 'polygon',
        id: 137,
      },
    })

    render(<NetworkNotifications />)
    expect(screen.queryByTestId('toast-desktop')).not.toBeInTheDocument()
  })

  it('should not show notification if no chain is connected', () => {
    mockUseAccount.mockReturnValue({
      chain: undefined,
    })

    render(<NetworkNotifications />)
    expect(screen.queryByTestId('toast-desktop')).not.toBeInTheDocument()
  })
})
