import { mockFunction, render, screen } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import { ShortExpiry } from '@app/components/@atoms/ExpiryComponents/ExpiryComponents'
import { useZorb } from '@app/hooks/useZorb'

import { NameDetailItem } from './NameDetailItem'

vi.mock('next/router', async () => await vi.importActual('next-router-mock'))
vi.mock('@app/hooks/useZorb')
vi.mock('@app/components/@atoms/ExpiryComponents/ExpiryComponents')

const mockUseZorb = mockFunction(useZorb)
const mockShortExpiry = mockFunction(ShortExpiry)

mockShortExpiry.mockImplementation(({ expiry }) => <div>{expiry.toDateString()}</div>)

describe('NameDetailitem', () => {
  it('should link to correct path', () => {
    mockUseZorb.mockReturnValue('')

    render(
      <NameDetailItem
        {...{
          name: 'name',
          id: 'test',
          truncatedName: 'truncatedname',
        }}
      >
        <div>child</div>
      </NameDetailItem>,
    )
    expect(screen.getByText('truncatedname').closest('a')).toHaveAttribute('href', '/tld/name')
  })
  it('should show zorb when there is no avatar', () => {
    mockUseZorb.mockReturnValue('zorb')
    render(
      <NameDetailItem
        {...{
          name: 'name',
          id: 'test',
          truncatedName: 'truncatedName',
        }}
      >
        <div>child</div>
      </NameDetailItem>,
    )
    expect(screen.getByTestId('name-detail-item-avatar')).toHaveAttribute('src', 'zorb')
  })
  it('should render truncated name', () => {
    mockUseZorb.mockReturnValue('zorb')
    render(
      <NameDetailItem
        {...{
          name: 'name',
          id: 'test',
          truncatedName: 'truncatedname',
        }}
      >
        <div>child</div>
      </NameDetailItem>,
    )
    expect(screen.getByText('truncatedname')).toBeInTheDocument()
  })
  it('should render children', () => {
    mockUseZorb.mockReturnValue('zorb')
    render(
      <NameDetailItem
        {...{
          name: 'name',
          id: 'test',
          truncatedName: 'truncatedname',
        }}
      >
        <div>child</div>
      </NameDetailItem>,
    )
    expect(screen.getByText('child')).toBeInTheDocument()
  })

  it('should render expiry date if name has expiry date', () => {
    const { getByText } = render(
      <NameDetailItem
        {...{
          name: 'name',
          id: 'test',
          truncatedName: 'truncatedname',
        }}
        expiryDate={new Date('2020-01-01')}
      >
        <div>child</div>
      </NameDetailItem>,
    )
    expect(getByText('Wed Jan 01 2020')).toBeInTheDocument()
  })

  it('should render no expiry date if name has no expiry date', () => {
    const { queryByText } = render(
      <NameDetailItem
        {...{
          name: 'name',
          id: 'test',
          truncatedName: 'truncatedname',
        }}
        expiryDate={null as any}
      >
        <div>child</div>
      </NameDetailItem>,
    )
    expect(queryByText('2020-01-01')).not.toBeInTheDocument()
  })
})
