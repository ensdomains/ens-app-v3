import { mockFunction, renderHook } from '@app/test-utils'

import { beforeEach, describe, expect, it, test, vi } from 'vitest'

import { useChainName } from '@app/hooks/chain/useChainName'
import { trackEvent } from '@app/utils/analytics'

import { useEventTracker } from './useEventTracker'

vi.mock('@app/hooks/chain/useChainName')
vi.mock('@app/utils/analytics', () => ({
  trackEvent: vi.fn(),
}))

const mockUseChainName = mockFunction(useChainName)
const chain = 'mainnet'

describe('useEventTracker', () => {
  beforeEach(() => {
    mockUseChainName.mockReturnValue(chain)
    vi.mocked(trackEvent).mockReset()
  })

  it('should return trackEvent functions', async () => {
    const { result } = renderHook(() => useEventTracker())
    expect(result.current).toHaveProperty('trackEvent')
  })

  test.each([['search_selected_eth', 'test.eth']])(
    'should call trackEvent with correct arguments for %s event',
    (eventName, name) => {
    const { result } = renderHook(() => useEventTracker())

    result.current.trackEvent({
      eventName: eventName as any,
      customProperties: { name },
    })

    expect(trackEvent).toBeCalledTimes(1)
    expect(trackEvent).toBeCalledWith(eventName, chain, { name })
  },
  )

  test.each([
    'commit_started',
    'commit_wallet_opened',
    'register_started',
    'register_wallet_opened',
  ])('should call trackEvent with correct arguments for %s event', (eventName) => {
    const { result } = renderHook(() => useEventTracker())

    result.current.trackEvent({
      eventName: eventName as any,
    })

    expect(trackEvent).toBeCalledWith(eventName, chain)
  })
})
