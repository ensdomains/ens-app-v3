import { mainnet } from 'viem/chains'

import type { SupportedChain } from '@app/constants/chains'

declare global {
  interface Window {
    plausible: any
  }
}

function isProduction() {
  if (typeof window !== 'undefined') {
    return !!window.location.host.match('ens.domains')
  }
}

export function setUtm() {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search)
    const utmSource = urlParams.get('utm_source')
    if (utmSource) {
      window.sessionStorage.setItem('utmSource', utmSource)
    }
  }
}

export function getUtm() {
  return window.sessionStorage.getItem('utmSource')
}

export const setupAnalytics = () => {
  setUtm()
}

export const trackEvent = async (type: string, chainId: SupportedChain['id']) => {
  const referrer = getUtm()
  function track() {
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible(type, {
        props: {
          referrer,
        },
      })
    }
  }
  console.log('Event triggering', type, chainId)
  if (isProduction() && chainId === mainnet.id) {
    track()
  } else {
    console.log(
      'Event triggered on local development',
      JSON.stringify({
        type,
        referrer,
      }),
    )
  }
}
