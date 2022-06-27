import { routes } from '@app/routes'
import { ComponentProps } from 'react'
import { HamburgerMenu } from '../@atoms/HamburgerMenu'

const dropdownRoutes = routes.filter(
  (route) => route.name !== 'search' && route.connected === false,
)

export const HamburgerRoutes = (
  props: Omit<ComponentProps<typeof HamburgerMenu>, 'dropdownItems'>,
) => {
  return <HamburgerMenu dropdownItems={dropdownRoutes} {...props} />
}
