import { mockFunction, render, screen } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'
import { Hex } from 'viem'
import { useAccount, useBalance } from 'wagmi'

import { useEstimateGasWithStateOverride } from '@app/hooks/chain/useEstimateGasWithStateOverride'
import { useExpiry } from '@app/hooks/ensjs/public/useExpiry'
import { usePrice } from '@app/hooks/ensjs/public/usePrice'
import { useEthPrice } from '@app/hooks/useEthPrice'
import { useReferrer } from '@app/hooks/useReferrer'
import { useResolvedReferrer } from '@app/hooks/useResolvedReferrer'

import { makeMockIntersectionObserver } from '../../../../test/mock/makeMockIntersectionObserver'
import ExtendNames from './ExtendNames-flow'

vi.mock('@app/hooks/chain/useEstimateGasWithStateOverride')
vi.mock('@app/hooks/ensjs/public/usePrice')
vi.mock('wagmi')
vi.mock('@app/hooks/ensjs/public/useExpiry')
vi.mock('@app/hooks/useEthPrice')
vi.mock('@app/hooks/useReferrer')
vi.mock('@app/hooks/useResolvedReferrer')

const mockUseEstimateGasWithStateOverride = mockFunction(useEstimateGasWithStateOverride)
const mockUsePrice = mockFunction(usePrice)
const mockUseAccount = mockFunction(useAccount)
const mockUseBalance = mockFunction(useBalance)
const mockUseEthPrice = mockFunction(useEthPrice)
const mockUseExpiry = mockFunction(useExpiry)
const mockUseReferrer = mockFunction(useReferrer)
const mockUseResolvedReferrer = mockFunction(useResolvedReferrer)

vi.mock('@ensdomains/thorin', async () => {
  const originalModule = await vi.importActual('@ensdomains/thorin')
  return {
    ...originalModule,
    ScrollBox: vi.fn(({ children }) => children),
  }
})
vi.mock('@app/components/@atoms/Invoice/Invoice', async () => {
  const originalModule = await vi.importActual('@app/components/@atoms/Invoice/Invoice')
  return {
    ...originalModule,
    Invoice: vi.fn(() => <div>Invoice</div>),
  }
})

makeMockIntersectionObserver()

describe('Extendnames', () => {
  mockUseEstimateGasWithStateOverride.mockReturnValue({
    data: { gasEstimate: 21000n, gasCost: 100n },
    gasPrice: 100n,
    error: null,
    isLoading: false,
  })
  mockUsePrice.mockReturnValue({
    data: {
      base: 100n,
      premium: 0n,
    },
    isLoading: false,
  })
  mockUseAccount.mockReturnValue({ address: '0x1234', isConnected: true })
  mockUseBalance.mockReturnValue({ data: { balance: 100n }, isLoading: false })
  mockUseEthPrice.mockReturnValue({ data: 100n, isLoading: false })
  mockUseExpiry.mockReturnValue({ data: { expiry: { date: new Date() } }, isLoading: false })
  mockUseReferrer.mockReturnValue(undefined)
  mockUseResolvedReferrer.mockReturnValue({
    data: undefined,
    isLoading: false,
    isError: false,
    error: null,
  })
  it('should render', async () => {
    render(
      <ExtendNames
        {...{
          data: { names: ['nick.eth'], hasWrapped: false },
          dispatch: () => null,
          onDismiss: () => null,
        }}
      />,
    )
  })
  it('should have Invoice greyed out if gas limit estimation is still loading', () => {
    mockUseEstimateGasWithStateOverride.mockReturnValueOnce({
      data: { gasEstimate: 21000n, gasCost: 100n },
      gasPrice: 100n,
      error: null,
      isLoading: true,
    })
    render(
      <ExtendNames
        {...{
          data: { names: ['nick.eth'], isSelf: true, hasWrapped: false },
          dispatch: () => null,
          onDismiss: () => null,
        }}
      />,
    )
    const optionBar = screen.getByText('Invoice')
    const { parentElement } = optionBar
    expect(parentElement).toHaveStyle('opacity: 0.5')
  })
  it('should disabled next button if the price data is loading ', () => {
    mockUsePrice.mockReturnValueOnce({
      isLoading: true,
    })
    render(
      <ExtendNames
        {...{
          data: { names: ['nick.eth'], isSelf: true, hasWrapped: false },
          dispatch: () => null,
          onDismiss: () => null,
        }}
      />,
    )
    const trailingButton = screen.getByTestId('extend-names-confirm')
    expect(trailingButton).toHaveAttribute('disabled')
  })

  it('should resolve ENS name referrer to hex', async () => {
    const mockReferrerHex = '0x000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045' as Hex

    // Mock useReferrer to return an ENS name
    mockUseReferrer.mockReturnValueOnce('vitalik.eth')

    // Mock useResolvedReferrer to return resolved hex
    mockUseResolvedReferrer.mockReturnValueOnce({
      data: mockReferrerHex,
      isLoading: false,
      isError: false,
      error: null,
    })

    render(
      <ExtendNames
        {...{
          data: { names: ['nick.eth'], isSelf: true, hasWrapped: false },
          dispatch: () => null,
          onDismiss: () => null,
        }}
      />,
    )

    // Verify that useResolvedReferrer was called with the ENS name
    expect(mockUseResolvedReferrer).toHaveBeenCalledWith({ referrer: 'vitalik.eth' })
  })

  it('should handle failed referrer resolution gracefully', async () => {
    mockUseReferrer.mockReturnValueOnce('invalid.eth')
    mockUseResolvedReferrer.mockReturnValueOnce({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Resolution failed'),
    })

    render(
      <ExtendNames
        {...{
          data: { names: ['nick.eth'], isSelf: true, hasWrapped: false },
          dispatch: () => null,
          onDismiss: () => null,
        }}
      />,
    )

    // Component should render without crashing even if resolution fails
    expect(screen.getByTestId('extend-names-modal')).toBeInTheDocument()
  })

  it('should show disabled button but display pricing content while referrer is resolving', () => {
    mockUseReferrer.mockReturnValueOnce('vitalik.eth')
    mockUseResolvedReferrer.mockReturnValueOnce({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    })

    render(
      <ExtendNames
        {...{
          data: { names: ['nick.eth'], isSelf: true, hasWrapped: false },
          dispatch: () => null,
          onDismiss: () => null,
        }}
      />,
    )

    // Pricing content should be visible (Invoice is rendered)
    expect(screen.getByText('Invoice')).toBeInTheDocument()

    // Next button should be disabled while referrer is resolving
    const trailingButton = screen.getByTestId('extend-names-confirm')
    expect(trailingButton).toHaveAttribute('disabled')
  })
})
