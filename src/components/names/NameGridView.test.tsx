import { render } from '@app/test-utils'

import { Expiry } from './NameGridView'

describe('Expiry', () => {
  it('should show how many days name has been expired for if expired', () => {
    const expiry = new Date(Date.now() - 1000 * 60 * 60 * 24 * 1)
    const { getByText } = render(<Expiry expiry={expiry} />)
    expect(getByText('88d')).toBeVisible()
  })

  it('should render the correct number of months if name has not yet expired', () => {
    const expiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 60)
    const { getByText } = render(<Expiry expiry={expiry} />)
    expect(getByText('2m')).toBeVisible()
  })
})
