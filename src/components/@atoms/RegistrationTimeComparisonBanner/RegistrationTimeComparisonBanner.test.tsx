import { render, screen, waitFor } from '@app/test-utils'

import { BigNumber } from 'ethers'

import { RegistrationTimeComparisonBanner } from './RegistrationTimeComparisonBanner'

describe('RegistrationUpsellBanner', () => {
  it('should render correctly', async () => {
    render(
      <RegistrationTimeComparisonBanner
        transactionFee={BigNumber.from('1000000000000000000')}
        rentFee={BigNumber.from('1000000000000000000')}
      />,
    )

    await waitFor(() => {
      expect(screen.getByText('unit.gas.50%')).toBeVisible()
    })
    expect(screen.getByText(`unit.gas.33%`))
    expect(screen.getByText(`unit.gas.17%`))
  })
})
