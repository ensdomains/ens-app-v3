/* eslint max-classes-per-file: "off" */

class ContentModifier {
  private newContent: string

  constructor(newContent: string) {
    this.newContent = newContent
  }

  element(element: Element) {
    element.setInnerContent(this.newContent)
  }
}

class AttributeModifier {
  private attributeName: string

  private newContent: string

  constructor(attributeName: string, newContent: string) {
    this.attributeName = attributeName
    this.newContent = newContent
  }

  element(element: Element) {
    element.setAttribute(this.attributeName, this.newContent)
  }
}

// class ScriptWriter {
//   private src: string

//   constructor(src: string) {
//     this.src = src
//   }

//   element(element: Element) {
//     element.append(`<script src="${this.src}"></script>`, { html: true })
//   }
// }

// exception for static files
const staticHandler: PagesFunction = async ({ request, next, env }) => {
  const url = new URL(request.url)
  const paths = url.pathname.split('/')

  if (paths[paths.length - 1].match(/^.*\.(png|xml|ico|json|webmanifest|txt|svg|map|js)$/i)) {
    return env.ASSETS.fetch(request)
  }

  return next()
}

const firefoxRewrite: PagesFunction = async ({ next }) => {
  // const userAgent = request.headers.get('user-agent')?.toLowerCase()
  const response = await next()

  // ****************************************************** CSP HEADERS DEFAULTS ******************************************************

  // default headers
  // response.headers.set(
  //   'Content-Security-Policy',
  //   "worker-src 'self'; script-src 'self' 'sha256-UyYcl+sKCF/ROFZPHBlozJrndwfNiC5KT5ZZfup/pPc=' https://*.googletagmanager.com plausible.io static.cloudflareinsights.com *.ens-app-v3.pages.dev https://app.intercom.io https://widget.intercom.io https://js.intercomcdn.com 'wasm-unsafe-eval'; frame-ancestors 'self' https://app.safe.global;",
  // )

  // Default policy for all resource types, restricts everything to the same origin ('self'). default-src 'self'

  // Limits worker sources (Service Workers, Web Workers) to the same origin for security. worker-src 'self'

  // Controls where scripts can be loaded from:
  // - 'self' allows scripts from the same origin.
  // - 'sha256-UyYcl+sKCF/ROFZPHBlozJrndwfNiC5KT5ZZfup/pPc=' is a specific inline script allowed by hash.
  // - External trusted domains (e.g., Google Tag Manager, Plausible, Cloudflare, ENS, and Intercom).
  // - 'wasm-unsafe-eval' allows WebAssembly execution using eval().

  // Controls where styles (CSS) can be loaded from:
  // - 'self' allows styles from the same origin.
  // - 'unsafe-inline' permits inline styles (needed in some frameworks like React).
  // - Allows external styles from Google Fonts.

  // Limits image sources to:
  // - 'self' allows images from the same origin.
  // - 'data:' allows inline base64-encoded images (useful for certain cases).

  // Controls where fonts can be loaded from:
  // - 'self' allows fonts from the same origin.
  // - Allows external fonts from Google Fonts.

  // Disables plugins like Flash for enhanced security. object-src 'none'

  // Ensures that forms can only submit data to the same origin. form-action 'self'

  // Protects against clickjacking by allowing the site to be embedded only in frames on the same origin and on specific trusted domains (e.g., app.safe.global). frame-ancestors 'self' https://app.safe.global;

  // Prevents setting a base URL, reducing the risk of injection attacks via the base element. base-uri 'self'

  // Controls where the browser can make network requests:
  // - 'self' allows network requests to the same origin.
  // - Specific trusted external domains (e.g., IPFS, Ethereum, Infura) are permitted for API and data fetching.

  // Ensures that all requests are upgraded from HTTP to HTTPS. upgrade-insecure-requests;

  // Blocks any mixed content (e.g., loading HTTP resources on an HTTPS page) to ensure full security.

  const defaultCSP = `
  default-src 'self';
  worker-src 'self';
  script-src 'self' 'sha256-UyYcl+sKCF/ROFZPHBlozJrndwfNiC5KT5ZZfup/pPc=' https://*.googletagmanager.com plausible.io static.cloudflareinsights.com https://*.ens-app-v3.pages.dev https://app.intercom.io https://widget.intercom.io https://js.intercomcdn.com 'wasm-unsafe-eval';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https://*.ipfs.io  https://ipfs.euc.li  ipfs://*;
  font-src 'self' https://fonts.googleapis.com;
  object-src 'none';
  form-action 'self';
  frame-ancestors 'self' https://app.safe.global;
  base-uri 'self';
  connect-src 'self' https://*.ipfs.io https://*.ethereum.org https://mainnet.infura.io  https://ipfs.euc.li  ipfs://*;
  upgrade-insecure-requests;
  block-all-mixed-content;
  `
    .replace(/\s{2,}/g, ' ')
    .trim()

  response.headers.set('Content-Security-Policy', defaultCSP)

  response.headers.set('X-Frame-Options', 'DENY') // Prevent clickjacking
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload') // Enforce HTTPS
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), fullscreen=()',
  ) // Restrict browser features
  response.headers.set('Referrer-Policy', 'no-referrer') // Strictest referrer policy
  response.headers.set('X-Content-Type-Options', 'nosniff') // Prevent MIME type sniffing
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none') // Restrict cross-domain policies
  response.headers.set('Expect-CT', 'max-age=86400, enforce') // Ensure Certificate Transparency
  response.headers.set(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  ) // Secure cache management

  // ****************************************************** CSP HEADERS FOR FIREFOX DEFAULTS ******************************************************
  // firefox CSP exception + metamask script
  // if (userAgent?.includes('gecko/20100101') && userAgent.includes('firefox/')) {
  //   return new HTMLRewriter()
  //     .on('head', new ScriptWriter('/_next/static/chunks/initialise-metamask.js'))
  //     .transform(response)
  // }

  return response
}

