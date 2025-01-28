import { render, screen } from '@app/test-utils'
import { describe, expect, it } from 'vitest'
import { SocialIcon } from './SocialIcon'
import userEvent from '@testing-library/user-event'

describe('SocialIcon', () => {
  const mockIcon = () => <svg data-testid="mock-icon" />
  const mockColoredIcon = () => <svg data-testid="mock-colored-icon" />

  it('should render icon and external link with correct attributes', () => {
    render(
      <SocialIcon
        Icon={mockIcon}
        href="https://example.com"
      />,
    )
    const link = screen.getByRole('link')
    const icon = screen.getByTestId('mock-icon')

    expect(icon).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(icon.parentElement).toHaveStyle({ fill: expect.stringContaining('greyPrimary') })
  })

  it('should render and handle colored icon correctly', () => {
    render(
      <SocialIcon
        Icon={mockIcon}
        ColoredIcon={mockColoredIcon}
        href="https://example.com"
      />,
    )
    const defaultIcon = screen.getByTestId('mock-icon')
    const coloredIcon = screen.getByTestId('mock-colored-icon')
    
    expect(defaultIcon).toBeInTheDocument()
    expect(coloredIcon).toBeInTheDocument()
    expect(coloredIcon.parentElement).toHaveStyle({ opacity: '0' })
  })

  it('should handle hover states correctly', async () => {
    const customColor = '#ff0000'
    render(
      <SocialIcon
        Icon={mockIcon}
        ColoredIcon={mockColoredIcon}
        color={customColor}
        href="https://example.com"
      />,
    )
    const link = screen.getByRole('link')
    const defaultIcon = screen.getByTestId('mock-icon')
    const coloredIcon = screen.getByTestId('mock-colored-icon')

    expect(defaultIcon.parentElement).toHaveStyle({ fill: expect.stringContaining('greyPrimary') })
    expect(coloredIcon.parentElement).toHaveStyle({ opacity: '0' })

    await userEvent.hover(link)
    
    expect(defaultIcon.parentElement).toHaveStyle({ fill: customColor })
    expect(coloredIcon.parentElement).toHaveStyle({ opacity: '1' })

    await userEvent.unhover(link)
    
    expect(defaultIcon.parentElement).toHaveStyle({ fill: expect.stringContaining('greyPrimary') })
    expect(coloredIcon.parentElement).toHaveStyle({ opacity: '0' })
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

  it('should render without ColoredIcon prop', () => {
    render(
      <SocialIcon
        Icon={mockIcon}
        href="https://example.com"
      />,
    )
    const defaultIcon = screen.getByTestId('mock-icon')
    expect(defaultIcon).toBeInTheDocument()
    expect(screen.queryByTestId('mock-colored-icon')).not.toBeInTheDocument()
  })
})
