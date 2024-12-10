import { fireEvent, mockFunction, render, screen, waitFor } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import useFaucet from '@app/hooks/useFaucet'

import { makeMockIntersectionObserver } from '../../../test/mock/makeMockIntersectionObserver'
import FaucetBanner from './FaucetBanner'

const chainName = 'goerli'

makeMockIntersectionObserver()

vi.mock('next/router', async () => await vi.importActual('next-router-mock'))

vi.mock('@app/hooks/account/useAccountSafely', () => ({
  useAccountSafely: () => ({ address: '0x1234567890abcdef' }),
}))

vi.mock('@app/hooks/chain/useChainName', () => ({
  useChainName: () => chainName,
}))

vi.mock('@app/hooks/useFaucet')

const mockUseFaucet = mockFunction(useFaucet)

const UseFaucetDefaultMock = {
  data: { amount: '0x123456', eligible: true, interval: 86400000 },
  isLoading: false,
  mutation: {
    isPending: false,
    isError: false,
    isSuccess: false,
    mutate: vi.fn(),
    error: null,
  },
} as const

const UseFaucetSuccessMock = {
  data: { amount: '0x123456', eligible: true, interval: 86400000 },
  isLoading: false,
  mutation: {
    isPending: false,
    isError: false,
    isSuccess: true,
    mutate: vi.fn(),
    error: null,
  },
} as const

describe('FaucetBanner', () => {
  it('renders the banner when data is available and user is eligible', () => {
    mockUseFaucet.mockReturnValue(UseFaucetDefaultMock)

    render(<FaucetBanner />)

    const banner = screen.getByText(`You have unclaimed ${chainName} ETH!`)

    expect(banner).toBeInTheDocument()
  })

  it('opens the dialog when the banner is clicked', async () => {
    mockUseFaucet.mockReturnValue(UseFaucetDefaultMock)

    render(<FaucetBanner />)

    const banner = screen.getByTestId('faucet-banner-trigger')
    fireEvent.click(banner)

    await waitFor(() => {
      expect(screen.getByText(/Faucet Claim/i)).toBeInTheDocument()
    })
  })

  it('closes the dialog when the close button is clicked', async () => {
    mockUseFaucet.mockReturnValue(UseFaucetDefaultMock)

    render(<FaucetBanner />)

    const banner = screen.getByText(`You have unclaimed ${chainName} ETH!`)
    fireEvent.click(banner)

    const closeButton = await screen.findByText(/Close/i)
    fireEvent.click(closeButton)

    await waitFor(() => {
      expect(screen.queryByText(/Faucet Claim/i)).not.toBeInTheDocument()
    })
  })

  it('displays claim success message after submission', async () => {
    mockUseFaucet.mockReturnValue(UseFaucetSuccessMock)

    render(<FaucetBanner />)

    const banner = screen.getByText(`You have unclaimed ${chainName} ETH!`)
    fireEvent.click(banner)

    await waitFor(() => {
      expect(screen.getByText(/Your claim was submitted!/i)).toBeInTheDocument()
      expect(screen.getByText('testnetFaucet.note')).toBeInTheDocument()
    })
  })
})
