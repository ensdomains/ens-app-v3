import { render, screen, waitFor } from '@app/test-utils'

import { describe, expect, it } from 'vitest'

import {
  hasMeaningfulGasSavings,
  RegistrationTimeComparisonBanner,
} from './RegistrationTimeComparisonBanner'

describe('RegistrationTimeComparisonBanner', () => {
  it('should render correctly', async () => {
    render(
      <RegistrationTimeComparisonBanner
        transactionFee={1000000000000000000n}
        yearlyFee={1000000000000000000n}
      />,
    )

    await waitFor(() => {
      expect(screen.getByText('unit.gas.50%')).toBeVisible()
    })
    expect(screen.getByText(`unit.gas.33%`))
    expect(screen.getByText(`unit.gas.17%`))
  })
})

describe('hasMeaningfulGasSavings', () => {
  it('should return true when gas fee is high relative to yearly fee', () => {
    const yearlyFee = 1000000000000000000n // 1 ETH
    const transactionFee = 1000000000000000000n // 1 ETH (equal to yearly fee)
    expect(hasMeaningfulGasSavings(yearlyFee, transactionFee)).toBe(true)
  })

  it('should return true when savings are at the 5% threshold', () => {
    const yearlyFee = 1000000000000000000n // 1 ETH
    const transactionFee = 100000000000000000n // 0.1 ETH (gives ~7% savings)
    expect(hasMeaningfulGasSavings(yearlyFee, transactionFee)).toBe(true)
  })

  it('should return false when gas fee is very low relative to yearly fee', () => {
    const yearlyFee = 1000000000000000000n // 1 ETH
    const transactionFee = 10000000000000000n // 0.01 ETH (1% of yearly fee)
    expect(hasMeaningfulGasSavings(yearlyFee, transactionFee)).toBe(false)
  })

  it('should return false when savings are below 5%', () => {
    const yearlyFee = 100000000000000000000n // 100 ETH
    const transactionFee = 100000000000000000n // 0.1 ETH (very small relative to yearly fee)
    expect(hasMeaningfulGasSavings(yearlyFee, transactionFee)).toBe(false)
  })
})
