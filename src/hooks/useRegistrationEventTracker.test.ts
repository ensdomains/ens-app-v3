import { mockFunction, renderHook } from '@app/test-utils'

import { formatUnits } from 'viem'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { PaymentMethod } from '@app/components/pages/profile/[name]/registration/types'
import { useChainName } from '@app/hooks/chain/useChainName'
import { PlausibleProps, PlausibleType } from '@app/types'
import { trackEvent } from '@app/utils/analytics'

import { useRegistrationEventTracker } from './useRegistrationEventTracker'

vi.mock('@app/hooks/chain/useChainName')

vi.mock('@app/utils/analytics', () => ({
  trackEvent: vi.fn(),
}))

const mockUseChainName = mockFunction(useChainName)
const network = 'mainnet'

describe('useRegistrationEventTracker', () => {
  beforeEach(() => {
    mockUseChainName.mockReturnValue(network)
  })

  it('should return trackRegistrationEvent and trackPaymentSelectedEvent functions', async () => {
    const { result } = renderHook(() => useRegistrationEventTracker())
    expect(result.current).toHaveProperty('trackRegistrationEvent')
    expect(result.current).toHaveProperty('trackPaymentSelectedEvent')
  })

  it('should call trackEvent with correct arguments when trackRegistrationEvent is called', async () => {
    const type: PlausibleType = 'start_searching'
    const props: PlausibleProps = { keyword: 'test' }
    const { result } = renderHook(() => useRegistrationEventTracker())
    result.current.trackRegistrationEvent(type, props)

    expect(trackEvent).toHaveBeenCalledTimes(1)
    expect(trackEvent).toHaveBeenCalledWith(type, network, props)
  })

  it('should call trackEvent with correct arguments when trackPaymentSelectedEvent is called', async () => {
    vi.mocked(trackEvent).mockReset()

    const duration = 62985600
    const paymentMethod = 'ethereum' as PaymentMethod
    const estimatedTotal = 6818890518377750n
    const ethPrice = 156058000000n
    const paymentAmount = formatUnits((estimatedTotal * ethPrice) / BigInt(1e8), 18)

    const type: PlausibleType = 'payment_selected'
    const props: PlausibleProps = {
      duration,
      durationType: 'date',
      paymentAmount,
      paymentType: 'eth',
      currencyUnit: 'usd',
    }

    const { result } = renderHook(() => useRegistrationEventTracker())
    result.current.trackPaymentSelectedEvent({
      duration,
      paymentMethod,
      estimatedTotal,
      ethPrice,
    })

    expect(trackEvent).toHaveBeenCalledTimes(1)
    expect(trackEvent).toHaveBeenCalledWith(type, network, props)
  })

  it('should not call trackEvent when trackPaymentSelectedEvent is called with missing arguments', async () => {
    vi.mocked(trackEvent).mockReset()

    const { result } = renderHook(() => useRegistrationEventTracker())
    result.current.trackPaymentSelectedEvent({
      duration: 62985600,
      paymentMethod: 'ethereum' as PaymentMethod,
    })

    expect(trackEvent).not.toHaveBeenCalled()
  })
})
