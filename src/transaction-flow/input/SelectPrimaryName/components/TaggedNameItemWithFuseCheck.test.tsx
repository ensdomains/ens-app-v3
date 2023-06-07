import { render, screen } from '@app/test-utils'

import { TaggedNameItemWithFuseCheck } from './TaggedNameItemWithFuseCheck'

jest.mock('@app/components/@atoms/NameDetailItem/TaggedNameItem', () => ({
  TaggedNameItem: ({ name }: any) => <div data-testid="item">{name}</div>,
}))

const mockUseResolverStatus = jest.fn().mockReturnValue({
  data: {
    isAuthorized: true,
  },
  isLoading: false,
})

jest.mock('@app/hooks/resolver/useResolverStatus', () => ({
  useResolverStatus: () => mockUseResolverStatus(),
}))

const baseProps: any = {
  name: 'test.eth',
  isResolvedAddress: true,
  isWrappedOwner: false,
  fuses: {},
}

describe('TaggedNameItemWithFuseCheck', () => {
  it('should render a tagged name item with mock data', () => {
    render(<TaggedNameItemWithFuseCheck {...baseProps} />)
    expect(screen.getByText('test.eth')).toBeVisible()
  })

  it('should not render a tagged name item with mock data', () => {
    mockUseResolverStatus.mockReturnValueOnce({
      data: {
        isAuthorized: false,
      },
      isLoading: false,
    })
    render(
      <TaggedNameItemWithFuseCheck
        {...{
          ...baseProps,
          isResolvedAddress: false,
          isWrappedOwner: true,
          fuses: { child: { CANNOT_SET_RESOLVER: true } },
        }}
      />,
    )
    expect(screen.queryByText('test.eth')).toBe(null)
  })

  it('should render a tagged name item if isAuthorized is true', () => {
    mockUseResolverStatus.mockReturnValue({
      data: {
        isAuthorized: true,
      },
      isLoading: false,
    })
    render(
      <TaggedNameItemWithFuseCheck
        {...{
          ...baseProps,
          isResolvedAddress: false,
          isWrappedOwner: true,
          fuses: { child: { CANNOT_SET_RESOLVER: true } },
        }}
      />,
    )
    expect(screen.getByText('test.eth')).toBeVisible()
  })

  it('should render a tagged name item if isResolvedAddress is true', () => {
    mockUseResolverStatus.mockReturnValueOnce({
      data: {
        isAuthorized: false,
      },
      isLoading: false,
    })
    render(
      <TaggedNameItemWithFuseCheck
        {...{
          ...baseProps,
          isResolvedAddress: true,
          isWrappedOwner: true,
          fuses: { child: { CANNOT_SET_RESOLVER: true } },
        }}
      />,
    )
    expect(screen.getByText('test.eth')).toBeInTheDocument()
  })

  it('should render a tagged name item if isWrappedOwner is false', () => {
    mockUseResolverStatus.mockReturnValueOnce({
      data: {
        isAuthorized: false,
      },
      isLoading: false,
    })
    render(
      <TaggedNameItemWithFuseCheck
        {...{
          ...baseProps,
          isResolvedAddress: false,
          isWrappedOwner: false,
          fuses: { child: { CANNOT_SET_RESOLVER: true } },
        }}
      />,
    )
    expect(screen.getByText('test.eth')).toBeVisible()
  })

  it('should render a tagged name item if CANNOT_SET_RESOLVER is false', () => {
    mockUseResolverStatus.mockReturnValueOnce({
      data: {
        isAuthorized: false,
      },
      isLoading: false,
    })
    render(
      <TaggedNameItemWithFuseCheck
        {...{
          ...baseProps,
          isResolvedAddress: false,
          isWrappedOwner: true,
          fuses: { child: { CANNOT_SET_RESOLVER: false } },
        }}
      />,
    )
    expect(screen.getByText('test.eth')).toBeVisible()
  })
})
