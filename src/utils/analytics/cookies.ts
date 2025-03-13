import { useCallback, useEffect } from 'react'

import { useLocalStorage } from '@app/hooks/useLocalStorage'

// Last time the cookie policy was updated
const COOKIE_POLICY_LAST_UPDATED = new Date('2025-03-01')

// Single storage key for all cookie consent data
const STORAGE_KEY = 'cookie_consent_data'

export type CookieConsent = 'yes' | 'no' | 'undecided'

export type ConsentData = {
  consent: CookieConsent
  lastConsentDate?: Date
}

/**
 * Default consent data when none exists
 */
const DEFAULT_CONSENT_DATA: ConsentData = {
  consent: 'undecided',
}

/**
 * Hook for managing cookie consent
 * Uses useLocalStorage for consistent storage handling
 */
export const useCookieConsent = () => {
  // Store all consent data in a single localStorage entry
  const [consentData, setConsentData] = useLocalStorage<ConsentData>(
    STORAGE_KEY,
    DEFAULT_CONSENT_DATA,
  )

  // Check if consent needs to be reset due to policy update
  useEffect(() => {
    if (
      consentData.lastConsentDate &&
      new Date(consentData.lastConsentDate) < COOKIE_POLICY_LAST_UPDATED &&
      consentData.consent !== 'undecided'
    ) {
      setConsentData(DEFAULT_CONSENT_DATA)
    }
  }, [consentData, setConsentData])

  // Set consent with date
  const setConsent = useCallback(
    (newConsent: CookieConsent) => {
      setConsentData({
        consent: newConsent,
        lastConsentDate: new Date(),
      })
    },
    [setConsentData],
  )

  // Clear consent
  const clearCookieConsent = useCallback(() => {
    setConsentData(DEFAULT_CONSENT_DATA)
  }, [setConsentData])

  return {
    consent: consentData.consent,
    lastConsentDate: consentData.lastConsentDate,
    setConsent,
    clearCookieConsent,
  }
}
