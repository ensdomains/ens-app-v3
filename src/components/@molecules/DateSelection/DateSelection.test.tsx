import { act, mockFunction, render, renderHook, screen, userEvent, waitFor } from '@app/test-utils'

import { useState } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { secondsFromDateDiff } from '@app/utils/date'
import { ONE_DAY, ONE_YEAR } from '@app/utils/time'

import { DateSelection } from './DateSelection'

vi.mock('@app/utils/BreakpointProvider')

const mockUseBreakpoint = mockFunction(useBreakpoint)

describe('DateSelection', () => {
  beforeEach(() => {
    mockUseBreakpoint.mockReturnValue({
      xs: true,
      sm: true,
      md: true,
      lg: false,
      xl: false,
    })
  })
  afterEach(() => {
    vi.resetAllMocks()
  })
  it('should render a plus minus counter if no name was provided', () => {
    render(
      <DateSelection
        minSeconds={0}
        seconds={ONE_YEAR}
        setSeconds={() => {}}
        durationType="years"
      />,
    )

    expect(screen.getByTestId('plus-minus-control-input')).toBeInTheDocument()
  })
  it('should show a calendar if user is picking by date', async () => {
    render(
      <DateSelection minSeconds={0} seconds={ONE_YEAR} setSeconds={() => {}} durationType="date" />,
    )
    expect(screen.getByText('unit.years.1 registration.')).toBeVisible()
  })
  it('should set back to one year when switching to a year toggle if previously was set to less', async () => {
    const { result } = renderHook(() => useState(ONE_YEAR))
    let { result: durationTypeResult } = renderHook(() => useState<'years' | 'date'>('years'))

    const DateSelectionComponent = () => (
      <DateSelection
        minSeconds={0}
        seconds={result.current[0]}
        setSeconds={result.current[1]}
        durationType={durationTypeResult.current[0]}
        onChangeDurationType={durationTypeResult.current[1]}
      />
    )

    const { rerender } = render(<DateSelectionComponent />)

    const dateSelection = screen.getByTestId('date-selection')

    await userEvent.click(dateSelection)

    rerender(<DateSelectionComponent />)

    await waitFor(() => {
      expect(screen.getByText('calendar.pick_by_years')).toBeVisible()
    })

    result.current[1](secondsFromDateDiff({ startDate: new Date(), additionalMonths: 1 }))

    rerender(<DateSelectionComponent />)

    expect(screen.getByText('unit.months.1 registration.')).toBeVisible()

    await userEvent.click(dateSelection)

    rerender(<DateSelectionComponent />)

    await waitFor(() => {
      expect(screen.getByText('calendar.pick_by_date')).toBeVisible()
    })

    rerender(<DateSelectionComponent />)

    expect(screen.getByText('unit.years.1 registration.')).toBeVisible()
  })
})
