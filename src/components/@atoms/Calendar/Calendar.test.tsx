import { render, screen } from '@app/test-utils'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { formatExpiry, secondsToDate, secondsToDateInput } from '@app/utils/utils'

import { Calendar } from './Calendar'

const now = 0
const min = 0

describe('Calendar', () => {
  it('should render correctly and set default attributes', () => {
    render(<Calendar value={now} onChange={() => {}} />)
    expect(screen.getByTestId('calendar')).toHaveAttribute('value', secondsToDateInput(now))
    expect(screen.getByTestId('calendar-date')).toHaveTextContent(formatExpiry(secondsToDate(now)))
    expect(screen.getByTestId('calendar')).toHaveAttribute('min', secondsToDateInput(now))
  })
  it('should allow setting minimum date', () => {
    render(<Calendar value={now} onChange={() => {}} min={min} name="test.eth" />)
    expect(screen.getByTestId('calendar')).toHaveAttribute('min', secondsToDateInput(min))
  })
})
