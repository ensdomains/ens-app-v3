import { useCallback } from 'react'
import { formatUnits } from 'viem'

import { PaymentMethod } from '@app/components/pages/profile/[name]/registration/types'
import { PlausibleProps, PlausibleType } from '@app/types'
import { trackEvent } from '@app/utils/analytics'
import { secondsToYears } from '@app/utils/time'

import { useChainName } from './chain/useChainName'

export const useRegistrationEventTracker = () => {
  const chain = useChainName()

  const trackRegistrationEvent = useCallback(
    (type: PlausibleType, customProps?: PlausibleProps) => {
      trackEvent(type, chain, customProps)
    },
    [chain],
  )

  const trackPaymentSelectedEvent = useCallback(
    ({
      duration,
      paymentMethod,
      estimatedTotal,
      ethPrice,
    }: {
      duration: number
      paymentMethod: PaymentMethod | ''
      estimatedTotal?: bigint
      ethPrice?: bigint
    }) => {
      if (!estimatedTotal || !ethPrice) return

      const year = secondsToYears(duration)
      const durationType = Number.isInteger(year) ? 'year' : 'date'
      const paymentAmount = formatUnits((estimatedTotal * ethPrice) / BigInt(1e8), 18)

      const props: PlausibleProps = {
        durationType,
        duration: durationType === 'year' ? year : duration,
        paymentType: paymentMethod === PaymentMethod.ethereum ? 'eth' : 'fiat',
        paymentAmount,
        currencyUnit: 'usd',
      }

      trackRegistrationEvent('payment_selected', props)
    },
    [trackRegistrationEvent],
  )

  return {
    trackRegistrationEvent,
    trackPaymentSelectedEvent,
  }
}
