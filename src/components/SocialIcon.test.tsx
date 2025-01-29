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

    expect(icon).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveStyle({
      color: lightTheme.colors.greyPrimary
    })
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
    const coloredIconWrapper = coloredIcon.parentElement?.parentElement
    const computedStyles = window.getComputedStyle(coloredIconWrapper!)
    expect(coloredIconWrapper).toHaveStyle({
      height: '100%',
      position: 'absolute',
      opacity: '0',
      transition: '0.15s all ease-in-out'
    })
    
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
    const coloredIconWrapper = coloredIcon.parentElement?.parentElement

    expect(link).toHaveStyle({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      cursor: 'pointer',
      width: '1.5rem',
      minHeight: '1.5rem'
    })
    
    expect(defaultIcon.parentElement).toHaveStyle({
      position: 'absolute',
      height: '100%',
      fill: lightTheme.colors.greyPrimary,
      transition: '0.15s all ease-in-out'
    })

    await userEvent.unhover(link)
    
    expect(link).toHaveStyle('color: rgb(161, 161, 161)')
    expect(coloredIconWrapper).toHaveStyle('opacity: 0')
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
    
    expect(coloredIconWrapper).toHaveStyle({
      opacity: '0',
      transition: '0.15s all ease-in-out'
    })
    await userEvent.hover(link)
    expect(coloredIconWrapper).toHaveStyle({ opacity: '1' })
    await userEvent.unhover(link)
    expect(coloredIconWrapper).toHaveStyle({ opacity: '0' })
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
    
    expect(link).toHaveStyle({
      display: 'flex',
      position: 'relative',
      cursor: 'pointer'
    })
    
    await userEvent.hover(link)
    expect(link).toHaveStyle({
      color: 'rgb(255, 0, 0)'
    })
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
    expect(link).toHaveStyle({
      position: 'relative',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    })
    expect(icon.parentElement).toHaveStyle({
      position: 'absolute',
      height: '100%',
      transition: '0.15s all ease-in-out'
    })
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
    expect(link).toHaveStyle({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: lightTheme.space['6'],
      minHeight: lightTheme.space['6'],
      position: 'relative',
      cursor: 'pointer'
    })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('href', 'https://example.com')
    
    expect(icon.parentElement).toHaveStyle({
      position: 'absolute',
      height: '100%',
      fill: lightTheme.colors.greyPrimary
    })
    
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
    const coloredIconWrapper = coloredIcon.parentElement?.parentElement
    
    expect(coloredIconWrapper).toHaveStyle({
      height: '100%',
      position: 'absolute',
      opacity: '0',
      transition: '0.15s all ease-in-out'
    })
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
    
    const initialIconStyles = window.getComputedStyle(icon)
    expect(initialIconStyles.position).toBe('absolute')
    expect(initialIconStyles.height).toBe('100%')
    expect(initialIconStyles.fill).toBe('hsl(240 6% 63%)')
    
    await userEvent.hover(link)
    const hoverIconStyles = window.getComputedStyle(icon)
    expect(hoverIconStyles.fill).toBe(customColor)
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

    const initialIconStyles = window.getComputedStyle(defaultIcon)
    expect(initialIconStyles.fill).toBe(lightTheme.colors.greyPrimary)
    const initialWrapperStyles = window.getComputedStyle(coloredIconWrapper!)
    expect(initialWrapperStyles.opacity).toBe('0')

    await userEvent.hover(link)
    expect(defaultIcon.parentElement).toHaveStyle({
      fill: customColor,
      transition: '0.15s all ease-in-out'
    })
    const hoverWrapperStyles = window.getComputedStyle(coloredIconWrapper!)
    expect(hoverWrapperStyles.opacity).toBe('1')

    await userEvent.unhover(link)
    const unhoverIconStyles = window.getComputedStyle(defaultIcon)
    expect(unhoverIconStyles.fill).toBe('rgb(161, 161, 161)')
    const unhoverWrapperStyles = window.getComputedStyle(coloredIconWrapper!)
    expect(unhoverWrapperStyles.opacity).toBe('0')
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

    expect(defaultIcon.parentElement).toHaveStyle({
      fill: lightTheme.colors.greyPrimary,
      position: 'absolute',
      height: '100%',
      transition: '0.15s all ease-in-out'
    })
    
    await userEvent.hover(link)
    expect(defaultIcon.parentElement).toHaveStyle({
      fill: lightTheme.colors.greyPrimary
    })
    
    await userEvent.unhover(link)
    expect(defaultIcon.parentElement).toHaveStyle({
      fill: lightTheme.colors.greyPrimary
    })
  })

  it('should verify theme-based spacing for width and height', () => {
    render(
      <SocialIcon
        Icon={mockIcon}
        href="https://example.com"
      />,
    )
    const link = screen.getByRole('link')
    const computedLinkStyles = window.getComputedStyle(link)
    expect(computedLinkStyles.width).toBe(lightTheme.space['6'])
    expect(computedLinkStyles.minHeight).toBe(lightTheme.space['6'])
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
    const coloredIconWrapper = coloredIcon.parentElement?.parentElement

    expect(defaultIcon.parentElement).toHaveStyle({
      position: 'absolute',
      height: '100%',
      transition: '0.15s all ease-in-out'
    })

    expect(coloredIconWrapper).toHaveStyle({
      position: 'absolute',
      height: '100%',
      transition: '0.15s all ease-in-out'
    })
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
