import { render, screen, mockFunction } from '@app/test-utils'
import { useRouter } from 'next/router'

import { useZorb } from '@app/hooks/useZorb'

import { NameDetailItem } from './NameDetailItem'

jest.mock('@app/hooks/useZorb')
jest.mock('next/router')
const mockUseZorb = mockFunction(useZorb)
const mockUseRouter = mockFunction(useRouter)

describe('NameDetailitem', () => {
  const mockRouterObject = {
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
      '/profile/name?from=',
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
    expect(screen.getByTestId('name-detail-item-avatar')).toHaveAttribute(
      'src',
      'zorb',
    )
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
})
