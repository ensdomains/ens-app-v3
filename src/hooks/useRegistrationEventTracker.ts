import { useCallback } from 'react'
import { match, P } from 'ts-pattern'
import { formatUnits } from 'viem'

import { PaymentMethod } from '@app/components/pages/profile/[name]/registration/types'
import { PlausibleProps, PlausibleType } from '@app/types'
import { trackEvent } from '@app/utils/analytics'
import { secondsToYears } from '@app/utils/time'

import { useChainName } from './chain/useChainName'

// BEGIN: Sample code

type SearchSelectEvent = {
  eventName: 'search_select_eth' | 'search_select_box'
  customProperties: { name: string }
}

type PaymentEevent = {
  eventName: 'payment_selected'
  customProperties: {
    ethPrice: BigInt
    duration: number
  }
}

type DefaultEvent = {
  eventName: 'register_started' | 'register_open_wallet'
  customProperties?: never
}

type TrackEventParameters = SearchSelectEvent | DefaultEvent | PaymentEevent

// END: Sample code

export const useRegistrationEventTracker = () => {
  const chain = useChainName()

  // BEGIN: Sample code
  const trackEventSample = (props: TrackEventParameters) => {
    match(props)
      .with(
        { eventName: P.union('register_started', 'register_open_wallet') },
        ({ eventName, customProperties }) => trackEvent(eventName, chain, customProperties),
      )
      .with({ eventName: 'payment_selected' }, ({ eventName, customProperties }) => {
        const { duration, ethPrice } = customProperties
        trackEvent('payment_selected', chain, {
          price: duration * Number(ethPrice),
        })
      })
  }

  // This should cause a type error
  trackEventSample({ eventName: 'register_open_wallet', customProperties: { name: 'hello' } })

  // This will cause a type error if the props are changed.
  trackEventSample({
    eventName: 'payment_selected',
    customProperties: { ethPrice: 100n, duration: 20000 },
  })
  // END: Sample code

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
