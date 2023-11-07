import { mockFunction, render, screen } from '@app/test-utils'

import { usePrice } from '@app/hooks/ensjs/public/usePrice'
import { useEstimateGasLimitForTransaction } from '@app/hooks/gasEstimation/useEstimateGasLimitForTransactions'

import ExtendNames from './ExtendNames-flow'

jest.mock('@app/hooks/gasEstimation/useEstimateGasLimitForTransactions')
jest.mock('@app/hooks/ensjs/public/usePrice')

const mockUseEstimateGasLimitForTransaction = mockFunction(useEstimateGasLimitForTransaction)
const mockUsePrice = mockFunction(usePrice)

jest.mock('@ensdomains/thorin2', () => {
  const originalModule = jest.requireActual('@ensdomains/thorin2')
  return {
    ...originalModule,
    ScrollBox: jest.fn(({ children }) => children),
  }
})
jest.mock('@app/components/@atoms/Invoice/Invoice', () => {
  const originalModule = jest.requireActual('@app/components/@atoms/Invoice/Invoice')
  return {
    ...originalModule,
    Invoice: jest.fn(() => <div>Invoice</div>),
  }
})
jest.mock(
  '@app/components/@atoms/RegistrationTimeComparisonBanner/RegistrationTimeComparisonBanner',
  () => {
    const originalModule = jest.requireActual(
      '@app/components/@atoms/RegistrationTimeComparisonBanner/RegistrationTimeComparisonBanner',
    )
    return {
      ...originalModule,
      RegistrationTimeComparisonBanner: jest.fn(() => <div>RegistrationTimeComparisonBanner</div>),
    }
  },
)

describe('Extendnames', () => {
  mockUseEstimateGasLimitForTransaction.mockReturnValue({
    gasLimit: 21000n,
    gasPrice: 100n,
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
