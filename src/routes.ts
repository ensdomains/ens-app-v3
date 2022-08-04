import CogSVG from './assets/Cog.svg'
import GridSVG from './assets/Grid.svg'
import HeartSVG from './assets/Heart.svg'
import MagnifyingGlassSVG from './assets/MagnifyingGlass.svg'

export type PublicRoute = 'search' | 'about' | 'developers' | 'community' | 'help' | 'governance' | 'docs'
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
    name: 'about',
    href: '/about',
    label: 'navigation.about',
    disabled: true,
    connected: false,
  },
  {
    name: 'developers',
    href: '/developers',
    label: 'navigation.developers',
    disabled: true,
    connected: false,
  },
  {
    name: 'community',
    href: '/community',
    label: 'navigation.community',
    disabled: true,
    connected: false,
  },
  {
    name: 'help',
    href: '/help',
    label: 'navigation.help',
    disabled: true,
    connected: false,
  },
  {
    name: 'governance',
    href: '/governance',
    label: 'navigation.governance',
    disabled: true,
    connected: false,
  },
  {
    name: 'docs',
    href: '/docs',
    label: 'navigation.docs',
    disabled: true,
    connected: false,
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
    name: 'profile',
    href: '/my/profile',
    label: 'navigation.profile',
    disabled: false,
    connected: true,
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
]

export const getRoute = (name: PublicRoute | ConnectedRoute): RouteItemObj =>
  routes.find((route) => route.name === name) as RouteItemObj
