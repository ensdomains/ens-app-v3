import { render, screen } from '@app/test-utils'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { ONE_YEAR } from '@app/utils/time'

import { DateSelection } from './DateSelection'

describe('DateSelection', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })
  it('should render a plus minus counter if no name was provided', () => {
    render(<DateSelection minSeconds={0} seconds={ONE_YEAR} setSeconds={() => {}} />)

    expect(screen.getByTestId('plus-minus-control-input')).toBeInTheDocument()
  })
  it('should show a calendar if user is picking by date', async () => {
    render(<DateSelection minSeconds={0} seconds={ONE_YEAR} setSeconds={() => {}} />)

    await screen.getByTestId('date-selection').click()

    expect(screen.getByText('1 year registration.', { exact: true })).toBeVisible()
  })
})
