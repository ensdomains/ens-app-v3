import { render, screen } from '@app/test-utils'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { YearSelection } from './YearSelection'

const now = new Date()

describe('YearSelection', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })
  it('should render a plus minus counter if no name was provided', () => {
    render(<YearSelection minDate={now} date={now} setDate={() => {}} />)

    expect(screen.getByTestId('plus-minus-control-input')).toBeInTheDocument()
  })
  it('should render a plus minus counter if multiple names were provided (bulk extension)', () => {
    render(<YearSelection minDate={now} date={now} setDate={() => {}} />)

    expect(screen.getByTestId('plus-minus-control-input')).toBeInTheDocument()
  })
})
