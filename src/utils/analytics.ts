import ReactGA from 'react-ga4'

const V4TrackingID = 'G-5PN3YEBDZQ'
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

function isMainnet(chain: string) {
  // Change to 'mainnet' after the mainnet release
  return chain === 'goerli'
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
  if (isProduction()) {
    ReactGA.initialize(V4TrackingID)
  }
  setUtm()
}

export const trackEvent = async (type: string, chain: string) => {
  const referrer = getUtm()
  function track() {
    ReactGA.send({
      category: 'referral',
      action: `${type} domain`,
      type,
      referrer,
    })
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible(type, {
        props: {
          referrer,
        },
      })
    }
  }
  console.log('Event triggering', type, chain)
  if (isProduction() && isMainnet(chain)) {
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
