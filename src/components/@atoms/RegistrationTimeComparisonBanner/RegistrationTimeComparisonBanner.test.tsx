import { render, screen, waitFor } from '@app/test-utils'

import { describe, expect, it } from 'vitest'

import { RegistrationTimeComparisonBanner } from './RegistrationTimeComparisonBanner'

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
