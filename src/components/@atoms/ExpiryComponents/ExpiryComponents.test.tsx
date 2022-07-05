import { render, screen } from '@app/test-utils'
import { ExpiryClock, ShortExpiry } from './ExpiryComponents'

const twoYearExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 366 * 2)
const yearExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
const monthExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
const expired = new Date(Date.now() - 1)

describe('ExpiryClock', () => {
  it('should be grey if expiry is more than 90 days away', () => {
    render(<ExpiryClock expiry={yearExpiry} />)
    expect(screen.getByTestId('expiry-clock-grey')).toBeVisible()
  })

  it('should be orange if expiry is less than 90 days away', () => {
    render(<ExpiryClock expiry={monthExpiry} />)
    expect(screen.getByTestId('expiry-clock-orange')).toBeVisible()
  })

  it('show be red if expired', () => {
    render(<ExpiryClock expiry={expired} />)
    expect(screen.getByTestId('expiry-clock-red')).toBeVisible()
  })
})

describe('ShortExpiry', () => {
  it('should be grey if expiry is more than 90 days away', () => {
    render(<ShortExpiry expiry={yearExpiry} />)
    expect(screen.getByTestId('short-expiry-foreground')).toBeVisible()
  })

  it('should be orange if expiry is less than 90 days away', () => {
    render(<ShortExpiry expiry={monthExpiry} />)
    expect(screen.getByTestId('short-expiry-orange')).toBeVisible()
  })

  it('show be red if expired', () => {
    render(<ShortExpiry expiry={expired} />)
    expect(screen.getByTestId('short-expiry-red')).toBeVisible()
  })
  it('should show year units if expiry is more than a year away', () => {
    render(<ShortExpiry expiry={twoYearExpiry} />)
    expect(screen.getByText('name.expiresInYears')).toBeVisible()
  })
  it('should show month units if expiry is less than 365 days away', () => {
    render(<ShortExpiry expiry={yearExpiry} />)
    expect(screen.getByText('name.expiresInMonths')).toBeVisible()
  })
  it('should show day units if expiry is less than 90 days away', () => {
    render(<ShortExpiry expiry={monthExpiry} />)
    expect(screen.getByText('name.expiresInDays')).toBeVisible()
  })
})
