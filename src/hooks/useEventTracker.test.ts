import { mockFunction, renderHook } from '@app/test-utils'

import { formatUnits } from 'viem'
import { beforeEach, describe, expect, it, test, vi } from 'vitest'

import { PaymentMethod } from '@app/components/pages/profile/[name]/registration/types'
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

  test.each([
    ['search_selected_eth', 'test.eth'],
    ['search_selected_box', 'test.box'],
  ])('should call trackEvent with correct arguments for %s event', (eventName, name) => {
    const { result } = renderHook(() => useEventTracker())

    result.current.trackEvent({
      eventName: eventName as any,
      customProperties: { name },
    })

    expect(trackEvent).toBeCalledTimes(1)
    expect(trackEvent).toBeCalledWith(eventName, chain, { name })
  })

  it('should call trackEvent with correct arguments with payment_selected event name', async () => {
    const duration = 62985600
    const paymentMethod = 'ethereum' as PaymentMethod
    const estimatedTotal = 6818890518377750n
    const ethPrice = 156058000000n
    const paymentAmount = formatUnits((estimatedTotal * ethPrice) / BigInt(1e8), 18)

    const { result } = renderHook(() => useEventTracker())
    result.current.trackEvent({
      eventName: 'payment_selected',
      customProperties: {
        duration,
        paymentMethod,
        estimatedTotal,
        ethPrice,
        durationType: 'years',
      },
    })

    expect(trackEvent).toBeCalledTimes(1)
    expect(trackEvent).toBeCalledWith('payment_selected', chain, {
      duration,
      currencyUnit: 'eth',
      paymentType: 'eth',
      paymentAmount,
    })
  })

  test.each([
    'commit_started',
    'commit_wallet_opened',
    'register_started',
    'register_started_box',
    'register_wallet_opened',
  ])('should call trackEvent with correct arguments for %s event', (eventName) => {
    const { result } = renderHook(() => useEventTracker())

    result.current.trackEvent({
      eventName: eventName as any,
    })

    expect(trackEvent).toBeCalledWith(eventName, chain)
  })
})
