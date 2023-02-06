/* eslint max-classes-per-file: "off" */
import { normalise } from '@ensdomains/ensjs/utils/normalise'

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

export const onRequest: PagesFunction = async ({ request, next }) => {
  const url = new URL(request.url)

  const paths = url.pathname.split('/')

  let rewrite = false
  let callback: ((res: Response) => Response) | null = null

  if (paths[1].match(/^0x[a-fA-F0-9]{40}$/)) {
    url.pathname = '/address'
    url.searchParams.set('address', paths[1])
    rewrite = true
  } else if (paths[1] === 'my' && paths[2] === 'profile') {
    url.pathname = '/profile'
    url.searchParams.set('connected', 'true')
    rewrite = true
  } else if (paths[1] === 'names' && !!paths[2]) {
    url.pathname = '/my/names'
    url.searchParams.set('address', paths[2])
    rewrite = true
  } else if (paths[1].match(/\./g) || paths[1] === 'tld') {
    const isTLD = paths[1] === 'tld'
    url.pathname = `/${(isTLD ? paths[3] : paths[2]) || 'profile'}`
    url.searchParams.set('name', isTLD ? paths[2] : paths[1])
    rewrite = true

    if (url.pathname === '/expired-profile') {
      url.pathname = '/profile'
      url.searchParams.set('expired', 'true')
    }

    if (url.pathname === '/profile') {
      const decodedName = decodeURIComponent(isTLD ? paths[2] : paths[1])
      let newTitle = 'Invalid Name - ENS'
      let newDescription = 'An error occurred'
      try {
        const normalisedName = normalise(decodedName)
        newTitle = `${normalisedName} on ENS`
        newDescription = `${normalisedName}'s profile on the Ethereum Name Service`
        // eslint-disable-next-line no-empty
      } catch {
        console.error('Name could not be normalised')
      }
      callback = (res) =>
        new HTMLRewriter()
          .on('title', new ContentModifier(newTitle))
          .on('meta[name="description"]', new AttributeModifier('content', newDescription))
          .transform(res)
    }
  }

  if (rewrite) {
    const rewriteRequest = new Request(url.toString(), request)
    const response = await fetch(rewriteRequest)

    if (callback) {
      return callback(response)
    }

    return response
  }

  return next()
}
