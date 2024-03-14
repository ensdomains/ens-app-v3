import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import CollapsibleContent from './CollapsibleContent'

describe('CollapsibleContent', () => {
  it('should render', () => {
    render(<CollapsibleContent expanded data-testid="collapsible-content" />)
    expect(screen.getByTestId('collapsible-content')).toBeInTheDocument()
  })

  it('should have 0 height if not expanded', () => {
    render(
      <CollapsibleContent expanded={false} data-testid="collapsible-content">
        <div style={{ height: '100px' }} />
      </CollapsibleContent>,
    )
    const style = getComputedStyle(screen.getByTestId('collapsible-content'))
    expect(style.maxHeight).toBe('0px')
  })

  it('should have max height of 100vh if expanded', () => {
    render(
      <CollapsibleContent data-testid="collapsible-content" expanded>
        <div style={{ height: '100px' }} />
      </CollapsibleContent>,
    )
    const style = getComputedStyle(screen.getByTestId('collapsible-content'))
    expect(style.maxHeight).toBe('100vh')
  })
})
