import { Colors, Dropdown, MenuSVG } from '@ensdomains/thorin'
import { useRouter } from 'next/router'
import { ComponentProps } from 'react'
import { useLoadedTranslation } from '@app/hooks/useLoadedTranslation'
import styled, { css } from 'styled-components'

export type HamburgerItem = {
  label: string
  onClick?: () => void
  color?: Colors
  disabled?: boolean
  href?: string
}

const MenuIcon = styled(MenuSVG)(
  ({ theme }) => css`
    display: block;
    width: ${theme.space['4.5']};
    height: ${theme.space['4.5']};
    stroke-width: ${theme.borderWidths['0.75']};
  `,
)

export const HamburgerMenu = ({
  dropdownItems,
  ...props
}: {
  dropdownItems: HamburgerItem[]
} & Omit<Partial<ComponentProps<typeof Dropdown>>, 'isOpen' | 'setIsOpen'>) => {
  const { t } = useLoadedTranslation('common')
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
        label: t(item.label),
        value: item.href,
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
      {...props}
    />
  )
}
