import { Dropdown, MenuSVG, tokens } from '@ensdomains/thorin'
import type { DropdownItem } from '@ensdomains/thorin/dist/types/components/molecules/Dropdown/Dropdown'
import { useRouter } from 'next/router'
import styled from 'styled-components'

export interface HamburgerItem extends Partial<DropdownItem> {
  label: string
  href?: string
}

const MenuIcon = styled(MenuSVG)`
  display: block;
  width: ${tokens.space['4.5']};
  height: ${tokens.space['4.5']};
  stroke-width: ${tokens.borderWidths['0.75']};
`

export const HamburgerMenu = ({
  dropdownItems,
}: {
  dropdownItems: HamburgerItem[]
}) => {
  const router = useRouter()

  return (
    <Dropdown
      chevron={false}
      shortThrow
      keepMenuOnTop
      buttonProps={{
        shadowless: true,
        variant: 'transparent',
        size: 'extraSmall',
      }}
      align="right"
      items={dropdownItems.map((item) => ({
        ...item,
        color:
          item.color || router.asPath === item.href
            ? 'accent'
            : 'textSecondary',
        onClick:
          item.onClick ||
          (() =>
            item.href &&
            (item.href.startsWith('https://')
              ? window.location.replace(item.href)
              : router.push(item.href))) ||
          (() => null),
      }))}
      label={<MenuIcon />}
    />
  )
}
