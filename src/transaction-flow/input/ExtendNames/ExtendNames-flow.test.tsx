import { mockFunction, render, screen } from '@app/test-utils'

import { useEstimateGasLimitForTransactions } from '@app/hooks/useEstimateGasLimitForTransactions'

import { usePrice } from '../../../hooks/usePrice'
import ExtendNames from './ExtendNames-flow'

jest.mock('@app/hooks/useEstimateGasLimitForTransactions')
jest.mock('../../../hooks/usePrice')

const mockUseEstimateGasLimitForTransactions = mockFunction(useEstimateGasLimitForTransactions)
const mockUsePrice = mockFunction(usePrice)

jest.mock('@ensdomains/thorin', () => {
  const originalModule = jest.requireActual('@ensdomains/thorin')
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
  mockUseEstimateGasLimitForTransactions.mockReturnValue({
    gasLimit: '0x5208',
    error: null,
    isLoading: true,
  })
  mockUsePrice.mockReturnValue({
    total: {
      mul: () => 0.1,
    },
    loading: false,
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
