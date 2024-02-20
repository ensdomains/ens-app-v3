import { mockFunction, render, screen } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import { useGasPrice } from '@app/hooks/chain/useGasPrice'
import { useTransactionGasEstimates } from '@app/hooks/chain/useTransactionGasEstimates'
import { usePrice } from '@app/hooks/ensjs/public/usePrice'

import ExtendNames from './ExtendNames-flow'

vi.mock('@app/hooks/chain/useGasPrice')
vi.mock('@app/hooks/chain/useTransactionGasEstimates')
vi.mock('@app/hooks/ensjs/public/usePrice')

const mockUseGasPrice = mockFunction(useGasPrice)
const mockUseTransactionGasEstimates = mockFunction(useTransactionGasEstimates)
const mockUsePrice = mockFunction(usePrice)

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
vi.mock(
  '@app/components/@atoms/RegistrationTimeComparisonBanner/RegistrationTimeComparisonBanner',
  async () => {
    const originalModule = await vi.importActual(
      '@app/components/@atoms/RegistrationTimeComparisonBanner/RegistrationTimeComparisonBanner',
    )
    return {
      ...originalModule,
      RegistrationTimeComparisonBanner: vi.fn(() => <div>RegistrationTimeComparisonBanner</div>),
    }
  },
)

describe('Extendnames', () => {
  mockUseGasPrice.mockReturnValue({
    gasPrice: 100n,
  })
  mockUseTransactionGasEstimates.mockReturnValue({
    data: { reduced: 21000n },
    error: null,
    isLoading: true,
  })
  mockUsePrice.mockReturnValue({
    data: {
      base: 100n,
      premium: 0n,
    },
    isLoading: false,
  })
  it('should render', async () => {
    render(
      <ExtendNames
        {...{ data: { names: ['nick.eth'] }, dispatch: () => null, onDismiss: () => null }}
      />,
    )
  })
  it('should have RegistrationTimeComparisonBanner greyed out if gas limit estimation is still loading', () => {
    render(
      <ExtendNames
        {...{ data: { names: ['nick.eth'] }, dispatch: () => null, onDismiss: () => null }}
      />,
    )
    const optionBar = screen.getByText('RegistrationTimeComparisonBanner')
    const { parentElement } = optionBar
    expect(parentElement).toHaveStyle('opacity: 0.5')
  })
  it('should have Invoice greyed out if gas limit estimation is still loading', () => {
    render(
      <ExtendNames
        {...{ data: { names: ['nick.eth'] }, dispatch: () => null, onDismiss: () => null }}
      />,
    )
    const optionBar = screen.getByText('Invoice')
    const { parentElement } = optionBar
    expect(parentElement).toHaveStyle('opacity: 0.5')
  })
  it('should disabled next button if gas limit estimation is still loading', () => {
    render(
      <ExtendNames
        {...{ data: { names: ['nick.eth'] }, dispatch: () => null, onDismiss: () => null }}
      />,
    )
    const trailingButton = screen.getByTestId('extend-names-confirm')
    expect(trailingButton).toHaveAttribute('disabled')
  })
})