const baseOgImageUrl = 'https://ens-og-image.ens-cf.workers.dev'

const pathRewriter: PagesFunction = async ({ request, next }) => {
  const url = new URL(request.url)
  const paths = url.pathname.split('/')

  const nextWithUpdate = () => next(new Request(url.toString(), request))

  if (paths[1].match(/^0x[a-fA-F0-9]{40}$/)) {
    const address = paths[1]
    url.pathname = '/address'
    url.searchParams.set('address', address)

    const ogImageUrl = `${baseOgImageUrl}/address/${address}`

    const newTitle = `${address.slice(0, 7)}...${address.slice(-5)} on ENS`
    const newDescription = `${address}'s profile on the Ethereum Name Service`

    return new HTMLRewriter()
      .on('title', new ContentModifier(newTitle))
      .on('meta[name="description"]', new AttributeModifier('content', newDescription))
      .on('meta[property="og:image"]', new AttributeModifier('content', ogImageUrl))
      .on('meta[property="og:title"]', new AttributeModifier('content', newTitle))
      .on('meta[property="og:description"]', new AttributeModifier('content', newDescription))
      .on('meta[property="twitter:image"]', new AttributeModifier('content', ogImageUrl))
      .on('meta[property="twitter:title"]', new AttributeModifier('content', newTitle))
      .on('meta[property="twitter:description"]', new AttributeModifier('content', newDescription))
      .transform(await nextWithUpdate())
  }

  if (paths[1] === 'my' && paths[2] === 'profile') {
    url.pathname = '/profile'
    url.searchParams.set('connected', 'true')
    return nextWithUpdate()
  }

  if (paths[1] === 'names' && !!paths[2]) {
    url.pathname = '/my/names'
    url.searchParams.set('address', paths[2])
    return nextWithUpdate()
  }

  if (paths[1] === 'legacyFavourites') {
    url.pathname = '/legacyfavourites'
    return nextWithUpdate()
  }

  if (paths[1].match(/\./g) || paths[1] === 'tld') {
    const isTLD = paths[1] === 'tld'
    url.pathname = `/${(isTLD ? paths[3] : paths[2]) || 'profile'}`
    url.searchParams.set('name', isTLD ? paths[2] : paths[1])

    if (url.pathname === '/expired-profile') {
      url.pathname = '/profile'
      url.searchParams.set('expired', 'true')
      return nextWithUpdate()
    }

    if (url.pathname === '/profile') {
      const decodedName = decodeURIComponent(isTLD ? paths[2] : paths[1])
      let newTitle = 'Invalid Name - ENS'
      let newDescription = 'An error occurred'
      let normalisedName: string | null = null
      try {
        const { normalize } = await import('viem/ens')
        normalisedName = normalize(decodedName)
        newTitle = `${normalisedName} on ENS`
        newDescription = `${normalisedName}'s profile on the Ethereum Name Service`
      } catch {
        console.error('Name could not be normalised')
      }

      const ogImageUrl = normalisedName
        ? `${baseOgImageUrl}/name/${normalisedName}`
        : `${baseOgImageUrl}/name/`

      return new HTMLRewriter()
        .on('title', new ContentModifier(newTitle))
        .on('meta[name="description"]', new AttributeModifier('content', newDescription))
        .on('meta[property="og:image"]', new AttributeModifier('content', ogImageUrl))
        .on('meta[property="og:title"]', new AttributeModifier('content', newTitle))
        .on('meta[property="og:description"]', new AttributeModifier('content', newDescription))
        .on('meta[property="twitter:image"]', new AttributeModifier('content', ogImageUrl))
        .on('meta[property="twitter:title"]', new AttributeModifier('content', newTitle))
        .on(
          'meta[property="twitter:description"]',
          new AttributeModifier('content', newDescription),
        )
        .transform(await nextWithUpdate())
    }

    return nextWithUpdate()
  }

  return next()
}

export const onRequest = [staticHandler, firefoxRewrite, pathRewriter]
