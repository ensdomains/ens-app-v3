import { render, screen } from '@app/test-utils'

import { describe, expect, it } from 'vitest'

import { NameAvailableBanner } from './Profile'

describe('NameAvailableBanner', () => {
  it('should display the expiry date of the name', () => {
    const date = new Date(0)
    render(<NameAvailableBanner {...{ normalisedName: 'nick.eth', expiryDate: date }} />)
    expect(
      screen.getByText('1970', {
        exact: false,
      }),
    ).toBeVisible()
  })
})
