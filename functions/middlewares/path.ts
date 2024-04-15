import { addressRewriter } from '../rewriter/address'
import { profileRewriter } from '../rewriter/profile'

export const pathMiddleware: PagesFunction = async ({ request, next }) => {
  const url = new URL(request.url)
  const paths = url.pathname.split('/')

  const nextWithUpdate = () => next(new Request(url.toString(), request))

  if (paths[1].match(/^0x[a-fA-F0-9]{40}$/)) {
    const rewriter = await addressRewriter({ request, paths, url })
    return rewriter.transform(await nextWithUpdate())
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
    const isTld = paths[1] === 'tld'
    url.pathname = `/${(isTld ? paths[3] : paths[2]) || 'profile'}`
    url.searchParams.set('name', isTld ? paths[2] : paths[1])

    if (url.pathname === '/expired-profile') {
      url.pathname = '/profile'
      url.searchParams.set('expired', 'true')
      return nextWithUpdate()
    }

    if (url.pathname === '/profile') {
      const rewriter = await profileRewriter({ isTld, paths, request })
      return rewriter.transform(await nextWithUpdate())
    }

    return nextWithUpdate()
  }

  return next()
}
