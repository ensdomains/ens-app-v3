import { renderHook } from '@app/test-utils'

import mockRouter from 'next-router-mock'

import { useActiveRoute } from './useActiveRoute'

jest.mock('next/router', () => jest.requireActual('next-router-mock'))

describe('useActiveRoute', () => {
  it('should return the active route name from the path', () => {
    mockRouter.setCurrentUrl('/')
    const { result } = renderHook(() => useActiveRoute())
    expect(result.current).toEqual('search')
  })
  it('should return the active route name from the from query', () => {
    mockRouter.setCurrentUrl({
      query: {
        from: 'search',
      },
      pathname: '/profile/test.eth',
    })
    const { result } = renderHook(() => useActiveRoute())
    expect(result.current).toEqual('search')
  })
  it("should return unknown if the route isn't known", () => {
    mockRouter.setCurrentUrl({
      query: {},
      pathname: '/test123',
    })
    const { result } = renderHook(() => useActiveRoute())
    expect(result.current).toEqual('unknown')
  })
})
