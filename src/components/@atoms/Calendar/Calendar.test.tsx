import { render, screen } from '@app/test-utils'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { dateToInput, formatExpiry } from '@app/utils/utils'

import { Calendar } from './Calendar'

const now = new Date()
const min = new Date(2049)

describe('Calendar', () => {
  it('should render correctly and set default attributes', () => {
    render(<Calendar value={now} onChange={() =>{}} />)
    expect(screen.getByTestId('calendar')).toHaveAttribute('value', dateToInput(now))
    expect(screen.getByTestId('calendar-date')).toHaveTextContent(formatExpiry(now))
    expect(screen.getByTestId('calendar')).toHaveAttribute('min', dateToInput(now))
  })
  it('should allow setting minimum date', () => {
    render(<Calendar value={now} onChange={() =>{}} min={min} name="test.eth" />)
    expect(screen.getByTestId('calendar')).toHaveAttribute('min', dateToInput(min))
  })
})
