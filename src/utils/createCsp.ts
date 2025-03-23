let csp = ''

// worker-src
csp += 'worker-src'
// allow our own worker scripts
csp += " 'self' blob:"
// allow Para (Capsule) worker scripts
csp += ' https://app.beta.usecapsule.com'
csp += ' https://app.usecapsule.com'
// end worker-src
csp += ';'

// script-src
csp += ' script-src'
// allow self
csp += " 'self'"
// allow plausible script
csp += ' plausible.io'
// allow PostHog
csp += ' jakob.ens.domains'
// allow cloudflare analytics script
csp += ' https://static.cloudflareinsights.com'
// allow loading from the pages domain for this app
csp += ' *.ens-app-v3.pages.dev'
// allow intercom scripts
csp += ' https://app.intercom.io'
csp += ' https://widget.intercom.io'
csp += ' https://js.intercomcdn.com'
// allow Para (Capsule) scripts
csp += ' https://app.beta.usecapsule.com'
csp += ' https://app.usecapsule.com'

// allow inline wasm evaluation
csp += " 'wasm-unsafe-eval'"
// INLINE SCRIPT HASHES
// hiddenCheckScript
csp += " 'sha256-UyYcl+sKCF/ROFZPHBlozJrndwfNiC5KT5ZZfup/pPc='"
// themeSwitcherScript
csp += " 'sha256-84jekTLuMPFFzbBxEFpoUhJbu81z5uBinvhIKKkAPxg='"
// end script-src
csp += ';'

// for use with csp meta tag
export const cspWithoutFrameAncestors = csp

let frameAncestors = ''

// frame-ancestors
frameAncestors += 'frame-ancestors'
// allow self
frameAncestors += " 'self'"
// allow safe wallet
frameAncestors += ' https://app.safe.global'
// end frame-ancestors
frameAncestors += ';'

export const cspOnlyFrameAncestors = frameAncestors
export const cspWithFrameAncestors = `${csp} ${frameAncestors}`
