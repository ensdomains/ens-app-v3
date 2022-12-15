import { UrlObject } from 'url'

import CogSVG from './assets/Cog.svg'
import GridSVG from './assets/Grid.svg'
import HeartSVG from './assets/Heart.svg'
import MagnifyingGlassSVG from './assets/MagnifyingGlass.svg'

export type PublicRoute =
  | 'search'
  | 'faq'
  | 'governance'
  | 'community'
  | 'developers'
  | 'support'
  | 'bounty'
  | 'terms'
  | 'privacy'
export type ConnectedRoute = 'names' | 'profile' | 'favourites' | 'settings'
export type AnyRoute = PublicRoute | ConnectedRoute | 'unknown'

export type RouteItemObj = {
  name: PublicRoute | ConnectedRoute | 'unknown'
  href: string
  label: string
  disabled: boolean
  connected: boolean
  icon?: any
}

export const routes: RouteItemObj[] = [
  {
    name: 'search',
    href: '/',
    label: 'navigation.home',
    disabled: false,
    connected: false,
    icon: MagnifyingGlassSVG,
  },
  {
    name: 'names',
    href: '/my/names',
    label: 'navigation.names',
    disabled: false,
    connected: true,
    icon: GridSVG,
  },
  {
    name: 'favourites',
    href: '/my/favourites',
    label: 'navigation.favourites',
    disabled: true,
    connected: true,
    icon: HeartSVG,
  },
  {
    name: 'settings',
    href: '/my/settings',
    label: 'navigation.settings',
    disabled: false,
    connected: true,
    icon: CogSVG,
  },
  {
    name: 'profile',
    href: '/my/profile',
    label: 'navigation.profile',
    disabled: false,
    connected: true,
  },
  {
    name: 'faq',
    href: '/faq',
    label: 'navigation.faq',
    disabled: false,
    connected: false,
  },
  {
    name: 'governance',
    href: 'https://ens.domains/governance',
    label: 'navigation.governance',
    disabled: false,
    connected: false,
  },
  {
    name: 'community',
    href: 'https://chat.ens.domains/',
    label: 'navigation.community',
    disabled: false,
    connected: false,
  },
  {
    name: 'developers',
    href: 'https://docs.ens.domains/',
    label: 'navigation.developers',
    disabled: false,
    connected: false,
  },
  {
    name: 'support',
    href: 'https://ens.domains/#get-support',
    label: 'navigation.support',
    disabled: false,
    connected: false,
  },
  {
    name: 'bounty',
    href: 'https://docs.ens.domains/bug-bounty-program',
    label: 'navigation.bounty',
    disabled: false,
    connected: false,
  },
  {
    name: 'terms',
    href: '/legal/terms-of-use',
    label: 'navigation.terms',
    disabled: false,
    connected: false,
  },
  {
    name: 'privacy',
    href: '/legal/privacy-policy',
    label: 'navigation.privacy',
    disabled: false,
    connected: false,
  },
]

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
  },
  {
    source: '/names/:address',
    destination: '/my/names?address=$2',
  },
  {
    source: '/profile/:name',
    destination: '/profile?name=$2',
  },
  {
    source: '/register/:name',
    destination: '/register?name=$2',
  },
  {
    source: '/import/:name',
    destination: '/import?name=$2',
  },
  {
    source: '/address/:address',
    destination: '/address?address=$2',
  },
]
export const getDestination = (url: UrlObject | string) => {
  if (!process.env.NEXT_PUBLIC_IPFS) return url
  const isObj = typeof url !== 'string'
  let href = isObj ? url.pathname! : url
  const query = new URLSearchParams(isObj ? ((url.query || '') as any) : '')
  for (const rewrite of rewrites) {
    const regex = new RegExp(rewrite.source.replace(/:[^/]+/g, '([^/]+)'))
    const match = regex.exec(href)
    if (match) {
      const values = href.split('/')
      const replacedDestination = rewrite.destination.replace(
        /\$(\d)/g,
        (_, n) => values[parseInt(n)],
      )
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
  // make absolute url relative
  // when displayed in url bar
  if (href?.startsWith('/')) {
    //  for static html compilation
    href = `.${href}`
    // <IPFSLink href="/about"> => <a class="jsx-2055897931" href="./about">About</a>

    // on the client
    //   document is unavailable when compiling on the server
    if (typeof document !== 'undefined') {
      href = new URL(href, document.baseURI).href
      // => <a href="https://gateway.ipfs.io/ipfs/Qm<hash>/about">About</a>
    }
  }
  const parsedQuery = query.toString()
  return `${href}${parsedQuery ? `?${parsedQuery}` : ''}`
}
