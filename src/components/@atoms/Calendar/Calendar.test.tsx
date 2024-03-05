import { afterEach, describe, expect, it, vi } from 'vitest'
import { Calendar } from './Calendar'
import {mockFunction, render, screen} from '@app/test-utils'
import { add28Days, dateToInput, formatExpiry } from '@app/utils/utils'
import { useExpiry } from '@app/hooks/ensjs/public/useExpiry'

const now = new Date()

vi.mock('@app/hooks/ensjs/public/useExpiry')

const mockUseExpiry = mockFunction(useExpiry).mockReturnValue({data:undefined})

describe('Calendar', () => {
  afterEach(() => {
      vi.resetAllMocks()
    })

  it('should render correctly', () => {
   
      render(<Calendar value={now} />)

      expect(screen.getByTestId('calendar')).toHaveAttribute('value', dateToInput(now))
      expect(screen.getByTestId('calendar-date')).toHaveTextContent(formatExpiry(now))
      expect(screen.getByTestId('calendar')).toHaveAttribute('min', dateToInput(add28Days(now)))
  })
  it('should set minimum value as 28 from current expiration if name is provided', () => {

    const expiry = new Date(2049)

    mockUseExpiry.mockReturnValue(({ data: { expiry: { date: expiry } } }))

    render(<Calendar value={now} name="test.eth" />)
    expect(screen.getByTestId('calendar')).toHaveAttribute('min', dateToInput(add28Days(expiry)))
  })
})