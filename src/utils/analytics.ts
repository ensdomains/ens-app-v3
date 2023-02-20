import ReactGA4 from 'react-ga4'

const V4TrackingID = 'G-5PN3YEBDZQ'
declare global {
  interface Window {
    plausible: any
    location: Location
    sessionStorage: any
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
  if (isProduction()) {
    ReactGA4.initialize(V4TrackingID)
  }

  setUtm()
}

export const trackEvent = async (type: string) => {
  const referrer = getUtm()

  function track() {
    const eventObject = {
      category: 'referral',
      action: `${type} domain`,
      type,
      referrer,
    }
    ReactGA4.send(eventObject)
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible(type, {
        props: {
          referrer,
        },
      })
    }
  }
  if (isProduction()) {
    track()
  } else {
    console.log(
      'Referral triggered on local development',
      JSON.stringify({
        type,
        referrer,
      }),
    )
  }
}
