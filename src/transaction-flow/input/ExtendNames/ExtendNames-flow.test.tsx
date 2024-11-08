import { mockFunction, render, screen } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'
import { useAccount, useBalance } from 'wagmi'

import { useEstimateGasWithStateOverride } from '@app/hooks/chain/useEstimateGasWithStateOverride'
import { useExpiry } from '@app/hooks/ensjs/public/useExpiry'
import { usePrice } from '@app/hooks/ensjs/public/usePrice'
import { useEthPrice } from '@app/hooks/useEthPrice'

import { makeMockIntersectionObserver } from '../../../../test/mock/makeMockIntersectionObserver'
import ExtendNames from './ExtendNames-flow'

vi.mock('@app/hooks/chain/useEstimateGasWithStateOverride')
vi.mock('@app/hooks/ensjs/public/usePrice')
vi.mock('wagmi')
vi.mock('@app/hooks/ensjs/public/useExpiry')
vi.mock('@app/hooks/useEthPrice')

const mockUseEstimateGasWithStateOverride = mockFunction(useEstimateGasWithStateOverride)
const mockUsePrice = mockFunction(usePrice)
const mockUseAccount = mockFunction(useAccount)
const mockUseBalance = mockFunction(useBalance)
const mockUseEthPrice = mockFunction(useEthPrice)
const mockUseExpiry = mockFunction(useExpiry)

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
  it('should render', async () => {
    render(
      <ExtendNames
        {...{ data: { names: ['nick.eth'] }, dispatch: () => null, onDismiss: () => null }}
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
          data: { names: ['nick.eth'], isSelf: true },
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
          data: { names: ['nick.eth'], isSelf: true },
          dispatch: () => null,
          onDismiss: () => null,
        }}
      />,
    )
    const trailingButton = screen.getByTestId('extend-names-confirm')
    expect(trailingButton).toHaveAttribute('disabled')
  })
})
