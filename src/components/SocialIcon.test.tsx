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
    expect(link).toHaveStyle('color: rgb(161, 161, 161)')
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
    expect(coloredIconWrapper).toHaveStyle('opacity: 0')
    expect(coloredIconWrapper).toHaveStyle('height: 100%')
    expect(coloredIconWrapper).toHaveStyle('position: absolute')
    expect(coloredIconWrapper).toHaveStyle('transition: 0.15s all ease-in-out')
    
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

    expect(link).toHaveStyle('display: flex')
    expect(link).toHaveStyle('align-items: center')
    expect(link).toHaveStyle('justify-content: center')
    expect(link).toHaveStyle('position: relative')
    expect(link).toHaveStyle('cursor: pointer')
    expect(link).toHaveStyle('width: 1.5rem')
    expect(link).toHaveStyle('min-height: 1.5rem')
    
    expect(defaultIcon).toHaveStyle('position: absolute')
    expect(defaultIcon).toHaveStyle('height: 100%')
    expect(defaultIcon).toHaveStyle('transition: 0.15s all ease-in-out')
    expect(defaultIcon).toHaveStyle('fill: rgb(161, 161, 161)')

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
    
    expect(coloredIconWrapper).toHaveStyle('opacity: 0')
    await userEvent.hover(link)
    expect(coloredIconWrapper).toHaveStyle('opacity: 1')
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
    
    expect(link).toHaveStyle('color: rgb(161, 161, 161)')
    expect(link).toHaveStyle('display: flex')
    expect(link).toHaveStyle('align-items: center')
    expect(link).toHaveStyle('justify-content: center')
    expect(link).toHaveStyle('position: relative')
    expect(link).toHaveStyle('cursor: pointer')
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
    expect(link).toHaveStyle('position: relative')
    expect(link).toHaveStyle('cursor: pointer')
    expect(link).toHaveStyle('display: flex')
    expect(link).toHaveStyle('align-items: center')
    expect(link).toHaveStyle('justify-content: center')
    expect(icon).toHaveStyle('transition: 0.15s all ease-in-out')
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
    
    expect(link).toHaveStyle('display: flex')
    expect(link).toHaveStyle('align-items: center')
    expect(link).toHaveStyle('justify-content: center')
    expect(link).toHaveStyle('position: relative')
    expect(link).toHaveStyle('cursor: pointer')
    expect(link).toHaveStyle('width: 1.5rem')
    expect(link).toHaveStyle('min-height: 1.5rem')
    
    expect(icon).toHaveStyle('position: absolute')
    expect(icon).toHaveStyle('height: 100%')
    expect(icon).toHaveStyle('fill: rgb(161, 161, 161)')
    expect(icon).toHaveStyle('transition: 0.15s all ease-in-out')
    
    // Check that key prop is set correctly
    expect(icon.parentElement).toHaveAttribute('key', 'https://example.com')
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
    
    expect(icon).toHaveStyle('position: absolute')
    expect(icon).toHaveStyle('height: 100%')
    expect(icon).toHaveStyle('transition: 0.15s all ease-in-out')
    expect(icon).toHaveStyle('fill: rgb(161, 161, 161)')
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

    expect(defaultIcon).toHaveStyle('fill: rgb(161, 161, 161)')
    expect(coloredIconWrapper).toHaveStyle('opacity: 0')

    await userEvent.hover(link)
    expect(defaultIcon).toHaveStyle(`fill: ${customColor}`)
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

    expect(defaultIcon).toHaveStyle('fill: rgb(161, 161, 161)')
    
    await userEvent.hover(link)
    expect(defaultIcon).toHaveStyle('fill: rgb(161, 161, 161)')
    
    await userEvent.unhover(link)
    expect(defaultIcon).toHaveStyle('fill: rgb(161, 161, 161)')
  })
})
