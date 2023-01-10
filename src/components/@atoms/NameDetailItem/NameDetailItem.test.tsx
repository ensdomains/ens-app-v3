import { mockFunction, render, screen } from '@app/test-utils'

import { useRouter } from 'next/router'

import { ShortExpiry } from '@app/components/@atoms/ExpiryComponents/ExpiryComponents'
import { useZorb } from '@app/hooks/useZorb'

import { NameDetailItem } from './NameDetailItem'

jest.mock('@app/hooks/useZorb')
jest.mock('next/router')
jest.mock('@app/components/@atoms/ExpiryComponents/ExpiryComponents')

const mockUseZorb = mockFunction(useZorb)
const mockUseRouter = mockFunction(useRouter)
const mockShortExpiry = mockFunction(ShortExpiry)

mockShortExpiry.mockImplementation(({ expiry }) => <div>{expiry}</div>)

describe('NameDetailitem', () => {
  const mockRouterObject = {
    asPath: 'currentpath',
    query: {
      name: 'nick.eth',
    },
  }

  it('should link to correct path', () => {
    mockUseZorb.mockReturnValue('')
    mockUseRouter.mockReturnValue(mockRouterObject)

    render(
      <NameDetailItem
        {...{
          name: 'name',
          id: 'test',
          truncatedName: 'truncatedName',
          network: 1,
        }}
      >
        <div>child</div>
      </NameDetailItem>,
    )
    expect(screen.getByText('truncatedName').closest('a')).toHaveAttribute(
      'href',
      '/tld/name?from=currentpath',
    )
  })
  it('should show zorb when there is no avatar', () => {
    mockUseZorb.mockReturnValue('zorb')
    mockUseRouter.mockReturnValue(mockRouterObject)
    render(
      <NameDetailItem
        {...{
          name: 'name',
          id: 'test',
          truncatedName: 'truncatedName',
          network: 1,
        }}
      >
        <div>child</div>
      </NameDetailItem>,
    )
    expect(screen.getByTestId('name-detail-item-avatar')).toHaveAttribute('src', 'zorb')
  })
  it('should render truncated name', () => {
    mockUseZorb.mockReturnValue('zorb')
    mockUseRouter.mockReturnValue(mockRouterObject)
    render(
      <NameDetailItem
        {...{
          name: 'name',
          id: 'test',
          truncatedName: 'truncatedName',
          network: 1,
        }}
      >
        <div>child</div>
      </NameDetailItem>,
    )
    expect(screen.getByText('truncatedName')).toBeInTheDocument()
  })
  it('should render children', () => {
    mockUseZorb.mockReturnValue('zorb')
    mockUseRouter.mockReturnValue(mockRouterObject)
    render(
      <NameDetailItem
        {...{
          name: 'name',
          id: 'test',
          truncatedName: 'truncatedName',
          network: 1,
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
          truncatedName: 'truncatedName',
          network: 1,
        }}
        expiryDate={'2020-01-01' as any}
        network={1}
      >
        <div>child</div>
      </NameDetailItem>,
    )
    expect(getByText('2020-01-01')).toBeInTheDocument()
  })

  it('should render no expiry date if name has no expiry date', () => {
    const { queryByText } = render(
      <NameDetailItem
        {...{
          name: 'name',
          id: 'test',
          truncatedName: 'truncatedName',
          network: 1,
        }}
        expiryDate={null as any}
        network={1}
      >
        <div>child</div>
      </NameDetailItem>,
    )
    expect(queryByText('2020-01-01')).not.toBeInTheDocument()
  })
})
