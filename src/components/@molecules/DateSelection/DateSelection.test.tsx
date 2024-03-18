import { render, screen } from '@app/test-utils'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { DateSelection } from './DateSelection'

const now = new Date()

describe('DateSelection', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })
  it('should render a plus minus counter if no name was provided', () => {
    render(<DateSelection minDate={now} date={now} setDate={() => {}} />)

    expect(screen.getByTestId('plus-minus-control-input')).toBeInTheDocument()
  })
  it('should render a plus minus counter if multiple names were provided (bulk extension)', () => {
    render(<DateSelection minDate={now} date={now} setDate={() => {}} />)

    expect(screen.getByTestId('plus-minus-control-input')).toBeInTheDocument()
  })
})
