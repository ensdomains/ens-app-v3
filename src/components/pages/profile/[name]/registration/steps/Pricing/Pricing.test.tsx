import { render, screen } from '@app/test-utils'

import { describe, expect, it } from 'vitest'

import { yearsToSeconds } from '@app/utils/utils'

import { ActionButton, ActionButtonProps } from './Pricing'

describe('ActionButton', () => {
  const baseMockData: ActionButtonProps = {
    address: '0x123',
    reverseRecord: false,
    callback: () => null,
    seconds: yearsToSeconds(1),
    balance: { value: 100n } as any,
    totalRequiredBalance: 1n,
    estimatedTotal: 1n,
    ethPrice: 1n,
    durationType: 'years',
  }
  it('should show "Next" button when balance is sufficient', () => {
    render(<ActionButton {...baseMockData} />)
    expect(screen.getByText('action.next')).toBeInTheDocument()
  })
  it('should show "Insufficient balance" if balance is too low', () => {
    render(
      <ActionButton
        {...{
          ...baseMockData,
          balance: { value: 0n } as any,
        }}
      />,
    )
    expect(screen.getByText('steps.pricing.insufficientBalance')).toBeInTheDocument()
  })
})
