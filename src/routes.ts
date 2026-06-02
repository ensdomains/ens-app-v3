import { UrlObject } from 'url'

import {
  CogActiveSVG,
  CogSVG,
  DotGridActiveSVG,
  DotGridSVG,
  HeartActiveSVG,
  HeartSVG,
  MagnifyingGlassActiveSVG,
  MagnifyingGlassSVG,
  PersonActiveSVG,
  PersonSVG,
} from '@ensdomains/thorin'

export type PublicRoute = 'search' | 'consortium'
export type ConnectedRoute = 'names' | 'profile' | 'favourites' | 'settings' | 'admin'
export type AnyRoute = PublicRoute | ConnectedRoute | 'unknown'

export type RouteItemObj = {
  name: PublicRoute | ConnectedRoute | 'unknown'
  href: string
  label: string
  disabled: boolean
  connected: boolean
  icon?: {
    inactive: any
    active: any
  }
  onlyDropdown?: boolean
}

export const routes: RouteItemObj[] = [
  {
    name: 'search',
    href: '/',
    label: 'navigation.home',
    disabled: false,
    connected: false,
    icon: {
      inactive: MagnifyingGlassSVG,
      active: MagnifyingGlassActiveSVG,
    },
  },
  {
    name: 'names',
    href: '/my/names',
    label: 'navigation.names',
    disabled: false,
    connected: true,
    icon: {
      inactive: DotGridSVG,
      active: DotGridActiveSVG,
    },
  },
  {
    name: 'favourites',
    href: '/my/favourites',
    label: 'navigation.favourites',
    disabled: true,
    connected: true,
    icon: {
      inactive: HeartSVG,
      active: HeartActiveSVG,
    },
  },
  {
    name: 'settings',
    href: '/my/settings',
    label: 'navigation.settings',
    disabled: false,
    connected: true,
    icon: {
      inactive: CogSVG,
      active: CogActiveSVG,
    },
    onlyDropdown: true,
  },
  {
    name: 'profile',
    href: '/my/profile',
    label: 'navigation.profile',
    disabled: false,
    connected: true,
    icon: {
      inactive: PersonSVG,
      active: PersonActiveSVG,
    },
    onlyDropdown: true,
  },
  {
    name: 'admin',
    href: '/admin',
    label: 'Admin',
    disabled: false,
    connected: true,
    icon: {
      inactive: CogSVG,
      active: CogActiveSVG,
    },
    onlyDropdown: true,
  },
  {
    name: 'consortium',
    href: 'https://simplexnetwork.org/',
    label: 'navigation.consortium',
    disabled: false,
    connected: false,
  },
]

export const legacyFavouritesRoute: RouteItemObj = {
  name: 'favourites',
  href: '/legacyfavourites',
  label: 'navigation.favourites',
  disabled: true,
  connected: false,
  icon: {
    inactive: HeartSVG,
    active: HeartActiveSVG,
  },
}

export const getRoute = (name: PublicRoute | ConnectedRoute): RouteItemObj =>
  routes.find((route) => route.name === name) as RouteItemObj

// these rewrites are similar to the next.config.js rewrites
// however the destination property uses the path index instead of a named parameter
// e.g. /profile/:name => /profile?name=$2
// evaluates to /profile/ens.eth => /profile?name=ens.eth
export const rewrites = [
  {
    source: '/my/profile',
    destination: '/profile?connected=true',
    flattenedDestination: '/my/profile',
  },
  {
    source: '/names/:address',
    destination: '/my/names?address=$2',
    flattenedDestination: '/names/$2',
    tldPrefix: true,
  },
  {
    source: '/profile/:name',
    destination: '/profile?name=$2',
    flattenedDestination: '/$2',
    tldPrefix: true,
  },
  {
    source: '/expired-profile/:name',
    destination: '/profile?name=$2&expired=true',
    flattenedDestination: '/$2/expired-profile',
    tldPrefix: true,
  },
  {
    source: '/register/:name',
    destination: '/register?name=$2',
    flattenedDestination: '/$2/register',
    tldPrefix: true,
  },
  {
    source: '/import/:name',
    destination: '/import?name=$2',
    flattenedDestination: '/$2/import',
    tldPrefix: true,
  },
  {
    source: '/address/:address',
    destination: '/address?address=$2',
    flattenedDestination: '/$2',
  },
]
export const getDestination = (url: UrlObject) => {
  const isIPFS = !!process.env.NEXT_PUBLIC_IPFS
  let href = url.pathname!
  const query = new URLSearchParams((url.query || '') as any)
  for (const rewrite of rewrites) {
    const regex = new RegExp(rewrite.source.replace(/:[^/]+/g, '([^/]+)'))
    const match = regex.exec(href)
    if (match) {
      const values = href.split('/')
      let replacedDestination = (isIPFS ? rewrite.destination : rewrite.flattenedDestination)
        .replace(/\$(\d)/g, (_, n) => values[parseInt(n)])
        .replace('#', '%23')
      if (!isIPFS && rewrite.tldPrefix && !replacedDestination.includes('.')) {
        replacedDestination = `/tld${replacedDestination}`
      }
      const [newPathname, newQuery] = replacedDestination.split('?')
      if (newQuery) {
        const newQueryParams = new URLSearchParams(newQuery)
        newQueryParams.forEach((value, key) => {
          query.set(key, value)
        })
      }
      href = newPathname
    }
  }
  const makeURLString = () => {
    const parsedQuery = query.toString()
    return `${href}${parsedQuery ? `?${parsedQuery}` : ''}`
  }

  if (!isIPFS) {
    const queryObj: Record<string, string> = {}
    query.forEach((value, key) => {
      queryObj[key] = value
    })
    return {
      pathname: href,
      query: queryObj,
    }
  }
  // make absolute url relative
  // when displayed in url bar
  if (href?.startsWith('/')) {
    //  for static html compilation
    href = `.${href}`

    // on the client
    //   document is unavailable when compiling on the server
    if (typeof document !== 'undefined') {
      href = new URL(href, document.baseURI).href
    }
  }
  return makeURLString()
}

export const getDestinationAsHref = (url: UrlObject): string => {
  const result = getDestination(url)
  if (typeof result === 'string') return result
  const queryString = result.query
    ? `${new URLSearchParams(result.query as Record<string, string>).toString()}`
    : ''
  return `${result.pathname}${queryString ? `?${queryString}` : ''}`
}
