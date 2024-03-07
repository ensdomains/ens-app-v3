import { render, screen } from '@app/test-utils'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { dateToInput, formatExpiry } from '@app/utils/utils'

import { YearSelection } from './YearSelection'

describe('YearSelection', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })
  it('should render a plus minus counter if no name was provided', () => {
    render(<YearSelection date={new Date()} setDate={() => {}} />)

    expect(screen.getByTestId('plus-minus-control-input')).toBeInTheDocument()
  })
  it('should render a plus minus counter if multiple names were provided (bulk extension)', () => {
    render(<YearSelection date={new Date()} setDate={() => {}} />)

    expect(screen.getByTestId('plus-minus-control-input')).toBeInTheDocument()
  })
})
