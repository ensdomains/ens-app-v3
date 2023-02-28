import { render, screen } from '@app/test-utils'

import { GracePeriodBanner } from './Profile'

describe('GracePeriodBanner', () => {
  it('should display the expiry date of the name', () => {
    const date = new Date()
    render(<GracePeriodBanner {...{ normalisedName: 'nick.eth', expiryDate: date }} />)
    expect(screen.getByText(date.toString(), { exact: false })).toBeVisible()
  })
})
