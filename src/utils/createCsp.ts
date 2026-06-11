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
// SNRC: analytics/tracker script sources removed (Plausible, PostHog,
// Cloudflare Web Analytics, Intercom). Note: Cloudflare Web Analytics is
// injected by Cloudflare server-side when enabled — also disable it in the
// Cloudflare Pages dashboard.
// allow loading from the pages domain for this app
csp += ' *.ens-app-v3.pages.dev'
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
