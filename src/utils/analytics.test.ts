import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getUtm, setupAnalytics, setUtm, trackEvent } from './analytics'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      global.window ??= Object.create(window)
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
    it.each(['home', 'my_names'])(
      'sends banner placement %s without wallet or name properties',
      (placement) => {
        window.plausible = vi.fn()
        Object.defineProperty(window, 'location', {
          value: { host: 'app.ens.domains' },
          writable: true,
        })
        window.sessionStorage.clear()

        trackEvent('ensv2:banner_click', network, { placement })

        expect(window.plausible).toHaveBeenCalledExactlyOnceWith('ensv2:banner_click', {
          props: { placement, referrer: null },
        })
      },
    )

    it.each([
      ['localhost:3000', 'mainnet'],
      ['app.ens.domains', 'sepolia'],
    ])('does not send banner events on %s / %s', (host, chain) => {
      window.plausible = vi.fn()
      Object.defineProperty(window, 'location', { value: { host }, writable: true })

      trackEvent('ensv2:banner_click', chain, { placement: 'home' })

      expect(window.plausible).not.toHaveBeenCalled()
    })

    it('send event to plausible', () => {
      global.window ??= Object.create(window)
      const mockPlausibleFunction = vi.fn()
      window.plausible = mockPlausibleFunction
      window.sessionStorage.setItem('utmSource', 'twitter')

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
