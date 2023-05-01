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

// remove csp headers for firefox
// to fix metamask compatibility
const removeFirefoxCsp = (response: Response) => {
  const userAgent = response.headers.get('user-agent')?.toLowerCase()
  if (
    userAgent &&
    // desktop gecko browsers
    userAgent.indexOf('gecko/20100101') !== -1 &&
    // firefox
    userAgent.indexOf('firefox/') !== -1
  ) {
    response.headers.delete('Content-Security-Policy')
  }
  return response
}

const rewriteRequest = async (url: URL, request: Request) =>
  fetch(new Request(url.toString(), request)).then(removeFirefoxCsp)

export const onRequest: PagesFunction = async ({ request, next }) => {
  const secPurpose = request.headers.get('sec-purpose')

  if (secPurpose === 'prefetch;prerender') {
    return new Response('Prefetching is not allowed', { status: 400 })
  }

  const url = new URL(request.url)
  const paths = url.pathname.split('/')

  // exception for static files
  if (paths.length === 2 && paths[1].match(/^.*\.(png|xml|ico|json|webmanifest|txt|svg|map)$/i)) {
    return next()
  }

  if (paths[1].match(/^0x[a-fA-F0-9]{40}$/)) {
    url.pathname = '/address'
    url.searchParams.set('address', paths[1])
    return rewriteRequest(url, request)
  }

  if (paths[1] === 'my' && paths[2] === 'profile') {
    url.pathname = '/profile'
    url.searchParams.set('connected', 'true')
    return rewriteRequest(url, request)
  }

  if (paths[1] === 'names' && !!paths[2]) {
    url.pathname = '/my/names'
    url.searchParams.set('address', paths[2])
    return rewriteRequest(url, request)
  }

  if (paths[1] === 'legacyFavourites') {
    url.pathname = '/legacyfavourites'
    return rewriteRequest(url, request)
  }

  if (paths[1].match(/\./g) || paths[1] === 'tld') {
    const isTLD = paths[1] === 'tld'
    url.pathname = `/${(isTLD ? paths[3] : paths[2]) || 'profile'}`
    url.searchParams.set('name', isTLD ? paths[2] : paths[1])

    if (url.pathname === '/expired-profile') {
      url.pathname = '/profile'
      url.searchParams.set('expired', 'true')
      return rewriteRequest(url, request)
    }

    if (url.pathname === '/profile') {
      const decodedName = decodeURIComponent(isTLD ? paths[2] : paths[1])
      let newTitle = 'Invalid Name - ENS'
      let newDescription = 'An error occurred'
      try {
        const { normalise } = await import('@ensdomains/ensjs/utils/normalise')
        const normalisedName = normalise(decodedName)
        newTitle = `${normalisedName} on ENS`
        newDescription = `${normalisedName}'s profile on the Ethereum Name Service`
      } catch {
        console.error('Name could not be normalised')
      }

      return new HTMLRewriter()
        .on('title', new ContentModifier(newTitle))
        .on('meta[name="description"]', new AttributeModifier('content', newDescription))
        .transform(await rewriteRequest(url, request))
    }

    return rewriteRequest(url, request)
  }

  return next()
}
