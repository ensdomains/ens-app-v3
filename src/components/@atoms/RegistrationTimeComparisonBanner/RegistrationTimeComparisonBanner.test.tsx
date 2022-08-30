import { BigNumber } from 'ethers'

import { render, screen, waitFor } from '@app/test-utils'

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
        gasPrice={BigNumber.from('100000000000')}
      />,
    )

    await waitFor(() => {
      expect(screen.getByText('50% unit.gas')).toBeVisible()
    })
    const oneSixthPct = Math.floor((1 / 6) * 100)
    expect(screen.getByText(`${oneSixthPct}% unit.gas`))
    const oneSixteenthPct = Math.floor((1 / 16) * 100)
    expect(screen.getByText(`${oneSixteenthPct}% unit.gas`))
  })
})
