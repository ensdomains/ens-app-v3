import { render, screen } from '@app/test-utils'

import { describe, expect, it } from 'vitest'

import { SocialIcon } from './SocialIcon'

describe('SocialIcon', () => {
  it('should render icon', () => {
    render(<SocialIcon social="github" href="https://github.com" />)
    expect(screen.getByTestId('social-icon-github')).toBeInTheDocument()
    expect(screen.getByTestId('social-icon-github')).toHaveAttribute('href', 'https://github.com')
  })
  it('should render colored icon', () => {
    const { container } = render(<SocialIcon social="discourse" href="https://discourse.com" />)
    const svgs = container.querySelectorAll('svg')
    expect(Array.from(svgs).length).toBe(2)
  })
})
