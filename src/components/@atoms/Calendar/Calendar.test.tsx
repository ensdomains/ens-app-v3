import { render, screen } from '@app/test-utils'

import { fireEvent } from '@testing-library/react'
import { InputHTMLAttributes, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

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
  it('should handle timezone offset correctly', () => {
    const onChangeHandler = vi.fn((e) => {
      if (!e) return

      let { valueAsDate: newValueAsDate } = e.currentTarget
      console.log('newValueAsDate', e.currentTarget)
      if (newValueAsDate) {
        newValueAsDate = new Date(
          newValueAsDate.getTime() + newValueAsDate.getTimezoneOffset() * 60 * 1000,
        )
      }
      console.log('Updated date:', newValueAsDate)
    })
    render(<Calendar value={value} onChange={onChangeHandler} />)

    const calendarInput = screen.getByTestId('calendar')

    fireEvent.change(calendarInput, { target: { value: secondsToDateInput(Date.now() / 1000) } })

    expect(onChangeHandler).toHaveBeenCalledTimes(1)

    const expectedDate = new Date(Date.now())
    expectedDate.setMinutes(expectedDate.getMinutes() + expectedDate.getTimezoneOffset())

    // // Check if the date displayed is in UTC
    const dateDisplayed = screen.getByTestId('calendar-date').textContent
    expect(dateDisplayed).toBe(formatExpiry(expectedDate))
  })
})
