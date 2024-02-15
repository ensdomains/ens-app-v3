import { render, screen, userEvent } from '@app/test-utils'

import { ExpandableSection } from './ExpandableSection'

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
