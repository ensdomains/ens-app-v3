import { render, screen, waitFor } from '@app/test-utils'

import { BigNumber } from 'ethers'

import { RegistrationTimeComparisonBanner } from './RegistrationTimeComparisonBanner'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (value: string, opts: any) => `${opts.value} ${value}`,
  }),
}))

describe('RegistrationUpsellBanner', () => {
  it('should render correctly', async () => {
    render(
      <RegistrationTimeComparisonBanner
        transactionFee={BigNumber.from('1000000000000000000')}
        rentFee={BigNumber.from('1000000000000000000')}
      />,
    )

    await waitFor(() => {
      expect(screen.getByText('50% unit.gas')).toBeVisible()
    })
    expect(screen.getByText(`33% unit.gas`))
    expect(screen.getByText(`17% unit.gas`))
  })
})
