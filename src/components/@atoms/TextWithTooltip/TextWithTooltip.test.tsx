import { render, screen, userEvent } from '@app/test-utils'

import { describe, expect, it } from 'vitest'

import { TextWithTooltip } from './TextWithTooltip'

describe('TextWithTooltip', () => {
  it('should render tooltip', async () => {
    render(<TextWithTooltip tooltipContent="tooltip-content" />)

    const element = screen.getByTestId('tooltip')
    await userEvent.hover(element)
    expect(screen.getByText('tooltip-content')).toBeInTheDocument()
  })

  it('should render tooltip with link', async () => {
    render(<TextWithTooltip tooltipContent="tooltip-content" link="https://link.com" />)

    const element = screen.getByTestId('tooltip')
    await userEvent.hover(element)
    expect(screen.getByText('tooltip-content')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://link.com')
  })
})
