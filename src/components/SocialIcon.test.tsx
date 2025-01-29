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
    expect(link).toHaveStyle({
      color: theme.colors.greyPrimary
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
    expect(coloredIconWrapper).toHaveStyle({
      opacity: '0',
      height: '100%',
      position: 'absolute',
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
    
    expect(defaultIcon).toHaveStyle({
      position: 'absolute',
      height: '100%',
      fill: theme.colors.greyPrimary,
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
    
    expect(link).toHaveStyle({
      display: 'flex',
      position: 'relative',
      cursor: 'pointer'
    })
    await userEvent.hover(link)
    expect(link).toHaveStyle(`color: ${customColor}`)
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
    expect(icon).toHaveStyle({
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
      width: theme.space['6'],
      minHeight: theme.space['6']
    })
    expect(link).toHaveStyle({
      position: 'relative',
      cursor: 'pointer',
      width: theme.space['6'],
      minHeight: '1.5rem'
    })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('href', 'https://example.com')
    
    // Test StyledIcon styles
    expect(icon).toHaveStyle({
      position: 'absolute',
      height: '100%',
      fill: 'rgb(161, 161, 161)',
      transition: '0.15s all ease-in-out'
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
      transition: '0.15s all ease-in-out',
      opacity: '0'
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
    
    expect(icon).toHaveStyle({
      position: 'absolute',
      height: '100%',
      transition: '0.15s all ease-in-out',
      fill: 'rgb(161, 161, 161)'
    })
    await userEvent.hover(link)
    expect(icon).toHaveStyle(`fill: ${customColor}`)
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

    expect(defaultIcon).toHaveStyle({
      fill: theme.colors.greyPrimary
    })
    expect(coloredIconWrapper).toHaveStyle({
      opacity: '0'
    })

    await userEvent.hover(link)
    expect(defaultIcon).toHaveStyle({
      fill: customColor
    })
    expect(coloredIconWrapper).toHaveStyle('opacity: 1')

    await userEvent.unhover(link)
    expect(defaultIcon).toHaveStyle('fill: rgb(161, 161, 161)')
    expect(coloredIconWrapper).toHaveStyle('opacity: 0')
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

    expect(defaultIcon).toHaveStyle({
      fill: 'rgb(161, 161, 161)',
      transition: '0.15s all ease-in-out',
      position: 'absolute',
      height: '100%'
    })
    
    await userEvent.hover(link)
    expect(defaultIcon).toHaveStyle({
      fill: theme.colors.greyPrimary,
      transition: '0.15s all ease-in-out'
    })
    
    await userEvent.unhover(link)
    expect(defaultIcon).toHaveStyle({
      fill: theme.colors.greyPrimary,
      transition: '0.15s all ease-in-out'
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
    expect(link).toHaveStyle({
      width: '1.5rem',
      minHeight: '1.5rem'
    })
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

    expect(defaultIcon).toHaveStyle({
      transition: '0.15s all ease-in-out'
    })
    expect(coloredIconWrapper).toHaveStyle({
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
