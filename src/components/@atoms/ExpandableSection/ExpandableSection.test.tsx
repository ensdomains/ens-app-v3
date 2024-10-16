import { render, screen, userEvent } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import { ExpandableSection, stateChangeHandler } from './ExpandableSection'

describe('ExpandableSection', () => {
  it('should expand and close when header is clicked', async () => {
    render(<ExpandableSection title="Test">CONTENT</ExpandableSection>)
    const header = screen.getByRole('button', { name: /Test/i })
    expect(screen.getByText('CONTENT')).not.toBeVisible()
    await userEvent.click(header)
    expect(screen.getByText('CONTENT')).toBeVisible()
    await userEvent.click(header)
    expect(screen.getByText('CONTENT')).not.toBeVisible()
  })
})

describe('stateChangeHandler', () => {
  it('should set height when status is preEnter or preExit', () => {
    const setHeight = vi.fn()
    const ref = { current: { getBoundingClientRect: () => ({ height: 100 }) } }

    const handler = stateChangeHandler(setHeight, ref)

    handler({ current: { status: 'preEnter' } })
    expect(setHeight).toHaveBeenCalledWith(100)

    handler({ current: { status: 'preExit' } })
    expect(setHeight).toHaveBeenCalledWith(100)
  })

  it('should not set height for other statuses', () => {
    const setHeight = vi.fn()
    const ref = { current: { getBoundingClientRect: () => ({ height: 100 }) } }

    const handler = stateChangeHandler(setHeight, ref)

    handler({ current: { status: 'entered' } })
    expect(setHeight).not.toHaveBeenCalled()

    handler({ current: { status: 'exited' } })
    expect(setHeight).not.toHaveBeenCalled()
  })

  it('should handle null ref', () => {
    const setHeight = vi.fn()
    const ref = { current: null }

    const handler = stateChangeHandler(setHeight, ref)

    handler({ current: { status: 'preEnter' } })
    expect(setHeight).toHaveBeenCalledWith(0)
  })
})
