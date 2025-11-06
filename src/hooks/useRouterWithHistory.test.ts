import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useRouterWithHistory } from './useRouterWithHistory'

// Mock Next.js router
const mockPush = vi.fn()
const mockReplace = vi.fn()

vi.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    asPath: '/current-path',
    query: { referrer: 'test-partner' },
  }),
}))

// Mock getDestination
vi.mock('@app/routes', () => ({
  getDestination: (urlObject: any) => urlObject,
}))

describe('useRouterWithHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('push', () => {
    it('should preserve referrer when pushing to new route', () => {
      const { result } = renderHook(() => useRouterWithHistory())

      result.current.push('/profile/test.eth')

      expect(mockPush).toHaveBeenCalledWith(
        {
          pathname: '/profile/test.eth',
          query: { referrer: 'test-partner' },
        },
        undefined,
        { shallow: undefined },
      )
    })

    it('should merge additional query params with referrer', () => {
      const { result } = renderHook(() => useRouterWithHistory())

      result.current.push('/profile/test.eth', { tab: 'records' })

      expect(mockPush).toHaveBeenCalledWith(
        {
          pathname: '/profile/test.eth',
          query: { tab: 'records', referrer: 'test-partner' },
        },
        undefined,
        { shallow: undefined },
      )
    })

    it('should handle shallow routing', () => {
      const { result } = renderHook(() => useRouterWithHistory())

      result.current.push('/profile/test.eth', undefined, true)

      expect(mockPush).toHaveBeenCalledWith(
        {
          pathname: '/profile/test.eth',
          query: { referrer: 'test-partner' },
        },
        undefined,
        { shallow: true },
      )
    })
  })

  describe('pushWithHistory', () => {
    it('should preserve referrer and add from parameter', () => {
      const { result } = renderHook(() => useRouterWithHistory())

      result.current.pushWithHistory('/profile/test.eth')

      expect(mockPush).toHaveBeenCalledWith({
        pathname: '/profile/test.eth',
        query: {
          from: '/current-path',
          referrer: 'test-partner',
        },
      })
    })

    it('should merge additional query params with referrer and from', () => {
      const { result } = renderHook(() => useRouterWithHistory())

      result.current.pushWithHistory('/profile/test.eth', { tab: 'records' })

      expect(mockPush).toHaveBeenCalledWith({
        pathname: '/profile/test.eth',
        query: {
          tab: 'records',
          from: '/current-path',
          referrer: 'test-partner',
        },
      })
    })

    it('should not pass second parameter to router.push (regression test)', () => {
      const { result } = renderHook(() => useRouterWithHistory())

      result.current.pushWithHistory('/profile/test.eth')

      // This is the key regression test - should only have 1 argument
      expect(mockPush).toHaveBeenCalledTimes(1)
      expect(mockPush).toHaveBeenCalledWith({
        pathname: '/profile/test.eth',
        query: {
          from: '/current-path',
          referrer: 'test-partner',
        },
      })
    })
  })

  describe('replace', () => {
    it('should preserve referrer when replacing route', () => {
      const { result } = renderHook(() => useRouterWithHistory())

      result.current.replace('/profile/test.eth')

      // Note: replace still passes pathname as second arg (needs fixing)
      expect(mockReplace).toHaveBeenCalledWith(
        {
          pathname: '/profile/test.eth',
          query: { referrer: 'test-partner' },
        },
        '/profile/test.eth',
        {},
      )
    })

    it('should not add from parameter by default', () => {
      const { result } = renderHook(() => useRouterWithHistory())

      result.current.replace('/profile/test.eth', { maintainHistory: false })

      expect(mockReplace).toHaveBeenCalledWith(
        {
          pathname: '/profile/test.eth',
          query: { referrer: 'test-partner' },
        },
        '/profile/test.eth',
        {},
      )
    })
  })
})
