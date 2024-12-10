import { fireEvent, mockFunction, render, screen } from '@app/test-utils'

import { InputHTMLAttributes, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { secondsToDate, secondsToDateInput } from '@app/utils/date'
import { formatExpiry } from '@app/utils/utils'

import { Calendar } from './Calendar'

vi.mock('@app/utils/BreakpointProvider')

const mockUseBreakpoint = mockFunction(useBreakpoint)
mockUseBreakpoint.mockReturnValue({
  xs: true,
  sm: true,
  md: true,
  lg: false,
  xl: false,
})

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
  it('should handle timezone offset correctly', async () => {
    const OnChange = vi.fn()
    // Render the Calendar component
    const currentDate = new Date()
    const currentDateSeconds = Math.floor(currentDate.getTime() / 1000)
    render(<Calendar value={currentDateSeconds} onChange={OnChange} />)

    // Find the input element
    const calendarInput = screen.getByTestId('calendar')

    // Prepare new date and format it
    currentDate.setDate(currentDate.getDate() + 2) // Change to the next day
    const newDateSeconds = Math.floor(currentDate.getTime() / 1000)
    const newFormattedDate = secondsToDateInput(newDateSeconds)

    fireEvent.change(calendarInput, { target: { value: newFormattedDate } })

    // Assert the onChange handler was called
    expect(OnChange).toHaveBeenCalledTimes(1)

    const receivedDate = OnChange.mock.calls[0][0].currentTarget.valueAsDate
    const receivedFormattedDate = receivedDate.toISOString().split('T')[0]

    expect(receivedFormattedDate).toEqual(newFormattedDate)
  })
})
