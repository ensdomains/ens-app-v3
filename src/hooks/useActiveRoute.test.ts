import { renderHook } from '@testing-library/react-hooks'
import { useRouter } from 'next/router'

import { mockFunction } from '@app/test-utils'

import { useActiveRoute } from './useActiveRoute'

jest.mock('next/router')

const mockUseRouter = mockFunction(useRouter)

describe('useActiveRoute', () => {
  it('should return the active route name from the path', () => {
    mockUseRouter.mockReturnValue({
      query: {},
      asPath: '/',
    })
    const { result } = renderHook(() => useActiveRoute())
    expect(result.current).toEqual('search')
  })
  it('should return the active route name from the from query', () => {
    mockUseRouter.mockReturnValue({
      query: {
        from: 'search',
      },
      asPath: '/profile/test.eth',
    })
    const { result } = renderHook(() => useActiveRoute())
    expect(result.current).toEqual('search')
  })
  it("should return unknown if the route isn't known", () => {
    mockUseRouter.mockReturnValue({
      query: {},
      asPath: '/test123',
    })
    const { result } = renderHook(() => useActiveRoute())
    expect(result.current).toEqual('unknown')
  })
})
