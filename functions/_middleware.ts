/* eslint max-classes-per-file: "off" */
import { cspOnlyFrameAncestors, cspWithFrameAncestors } from '@app/utils/createCsp'

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

class ScriptWriter {
  private src: string

  constructor(src: string) {
    this.src = src
  }

  element(element: Element) {
    element.append(`<script src="${this.src}"></script>`, { html: true })
  }
}

// exception for static files
const staticHandler: PagesFunction = async ({ request, next, env }) => {
  const url = new URL(request.url)
  const paths = url.pathname.split('/')

  if (paths[paths.length - 1].match(/^.*\.(png|xml|ico|json|webmanifest|txt|svg|map|js)$/i)) {
    return env.ASSETS.fetch(request)
  }

  return next()
}

const cspRewrite: PagesFunction = async ({ request, next }) => {
  const userAgent = request.headers.get('user-agent')?.toLowerCase()
  const response = await next()

  // firefox CSP exception + metamask script
  if (userAgent?.includes('gecko/20100101') && userAgent.includes('firefox/')) {
    response.headers.set('Content-Security-Policy', cspOnlyFrameAncestors)
    return new HTMLRewriter()
      .on('head', new ScriptWriter('/_next/static/chunks/initialise-metamask.js'))
      .transform(response)
  }

  // safari CSP exception
  if (userAgent?.includes('safari/') && userAgent.includes('version/')) {
    response.headers.set('Content-Security-Policy', cspOnlyFrameAncestors)
    return response
  }

  // default headers
  response.headers.set('Content-Security-Policy', cspWithFrameAncestors)
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

export const onRequest = [staticHandler, cspRewrite, pathRewriter]
