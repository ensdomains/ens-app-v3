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
