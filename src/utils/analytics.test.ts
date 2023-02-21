import { mockFunction, render, screen } from '@app/test-utils'

import { initialize, send } from 'react-ga4'

import { getUtm, setUtm, setupAnalytics, trackEvent } from './analytics'

type Window = {
  plausible: any
}

jest.mock('react-ga4')
const mockInitialize = mockFunction(initialize)
const mockSend = mockFunction(send)

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
    it('send event to plausible', () => {
      global.window = Object.create(window)
      const mockPlausibleFunction = jest.fn()
      window.plausible = mockPlausibleFunction

      Object.defineProperty(window, 'location', {
        value: {
          host: `alpha.ens.domains`,
        },
        writable: true,
      })

      setupAnalytics([{ network: 'goerli' }])
      expect(mockInitialize).toHaveBeenCalled()
      trackEvent('register')
      expect(mockPlausibleFunction).toBeCalledWith('register', {
        props: { referrer: 'twitter' },
      })
      expect(mockSend).toHaveBeenCalled()
    })
  })
})
