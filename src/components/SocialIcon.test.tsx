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
    expect(link).toHaveStyle({ color: 'var(--color-greyPrimary)' })
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
    const link = screen.getByRole('link')
    
    expect(defaultIcon).toBeInTheDocument()
    expect(coloredIcon).toBeInTheDocument()
    const coloredIconWrapper = coloredIcon.parentElement?.parentElement
    expect(coloredIconWrapper).toHaveStyle({ opacity: '0' })
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
    const coloredIconWrapper = coloredIcon.parentElement?.parentElement

    expect(link).toHaveStyle({ color: 'var(--color-greyPrimary)' })
    expect(coloredIconWrapper).toHaveStyle({ opacity: '0' })

    await userEvent.hover(link)
    
    expect(link).toHaveStyle({ color: customColor })
    expect(coloredIconWrapper).toHaveStyle({ opacity: '1' })

    await userEvent.unhover(link)
    
    expect(link).toHaveStyle({ color: 'var(--color-greyPrimary)' })
    expect(coloredIconWrapper).toHaveStyle({ opacity: '0' })
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
    const coloredIconWrapper = coloredIcon.parentElement?.parentElement
    
    expect(coloredIconWrapper).toHaveStyle({ opacity: '0' })
    await userEvent.hover(link)
    expect(coloredIconWrapper).toHaveStyle({ opacity: '1' })
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
    
    expect(link).toHaveStyle({ color: 'var(--color-greyPrimary)' })
    await userEvent.hover(link)
    expect(link).toHaveStyle({ color: customColor })
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

  it('should have correct transition styles', () => {
    render(
      <SocialIcon
        Icon={mockIcon}
        href="https://example.com"
      />,
    )
    const link = screen.getByRole('link')
    expect(link).toHaveStyle({ transition: 'all 0.15s ease-in-out' })
  })
})
