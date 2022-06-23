import { Colors, Dropdown, MenuSVG } from '@ensdomains/thorin'
import { useRouter } from 'next/router'
import { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

export interface HamburgerItem {
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
  const { t } = useTranslation('common')
  const router = useRouter()

  const getColorForItem = (item: HamburgerItem): string => {
    if (item.disabled) return 'textTertiary'
    if (item.color) return item.color
    if (item.href === router.asPath) return 'accent'
    return 'textSecondary'
  }

  const handleItemClick = (item: HamburgerItem) => () => {
    if (item.onClick) item.onClick()
    else if (item.disabled) {
      // eslint-disable-next-line no-alert
      alert('in development')
    } else if (item.href && item.href.startsWith('https://'))
      window.location.replace(item.href)
    else if (item.href) router.push(item.href)
  }

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
        color: getColorForItem(item),
        disabled: false,
        onClick: handleItemClick(item),
      }))}
      label={<MenuIcon />}
      {...props}
    />
  )
}
