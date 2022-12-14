import { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Colors, Dropdown, MenuSVG } from '@ensdomains/thorin'

import BaseLink from './BaseLink'

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
      items={dropdownItems.map((item) =>
        item.href
          ? {
              ...item,
              wrapper: (children, key) => (
                <BaseLink href={item.disabled ? '' : item.href!} key={key}>
                  {children}
                </BaseLink>
              ),
              label: t(item.label),
              as: 'a',
              color: 'textSecondary',
            }
          : {
              ...item,
              label: t(item.label),
            },
      )}
      label={<MenuIcon />}
      {...props}
    />
  )
}
