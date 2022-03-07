import { DropdownButton, IconMenu } from '@ensdomains/thorin'
import type { DropdownItem } from '@ensdomains/thorin/dist/types/components/molecules/Dropdown/Dropdown'
import { useRouter } from 'next/router'

export interface HamburgerItem extends Partial<DropdownItem> {
  label: string
  href?: string
}

export const HamburgerMenu = ({
  dropdownItems,
}: {
  dropdownItems: HamburgerItem[]
}) => {
  const router = useRouter()

  return (
    <DropdownButton
      chevron={false}
      shortThrow
      keepMenuOnTop
      buttonProps={{
        shadowless: true,
        variant: 'transparent',
        size: 'extraSmall',
      }}
      align="right"
      dropdownItems={dropdownItems.map((item) => ({
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
    >
      <IconMenu />
    </DropdownButton>
  )
}
