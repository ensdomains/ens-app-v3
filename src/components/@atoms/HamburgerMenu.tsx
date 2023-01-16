import { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Colors, Dropdown, MenuSVG } from '@ensdomains/thorin'

import BaseLink from './BaseLink'

export interface HamburgerItem {
  label: string
  onClick?: () => void
  color?: Colors
  disabled?: boolean
  href?: string
}

const IconWrapper = styled.div<{}>(
  ({ theme }) => css`
    width: ${theme.space['8.5']};
    height: ${theme.space['8.5']};
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: ${theme.space['5']};
      height: ${theme.space['5']};
      color: ${theme.colors.greyPrimary};
      stroke-width: '0.1875rem';
    }
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
      align="right"
      items={dropdownItems.map((item) =>
        item.href
          ? {
              ...item,
              wrapper: (children, key) => (
                <BaseLink href={item.disabled ? '' : item.href!} passHref key={key}>
                  {children}
                </BaseLink>
              ),
              label: t(item.label),
              as: 'a',
              color: 'greyPrimary',
            }
          : {
              ...item,
              label: t(item.label),
            },
      )}
      {...props}
    >
      <Button colorStyle="transparent" size="flexible">
        <IconWrapper>
          <MenuSVG />
        </IconWrapper>
      </Button>
    </Dropdown>
  )
}
