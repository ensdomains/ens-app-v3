import { getUtm, setUtm, setupAnalytics, trackEvent } from './analytics'

type Window = {
  plausible: any
}

const network = 'mainnet'

describe('analytics', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

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

      setupAnalytics()
      trackEvent('register', network)
      expect(mockPlausibleFunction).toBeCalledWith('register', {
        props: { referrer: 'twitter' },
      })
    })
  })
})
