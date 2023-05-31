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

const firefoxRewrite: PagesFunction = async ({ request, next }) => {
  const userAgent = request.headers.get('user-agent')?.toLowerCase()

  if (userAgent) {
    if (
      userAgent.indexOf('gecko/20100101') !== -1 &&
      // firefox
      userAgent.indexOf('firefox/') !== -1
    ) {
      return new HTMLRewriter()
        .on('head', new ScriptWriter('/_next/static/chunks/initialise-metamask.js'))
        .transform(await next())
    }
    if (
      userAgent.indexOf('webview metamaskmobile') !== -1 &&
      userAgent.indexOf('applewebkit') !== -1
    ) {
      return new HTMLRewriter()
        .on('head', new ScriptWriter('/_next/static/chunks/initialise-metamask-ios.js'))
        .transform(await next())
    }
  }

  return next()
}

const pathRewriter: PagesFunction = async ({ request, next }) => {
  const url = new URL(request.url)
  const paths = url.pathname.split('/')

  const nextWithUpdate = () => next(new Request(url.toString(), request))

  if (paths[1].match(/^0x[a-fA-F0-9]{40}$/)) {
    url.pathname = '/address'
    url.searchParams.set('address', paths[1])
    return nextWithUpdate()
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
        .transform(await nextWithUpdate())
    }

    return nextWithUpdate()
  }

  return next()
}

export const onRequest = [staticHandler, firefoxRewrite, pathRewriter]
