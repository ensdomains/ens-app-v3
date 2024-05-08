import { render, screen } from '@app/test-utils'

import { describe, expect, it } from 'vitest'

import { secondsToDate, secondsToDateInput } from '@app/utils/date'
import { formatExpiry } from '@app/utils/utils'

import { Calendar } from './Calendar'

const value = 3600
const min = 0

describe('Calendar', () => {
  it('should render correctly and set default attributes', () => {
    render(<Calendar value={value} onChange={() => {}} />)
    expect(screen.getByTestId('calendar')).toHaveValue(secondsToDateInput(value))
    expect(screen.getByTestId('calendar-date')).toHaveTextContent(
      formatExpiry(secondsToDate(value)),
    )
    expect(screen.getByTestId('calendar')).toHaveAttribute('min', secondsToDateInput(value))
  })
  it('should allow setting minimum date', () => {
    render(<Calendar value={value} onChange={() => {}} min={min} name="test.eth" />)
    expect(screen.getByTestId('calendar')).toHaveAttribute('min', secondsToDateInput(min))
  })
  it('should not allow setting a date below minimum', () => {
    render(<Calendar value={min} onChange={() => {}} min={value} name="test.eth" />)

    expect(screen.getByTestId('calendar')).toHaveValue(secondsToDateInput(value))
  })
})
