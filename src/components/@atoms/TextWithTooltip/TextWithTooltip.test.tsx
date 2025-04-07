import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { ThemeProvider } from 'styled-components'
import { describe, expect, it } from 'vitest'

import { lightTheme } from '@ensdomains/thorin'

import { TextWithTooltip } from './TextWithTooltip'

const renderWithTheme = (component: React.ReactNode) => {
  return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>)
}

describe('TextWithTooltip', () => {
  it('should render children and show tooltip on hover', async () => {
    renderWithTheme(<TextWithTooltip tooltipContent="This is a tooltip">Hover me</TextWithTooltip>)

    const button = screen.getByText('Hover me')
    expect(button).toBeInTheDocument()

    await userEvent.hover(button)
    expect(screen.getByText('This is a tooltip')).toBeInTheDocument()
  })

  it('should render learn more link when link prop is provided', async () => {
    renderWithTheme(
      <TextWithTooltip tooltipContent="Tooltip with link" link="https://example.com">
        With link
      </TextWithTooltip>,
    )

    const button = screen.getByText('With link')
    await userEvent.hover(button)

    const learnMoreLink = screen.getByText('action.learnMore')
    expect(learnMoreLink).toBeInTheDocument()
    expect(learnMoreLink.closest('a')).toHaveAttribute('href', 'https://example.com')
    expect(learnMoreLink.closest('a')).toHaveAttribute('target', '_blank')
    expect(learnMoreLink.closest('a')).toHaveAttribute('rel', 'noreferrer noopener')
  })

  it('should not render learn more link when link prop is not provided', async () => {
    renderWithTheme(
      <TextWithTooltip tooltipContent="Tooltip without link">No link</TextWithTooltip>,
    )

    const button = screen.getByText('No link')
    await userEvent.hover(button)

    expect(screen.queryByText('action.learnMore')).not.toBeInTheDocument()
  })
})
