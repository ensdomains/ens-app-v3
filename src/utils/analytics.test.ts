import { mockFunction, render, screen } from '@app/test-utils'

import ReactGA4 from 'react-ga4'

import { getUtm, setUtm, setupAnalytics, trackEvent } from './analytics'

type Window = {
  plausible: any
}

jest.mock('react-ga4', () => ({
  initialize: jest.fn(),
  send: jest.fn(),
}))

describe('analytics', () => {
  describe('utm', () => {
    it('can set and get utm', () => {
      global.window = Object.create(window)
      const source = 'twitter'
      Object.defineProperty(window, 'location', {
        value: {
          search: `?utm_source=${source}`,
        },
        writable: true,
      })
      setUtm()
      expect(getUtm()).toBe(source)
    })
  })
  describe('trackEvent', () => {
    it('send event to plausible and GA', () => {
      global.window = Object.create(window)
      const mockPlausibleFunction = jest.fn()
      window.plausible = mockPlausibleFunction

      Object.defineProperty(window, 'location', {
        value: {
          host: `alpha.ens.domains`,
        },
        writable: true,
      })
      const mockSend = ReactGA4.send
      const mockInitialize = ReactGA4.initialize

      setupAnalytics([{ network: 'goerli' }])
      expect(mockInitialize).toBeCalledWith('G-5PN3YEBDZQ')
      trackEvent('register')
      expect(mockSend).toBeCalledWith({
        category: 'referral',
        action: 'register domain',
        type: 'register',
        referrer: 'twitter',
      })

      expect(mockPlausibleFunction).toBeCalledWith('register', {
        props: { referrer: 'twitter' },
      })
    })
  })
})
