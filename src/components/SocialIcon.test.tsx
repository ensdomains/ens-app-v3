import { render, screen } from '@app/test-utils'
import { describe, expect, it } from 'vitest'
import { SocialIcon } from './SocialIcon'
import userEvent from '@testing-library/user-event'

describe('SocialIcon', () => {
  const mockIcon = () => <svg data-testid="mock-icon" />
  const mockColoredIcon = () => <svg data-testid="mock-colored-icon" />

  it('should render icon and external link', () => {
    render(
      <SocialIcon
        Icon={mockIcon}
        href="https://example.com"
      />,
    )
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://example.com')
    expect(screen.getByRole('link')).toHaveAttribute('target', '_blank')
  })

  it('should render colored icon when provided', () => {
    render(
      <SocialIcon
        Icon={mockIcon}
        ColoredIcon={mockColoredIcon}
        href="https://example.com"
      />,
    )
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument()
    expect(screen.getByTestId('mock-colored-icon')).toBeInTheDocument()
  })

  it('should apply custom color when provided', () => {
    render(
      <SocialIcon
        Icon={mockIcon}
        color="#ff0000"
        href="https://example.com"
      />,
    )
    const iconWrapper = screen.getByTestId('mock-icon').parentElement
    expect(iconWrapper).toHaveStyle({ fill: expect.stringContaining('greyPrimary') })
  })

  it('should show colored icon on hover when ColoredIcon is provided', async () => {
    render(
      <SocialIcon
        Icon={mockIcon}
        ColoredIcon={mockColoredIcon}
        href="https://example.com"
      />,
    )
    const link = screen.getByRole('link')
    const coloredIcon = screen.getByTestId('mock-colored-icon')
    
    expect(coloredIcon.parentElement).toHaveStyle({ opacity: '0' })
    await userEvent.hover(link)
    expect(coloredIcon.parentElement).toHaveStyle({ opacity: '1' })
  })

  it('should change icon color on hover when color prop is provided', async () => {
    const customColor = '#ff0000'
    render(
      <SocialIcon
        Icon={mockIcon}
        color={customColor}
        href="https://example.com"
      />,
    )
    const link = screen.getByRole('link')
    const icon = screen.getByTestId('mock-icon')
    
    expect(icon.parentElement).toHaveStyle({ fill: expect.stringContaining('greyPrimary') })
    await userEvent.hover(link)
    expect(icon.parentElement).toHaveStyle({ fill: customColor })
})
