import { render, screen } from '@app/test-utils'

import { describe, expect, it } from 'vitest'

import { yearsToSeconds } from '@app/utils/utils'

import { PaymentMethod } from '../../types'
import { ActionButton, ActionButtonProps } from './Pricing'

describe('ActionButton', () => {
  const baseMockData: ActionButtonProps = {
    address: '0x123',
    hasPendingMoonpayTransaction: false,
    hasFailedMoonpayTransaction: false,
    paymentMethodChoice: '',
    reverseRecord: false,
    callback: () => null,
    initiateMoonpayRegistrationMutation: {
      mutate: () => null,
    } as any,
    seconds: yearsToSeconds(1),
    balance: { value: 100n } as any,
    totalRequiredBalance: 1n,
    estimatedTotal: 1n,
    ethPrice: 1n,
    durationType: 'years',
  }
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
          balance: { value: 0n } as any,
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
          balance: { value: 0n } as any,
        }}
      />,
    )
    expect(screen.getByText('action.next')).toBeInTheDocument()
  })
})
