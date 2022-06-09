import { useConnected } from '@app/hooks/useConnected'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { useTranslation } from 'react-i18next'
import { HamburgerMenu } from '../@atoms/HamburgerMenu'

const publicRoutes = [
  { href: '/', disabled: false, label: 'navigation.home' },
  { href: '/about', disabled: true, label: 'navigation.about' },
  { href: '/developers', disabled: true, label: 'navigation.developers' },
  {
    label: 'navigation.community',
    disabled: true,
    href: '/community',
  },
  {
    label: 'navigation.help',
    disabled: true,
    href: '/help',
  },
  {
    label: 'navigation.governance',
    disabled: true,
    href: '/governance',
  },
  {
    label: 'navigation.docs',
    disabled: true,
    href: '/docs',
  },
]

const connectedRoutes = [
  {
    label: 'navigation.connected.favourites',
    disabled: true,
    href: '/favourites',
  },
  { label: 'navigation.connected.myNames', disabled: false, href: '/names' },
]

export const FilledHamburgerMenu = () => {
  const { t } = useTranslation('common')
  const connected = useConnected()
  const breakpoints = useBreakpoint()
  const dropdownRoutes = breakpoints.sm
    ? [
        publicRoutes[0],
        ...(connected ? connectedRoutes : []),
        ...publicRoutes.slice(1),
      ]
    : publicRoutes.slice(1)

  return (
    <HamburgerMenu
      dropdownItems={dropdownRoutes.map((route) => ({
        ...route,
        label: t(route.label),
      }))}
    />
  )
}
