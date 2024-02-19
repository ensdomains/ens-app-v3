import { render, screen } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import { ExpiryClock, ShortExpiry } from './ExpiryComponents'

vi.mock('@app/hooks/chain/useBlockTimestamp', () => ({
  useBlockTimestamp: () => ({ data: new Date().getTime() }),
}))

const twoYearExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 366 * 2)
const yearExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
const monthExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
const lessThanHourExpired = new Date(Date.now() - 1000 * 60 * 60 * 0.5)
const hourExpired = new Date(Date.now() - 1000 * 60 * 60 * 23)
const expired = new Date(Date.now() - 1000 * 60 * 60 * 24)
const yearExpired = new Date(Date.now() - 1000 * 60 * 60 * 24 * 365)

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
    expect(screen.getByTestId('short-expiry')).toHaveAttribute('data-color', 'grey')
  })

  it('should be orange if expiry is less than 90 days away', () => {
    render(<ShortExpiry expiry={monthExpiry} />)
    expect(screen.getByTestId('short-expiry')).toHaveAttribute('data-color', 'orange')
  })

  it('should be red if expired', () => {
    render(<ShortExpiry expiry={expired} />)
    expect(screen.getByTestId('short-expiry')).toHaveAttribute('data-color', 'red')
  })
  it('should be red if expiring in less than 24 hours', () => {
    render(<ShortExpiry expiry={hourExpired} />)
    expect(screen.getByTestId('short-expiry')).toHaveAttribute('data-color', 'red')
  })
  it('should be red if expired for less than 90 days and has grace period', () => {
    render(<ShortExpiry expiry={expired} hasGracePeriod />)
    expect(screen.getByTestId('short-expiry')).toHaveAttribute('data-color', 'red')
  })
  it('should show year units if expiry is more than a year away', () => {
    render(<ShortExpiry expiry={twoYearExpiry} />)
    expect(screen.getByText('name.expiresInYears.2')).toBeVisible()
  })
  it('should show month units if expiry is less than 365 days away', () => {
    render(<ShortExpiry expiry={yearExpiry} />)
    expect(screen.getByText('name.expiresInMonths.12')).toBeVisible()
  })
  it('should show day units if expiry is less than 90 days away', () => {
    render(<ShortExpiry expiry={monthExpiry} />)
    expect(screen.getByText('name.expiresInDays.29')).toBeVisible()
  })
  it('should inverse numbers if expired', () => {
    render(<ShortExpiry expiry={expired} />)
    expect(screen.getByText('name.expiredInDays.1')).toBeVisible()
  })
  it('should show grace period message if expired for less than 90 days and has grace period', () => {
    render(<ShortExpiry expiry={expired} hasGracePeriod />)
    expect(screen.getByText('name.gracePeriod.expiresInMonths.2')).toBeVisible()
  })
  it('should always show red text for inversed numbers', () => {
    render(<ShortExpiry expiry={yearExpired} />)
    expect(screen.getByText('name.expiredInYears.1')).toBeVisible()
    expect(screen.getByText('name.expiredInYears.1')).toHaveAttribute('data-color', 'red')
  })
  it('should show hours if difference is less than 24 hours', () => {
    render(<ShortExpiry expiry={hourExpired} />)
    expect(screen.getByText('name.expiredInHours.23')).toBeVisible()
  })
  it('should show less than an hour if difference is less than 1 hour', () => {
    render(<ShortExpiry expiry={lessThanHourExpired} />)
    expect(screen.getByText('name.expiredInHours')).toBeVisible()
  })
})
