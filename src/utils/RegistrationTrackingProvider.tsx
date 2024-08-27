import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

import { useChainName } from '@app/hooks/chain/useChainName'
import { PlausibleProps, PlausibleType } from '@app/types'
import { trackEvent } from '@app/utils/analytics'

type PaymentData = Omit<PlausibleProps, 'referrer' | 'keyword' | 'tld'>
type RegistrationTrackingContextType = {
  captureEvent: (type: PlausibleType, props?: PlausibleProps) => void
  capturePaymentEvent: () => void
  updatePaymentProperty: (key: keyof PaymentData, value: any) => void
}

const RegistrationTrackingContext = createContext<RegistrationTrackingContextType | undefined>(
  undefined,
)

export const RegistrationTrackingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const chainName = useChainName()
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)

  const captureEvent = useCallback(
    (type: PlausibleType, props?: PlausibleProps) => {
      trackEvent(type, chainName, props)
    },
    [chainName],
  )

  const capturePaymentEvent = useCallback(() => {
    captureEvent('Payment selected', paymentData as PlausibleProps)
  }, [captureEvent, paymentData])

  const updatePaymentProperty = useCallback((key: keyof PaymentData, value: any) => {
    setPaymentData((prev) => ({ ...prev, [key]: value }))
  }, [])

  const value = useMemo(
    () => ({
      captureEvent,
      capturePaymentEvent,
      updatePaymentProperty,
    }),
    [captureEvent, capturePaymentEvent, updatePaymentProperty],
  )

  return (
    <RegistrationTrackingContext.Provider value={value}>
      {children}
    </RegistrationTrackingContext.Provider>
  )
}

export const useRegistrationTracking = (): RegistrationTrackingContextType => {
  const registrationTrackingContext = useContext(RegistrationTrackingContext)

  if (registrationTrackingContext === undefined) {
    throw new Error('useRegistrationTracking must be used within a RegistrationTrackingProvider')
  }

  return registrationTrackingContext
}
