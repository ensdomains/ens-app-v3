import ReactGA4 from 'react-ga4'

const V4TrackingID = 'G-5PN3YEBDZQ'
interface Chain {
  network: string
}
let chains: Chain[]

function isProduction() {
  if (typeof window !== 'undefined') {
    return !!window.location.host.match('ens.domains')
  }
}

function isMainnet(chains: Chain[]) {
  // Change to 'mainnet' after the mainnet release
  return chains.map((c) => c.network).includes('goerli')
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

export const setupAnalytics = (_chains: Chain[]) => {
  if (isProduction()) {
    ReactGA4.initialize(V4TrackingID)
  }
  chains = _chains
  setUtm()
}

export const trackEvent = async (type: string) => {
  const referrer = getUtm()
  function track() {
    ReactGA4.send({
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
  if (isProduction() && isMainnet(chains)) {
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
