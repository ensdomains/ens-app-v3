import { mockFunction, render, screen } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import { useResolverStatus } from '@app/hooks/resolver/useResolverStatus'

import { TaggedNameItemWithFuseCheck } from './TaggedNameItemWithFuseCheck'

vi.mock('@app/hooks/resolver/useResolverStatus')

vi.mock('@app/components/@atoms/NameDetailItem/TaggedNameItem', () => ({
  TaggedNameItem: ({ name }: any) => <div data-testid="item">{name}</div>,
}))

const mockUseResolverStatus = mockFunction(useResolverStatus)
mockUseResolverStatus.mockReturnValue({
  data: {
    isAuthorized: true,
  },
  isLoading: false,
})

const baseProps: any = {
  name: 'test.eth',
  relation: {
    resolvedAddress: true,
    wrappedOwner: false,
  },
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
          relation: {
            resolvedAddress: false,
            wrappedOwner: true,
          },
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
          relation: {
            resolvedAddress: false,
            wrappedOwner: true,
          },
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
          relation: {
            resolvedAddress: true,
            wrappedOwner: true,
          },
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
          relation: {
            resolvedAddress: false,
            wrappedOwner: false,
          },
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
          relation: {
            resolvedAddress: false,
            wrappedOwner: true,
          },
          fuses: { child: { CANNOT_SET_RESOLVER: false } },
        }}
      />,
    )
    expect(screen.getByText('test.eth')).toBeVisible()
  })
})
