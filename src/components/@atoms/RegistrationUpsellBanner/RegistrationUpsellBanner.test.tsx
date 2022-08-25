import { render, screen } from '@app/test-utils'
import { RegistrationUpsellBanner } from './RegistrationUpsellBanner'

describe('RegistrationUpsellBanner', () => {
  it('should render correctly', async () => {
    render(<RegistrationUpsellBanner transactionFee={1} rentFee={1} />)
    expect(screen.getByText('50% gas')).toBeVisible()
    const oneSixthPct = Math.round((1 / 6) * 100)
    expect(screen.getByText(`${oneSixthPct}% gas`))
    const oneSixteenthPct = Math.round((1 / 16) * 100)
    expect(screen.getByText(`${oneSixteenthPct}% gas`))
  })
})
