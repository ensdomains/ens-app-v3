import { render, screen } from '@app/test-utils'

import { formatDateTime } from '@app/utils/utils'

import { GraceEndDate } from './GraceEndDate'

jest.mock('@app/hooks/useChainName')

describe('GraceEndDate', () => {
  it('should render the grace end date', () => {
    const expiryDate = new Date('2021-01-01T00:00:00.000Z')
    render(<GraceEndDate expiryDate={expiryDate} />)
    const element = screen.getByText('April 1, 2021')
    expect(element).toBeInTheDocument()
  })

  it('should render the grace end time correctly', () => {
    const expiryDate = new Date('2021-01-01T00:00:00.000Z')
    render(<GraceEndDate expiryDate={expiryDate} />)
    const expectedTime = formatDateTime(expiryDate)
    const element = screen.getByText(expectedTime)
    expect(element).toBeInTheDocument()
  })

  it('should not render the component when expiryDate is undefined', () => {
    render(<GraceEndDate expiryDate={undefined as any} />)
    const element = screen.queryByText('name.graceEnd')
    expect(element).not.toBeInTheDocument()
  })
})
