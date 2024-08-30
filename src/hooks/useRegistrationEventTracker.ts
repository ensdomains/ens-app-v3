import { uniq } from 'lodash'
import { useCallback } from 'react'

import {
  PaymentMethod,
  RegistrationReducerDataItem,
} from '@app/components/pages/profile/[name]/registration/types'
import { PlausibleProps, PlausibleType } from '@app/types'
import { trackEvent } from '@app/utils/analytics'
import { secondsToYears } from '@app/utils/time'
import useUserConfig from '@app/utils/useUserConfig'

import { useChainName } from './chain/useChainName'
import { useLocalStorage } from './useLocalStorage'

export const useRegistrationEventTracker = () => {
  const chain = useChainName()
  const [trackedEvents, setTrackedEvents] = useLocalStorage<string[]>('registration-tracking', [])

  const resetTrackedEvents = useCallback(() => {
    setTrackedEvents((previousEvents) => previousEvents.filter((event) => event === 'Home page'))
  }, [setTrackedEvents])

  const trackRegistrationEvent = useCallback(
    (type: PlausibleType, customProps?: PlausibleProps) => {
      if (type === 'Home page' && trackedEvents.length > 1) {
        resetTrackedEvents()
      }

      if (trackedEvents.includes(type)) return

      trackEvent(type, chain, customProps)
      setTrackedEvents((previousEvents) => uniq([...previousEvents, type]))
    },
    [chain, trackedEvents, resetTrackedEvents, setTrackedEvents],
  )

  return {
    trackRegistrationEvent,
  }
}

export const usePaymentSelectedEventTracker = (registrationData: RegistrationReducerDataItem) => {
  const { userConfig } = useUserConfig()
  const { trackRegistrationEvent } = useRegistrationEventTracker()

  const trackPaymentSelectedEvent = useCallback(
    (paymentMethod: PaymentMethod | '') => {
      if (!registrationData) return

      const year = secondsToYears(registrationData.seconds)
      const durationType = Number.isInteger(year) ? 'year' : 'date'
      const currencyUnit = userConfig.currency === 'fiat' ? 'usd' : 'eth'

      const props: PlausibleProps = {
        currencyUnit,
        durationType,
        duration: durationType === 'year' ? year : registrationData.seconds,
        paymentType: paymentMethod === PaymentMethod.ethereum ? 'eth' : 'fiat',
      }

      trackRegistrationEvent('Payment selected', props)
    },
    [registrationData, trackRegistrationEvent, userConfig.currency],
  )

  return {
    trackPaymentSelectedEvent,
  }
}
