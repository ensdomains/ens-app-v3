import { render, screen } from '@app/test-utils'
import { describe, expect, it } from 'vitest'
import { SocialIcon } from './SocialIcon'
import userEvent from '@testing-library/user-event'
import { lightTheme } from '@ensdomains/thorin'

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
    const styledIcon = icon.parentElement
    expect(styledIcon).not.toBeNull()

    expect(icon).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')

    const iconStyles = window.getComputedStyle(styledIcon!)
    expect(iconStyles.height).toBe('100%')
    expect(iconStyles.position).toBe('absolute')
    expect(iconStyles.fill).toBe(lightTheme.colors.greyPrimary)
    expect(iconStyles.transition).toBe('0.15s all ease-in-out')
  })

  it('should render and handle colored icon correctly with proper component rendering', () => {
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
    const styledColoredIcon = coloredIcon.parentElement
    expect(styledColoredIcon).not.toBeNull()

    const coloredIconStyles = window.getComputedStyle(styledColoredIcon!)
    expect(coloredIconStyles.opacity).toBe('0')
    expect(coloredIconStyles.transition).toBe('0.15s all ease-in-out')
    
    // Verify that both icons are rendered with the correct component type
    expect(defaultIcon.parentElement?.getAttribute('as')).toBe(undefined) // Icon is directly rendered
    expect(coloredIcon.parentElement?.getAttribute('as')).toBe(undefined) // ColoredIcon is directly rendered
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
    const styledIcon = defaultIcon.parentElement
    const styledColoredIcon = coloredIcon.parentElement

    const linkStyles = window.getComputedStyle(link)
    expect(linkStyles.display).toBe('flex')
    expect(linkStyles.alignItems).toBe('center')
    expect(linkStyles.justifyContent).toBe('center')
    expect(linkStyles.position).toBe('relative')
    expect(linkStyles.cursor).toBe('pointer')
    expect(linkStyles.width).toBe('1.5rem')
    expect(linkStyles.minHeight).toBe('1.5rem')
    
    const iconStyles = window.getComputedStyle(styledIcon!)
    expect(iconStyles.height).toBe('100%')
    expect(iconStyles.position).toBe('absolute')
    expect(iconStyles.fill).toBe(lightTheme.colors.greyPrimary)
    expect(iconStyles.transition).toBe('0.15s all ease-in-out')

    const coloredIconStyles = window.getComputedStyle(styledColoredIcon!)
    expect(coloredIconStyles.height).toBe('100%')
    expect(coloredIconStyles.position).toBe('absolute')
    expect(coloredIconStyles.opacity).toBe('0')
    expect(coloredIconStyles.transition).toBe('0.15s all ease-in-out')

    await userEvent.hover(link)
    const hoverIconStyles = window.getComputedStyle(styledIcon!)
    const hoverColoredStyles = window.getComputedStyle(styledColoredIcon!)
    expect(hoverIconStyles.fill).toBe(customColor)
    expect(hoverColoredStyles.opacity).toBe('1')
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
    const styledColoredIcon = coloredIcon.parentElement
    
    const initialStyles = window.getComputedStyle(styledColoredIcon!)
    expect(initialStyles.height).toBe('100%')
    expect(initialStyles.position).toBe('absolute')
    expect(initialStyles.opacity).toBe('0')
    expect(initialStyles.transition).toBe('0.15s all ease-in-out')
    
    await userEvent.hover(link)
    const hoverStyles = window.getComputedStyle(styledColoredIcon!)
    expect(hoverStyles.opacity).toBe('1')
    
    await userEvent.unhover(link)
    const unhoverStyles = window.getComputedStyle(styledColoredIcon!)
    expect(unhoverStyles.opacity).toBe('0')
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
    const styledIcon = icon.parentElement
    
    const iconStyles = window.getComputedStyle(styledIcon!)
    expect(iconStyles.height).toBe('100%')
    expect(iconStyles.position).toBe('absolute')
    expect(iconStyles.fill).toBe(lightTheme.colors.greyPrimary)
    expect(iconStyles.transition).toBe('0.15s all ease-in-out')
    
    await userEvent.hover(link)
    const hoverStyles = window.getComputedStyle(styledIcon!)
    expect(hoverStyles.fill).toBe(customColor)
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
    const icon = screen.getByTestId('mock-icon')
    const linkStyles = window.getComputedStyle(link)
    expect(linkStyles.position).toBe('relative')
    expect(linkStyles.cursor).toBe('pointer')
    expect(linkStyles.display).toBe('flex')
    expect(linkStyles.alignItems).toBe('center')
    expect(linkStyles.justifyContent).toBe('center')

    const wrapperStyles = window.getComputedStyle(icon.parentElement!)
    expect(wrapperStyles.position).toBe('relative')
    
    const iconStyles = window.getComputedStyle(icon)
    expect(iconStyles.height).toBe('100%')
    expect(iconStyles.position).toBe('absolute')
    expect(iconStyles.transition).toBe('0.15s all ease-in-out')
  })

  it('should have correct default styles and props', () => {
    render(
      <SocialIcon
        Icon={mockIcon}
        href="https://example.com"
      />,
    )
    const link = screen.getByRole('link')
    const icon = screen.getByTestId('mock-icon')
    
    // Test SocialIconWrapper styles
    const linkStyles = window.getComputedStyle(link)
    expect(linkStyles.display).toBe('flex')
    expect(linkStyles.alignItems).toBe('center')
    expect(linkStyles.justifyContent).toBe('center')
    expect(linkStyles.width).toBe(lightTheme.space['6'])
    expect(linkStyles.minHeight).toBe(lightTheme.space['6'])
    expect(linkStyles.position).toBe('relative')
    expect(linkStyles.cursor).toBe('pointer')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('href', 'https://example.com')
    
    const iconStyles = window.getComputedStyle(icon.parentElement!)
    expect(iconStyles.position).toBe('absolute')
    expect(iconStyles.height).toBe('100%')
    expect(iconStyles.fill).toBe(lightTheme.colors.greyPrimary)
    
    // Check that key prop is set correctly
    expect(icon.parentElement).toHaveAttribute('key', 'https://example.com')
  })

  it('should have correct styles for StyledColoredIcon', () => {
    render(
      <SocialIcon
        Icon={mockIcon}
        ColoredIcon={mockColoredIcon}
        href="https://example.com"
      />,
    )
    const coloredIcon = screen.getByTestId('mock-colored-icon')
    const styledColoredIcon = coloredIcon.parentElement
    expect(styledColoredIcon).not.toBeNull()

    const coloredIconStyles = window.getComputedStyle(styledColoredIcon!)
    expect(coloredIconStyles.opacity).toBe('0')
    expect(coloredIconStyles.transition).toBe('0.15s all ease-in-out')
  })

  it('should apply custom color on hover', async () => {
    const customColor = '#ff0000'
    render(
      <SocialIcon
        Icon={mockIcon}
        color={customColor}
        href="https://example.com"
      />,
    )
    const icon = screen.getByTestId('mock-icon')
    const link = screen.getByRole('link')
    
    const wrapperStyles = window.getComputedStyle(icon.parentElement!)
    expect(wrapperStyles.position).toBe('relative')
    
    const iconStyles = window.getComputedStyle(icon)
    expect(iconStyles.height).toBe('100%')
    expect(iconStyles.position).toBe('absolute')
    expect(iconStyles.fill).toBe(lightTheme.colors.greyPrimary)
    
    await userEvent.hover(link)
    const hoverStyles = window.getComputedStyle(icon.parentElement!)
    expect(hoverStyles.fill).toBe(customColor)
    expect(hoverStyles.position).toBe('absolute')
    expect(hoverStyles.height).toBe('100%')
    expect(hoverStyles.transition).toBe('0.15s all ease-in-out')
  })

  it('should handle hover state transitions for both icons', async () => {
    const customColor = '#ff0000'
    render(
      <SocialIcon
        Icon={mockIcon}
        ColoredIcon={mockColoredIcon}
        color={customColor}
        href="https://example.com"
      />,
    )
    const defaultIcon = screen.getByTestId('mock-icon')
    const coloredIcon = screen.getByTestId('mock-colored-icon')
    const link = screen.getByRole('link')
    const coloredIconWrapper = coloredIcon.parentElement?.parentElement

    const styledIcon = defaultIcon.parentElement
    const styledColoredIcon = coloredIcon.parentElement
    const socialIconWrapper = styledIcon?.parentElement
    expect(styledIcon).not.toBeNull()
    expect(styledColoredIcon).not.toBeNull()
    expect(socialIconWrapper).not.toBeNull()

    const iconStyles = window.getComputedStyle(styledIcon!)
    const coloredIconStyles = window.getComputedStyle(styledColoredIcon!)
    const wrapperStyles = window.getComputedStyle(socialIconWrapper!)

    // StyledIcon styles
    expect(iconStyles.fill).toBe(lightTheme.colors.greyPrimary)
    expect(iconStyles.position).toBe('absolute')
    expect(iconStyles.height).toBe('100%')
    expect(iconStyles.transition).toBe('0.15s all ease-in-out')

    // StyledColoredIcon styles
    expect(coloredIconStyles.opacity).toBe('0')
    expect(coloredIconStyles.position).toBe('absolute')
    expect(coloredIconStyles.height).toBe('100%')
    expect(coloredIconStyles.transition).toBe('0.15s all ease-in-out')

    await userEvent.hover(link)
    const hoverIconStyles = window.getComputedStyle(styledIcon!)
    const hoverColoredStyles = window.getComputedStyle(styledColoredIcon!)
    expect(hoverIconStyles.fill).toBe(customColor)
    expect(hoverIconStyles.position).toBe('absolute')
    expect(hoverIconStyles.height).toBe('100%')
    expect(hoverIconStyles.transition).toBe('0.15s all ease-in-out')
    expect(hoverColoredStyles.opacity).toBe('1')
    expect(hoverColoredStyles.position).toBe('absolute')
    expect(hoverColoredStyles.height).toBe('100%')
    expect(hoverColoredStyles.transition).toBe('0.15s all ease-in-out')

    await userEvent.unhover(link)
    const unhoverIconStyles = window.getComputedStyle(styledIcon!)
    const unhoverColoredStyles = window.getComputedStyle(styledColoredIcon!)
    expect(unhoverIconStyles.fill).toBe(lightTheme.colors.greyPrimary)
    expect(unhoverIconStyles.position).toBe('absolute')
    expect(unhoverIconStyles.height).toBe('100%')
    expect(unhoverIconStyles.transition).toBe('0.15s all ease-in-out')
    expect(unhoverColoredStyles.opacity).toBe('0')
    expect(unhoverColoredStyles.position).toBe('absolute')
    expect(unhoverColoredStyles.height).toBe('100%')
    expect(unhoverColoredStyles.transition).toBe('0.15s all ease-in-out')
  })

  it('should maintain default fill color on hover when no custom color is provided', async () => {
    render(
      <SocialIcon
        Icon={mockIcon}
        href="https://example.com"
      />,
    )
    const defaultIcon = screen.getByTestId('mock-icon')
    const link = screen.getByRole('link')

    const styledIcon = defaultIcon.parentElement
    const socialIconWrapper = styledIcon?.parentElement
    expect(styledIcon).not.toBeNull()
    expect(socialIconWrapper).not.toBeNull()

    const iconStyles = window.getComputedStyle(styledIcon!)
    const wrapperStyles = window.getComputedStyle(socialIconWrapper!)

    // StyledIcon styles
    expect(iconStyles.fill).toBe(lightTheme.colors.greyPrimary)
    expect(iconStyles.position).toBe('absolute')
    expect(iconStyles.height).toBe('100%')
    expect(iconStyles.transition).toBe('0.15s all ease-in-out')

    // SocialIconWrapper styles
    expect(wrapperStyles.position).toBe('relative')
    expect(wrapperStyles.display).toBe('flex')
    expect(wrapperStyles.alignItems).toBe('center')
    expect(wrapperStyles.justifyContent).toBe('center')
    
    await userEvent.hover(link)
    const hoverStyles = window.getComputedStyle(defaultIcon.parentElement!)
    expect(hoverStyles.fill).toBe(lightTheme.colors.greyPrimary)
    
    await userEvent.unhover(link)
    const unhoverStyles = window.getComputedStyle(defaultIcon.parentElement!)
    expect(unhoverStyles.fill).toBe(lightTheme.colors.greyPrimary)
  })

  it('should verify theme-based spacing for width and height', () => {
    render(
      <SocialIcon
        Icon={mockIcon}
        href="https://example.com"
      />,
    )
    const link = screen.getByRole('link')
    const linkStyles = window.getComputedStyle(link)
    expect(linkStyles.width).toBe(lightTheme.space['6'])
    expect(linkStyles.minHeight).toBe(lightTheme.space['6'])
  })

  it('should verify transition timing for all styled components', () => {
    render(
      <SocialIcon
        Icon={mockIcon}
        ColoredIcon={mockColoredIcon}
        href="https://example.com"
      />,
    )
    const defaultIcon = screen.getByTestId('mock-icon')
    const coloredIcon = screen.getByTestId('mock-colored-icon')
    const styledIcon = defaultIcon.parentElement
    const styledColoredIcon = coloredIcon.parentElement

    const iconStyles = window.getComputedStyle(styledIcon!)
    expect(iconStyles.height).toBe('100%')
    expect(iconStyles.position).toBe('absolute')
    expect(iconStyles.transition).toBe('0.15s all ease-in-out')

    const coloredIconStyles = window.getComputedStyle(styledColoredIcon!)
    expect(coloredIconStyles.height).toBe('100%')
    expect(coloredIconStyles.position).toBe('absolute')
    expect(coloredIconStyles.transition).toBe('0.15s all ease-in-out')
  })

  it('should handle required props correctly', () => {
    render(
      <SocialIcon
        Icon={mockIcon}
        href="https://example.com"
      />,
    )
    const link = screen.getByRole('link')
    const icon = screen.getByTestId('mock-icon')

    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(icon).toBeInTheDocument()
  })
})
