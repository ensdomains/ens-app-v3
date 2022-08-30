import { render, screen } from '@app/test-utils'

import { DetailSnippet } from './DetailSnippet'

describe('DetailSnippet', () => {
  it('should show the expiry date if given', () => {
    const mockData = {
      expiryDate: new Date(1654782805000),
      canSend: false,
    }
    render(<DetailSnippet {...mockData} />)
    expect(screen.getByText('June 9, 2022')).toBeVisible()
  })
  it('should not show the expiry date if none given', () => {
    const mockData = {
      canSend: false,
    }
    render(<DetailSnippet {...mockData} />)
    expect(screen.queryByText('June 9, 2022')).not.toBeInTheDocument()
  })
  it('should show the extend button if expiry date is given', () => {
    const mockData = {
      expiryDate: new Date('1654782805000'),
      canSend: false,
    }
    render(<DetailSnippet {...mockData} />)
    expect(screen.getByTestId('extend-button')).toBeVisible()
  })
  it('should show the send button if canSend is true', () => {
    const mockData = {
      expiryDate: new Date('1654782805000'),
      canSend: true,
    }
    render(<DetailSnippet {...mockData} />)
    expect(screen.getByTestId('send-button')).toBeVisible()
  })
  it('should show the send button if canSend is true and there is no expiry date given', () => {
    const mockData = {
      canSend: true,
    }
    render(<DetailSnippet {...mockData} />)
    expect(screen.getByTestId('send-button')).toBeVisible()
  })
})
