import { render, screen } from '@app/test-utils'

import { PaymentMethod } from '../../types'
import { ActionButton } from './Pricing'

describe('ActionButton', () => {
  const baseMockData = {
    address: '0x123',
    hasPendingMoonpayTransaction: false,
    hasFailedMoonpayTransaction: false,
    paymentMethodChoice: '',
    reverseRecord: false,
    callback: () => null,
    initiateMoonpayRegistrationMutation: {
      mutate: () => null,
    },
    years: 1,
    balance: {
      value: {
        lt: () => false,
      },
    },
    totalRequiredBalance: 1,
  } as any

  it('should have disabled "Next" button if no choice has been made', () => {
    render(<ActionButton {...baseMockData} />)
    expect(screen.getByText('action.next')).toBeInTheDocument()
  })
  it('should show "Insufficient balance" if balance is too low and etehreum has been chosen', () => {
    render(
      <ActionButton
        {...{
          ...baseMockData,
          paymentMethodChoice: PaymentMethod.ethereum,
          balance: { value: { lt: () => true } },
        }}
      />,
    )
    expect(screen.getByText('steps.pricing.insufficientBalance')).toBeInTheDocument()
  })
  it('should show "Next" if balance is too low and moonopay has been chosen', () => {
    render(
      <ActionButton
        {...{
          ...baseMockData,
          paymentMethodChoice: PaymentMethod.moonpay,
          balance: { value: { lt: () => true } },
        }}
      />,
    )
    expect(screen.getByText('action.next')).toBeInTheDocument()
  })
})
