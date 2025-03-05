import type { UrlObject } from 'url'

import Link from 'next/link'
import { ComponentProps } from 'react'
import styled, { css } from 'styled-components'

import { AsProp, Typography, type FontVariant } from '@ensdomains/thorin'

import OutlinkSVG from '@app/assets/Outlink.svg'

import BaseLink from './@atoms/BaseLink'

export const StyledAnchor = styled.a(
  ({ theme }) => css`
    padding-right: ${theme.space['4']};
    color: ${theme.colors.accent};
    cursor: pointer;
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    gap: ${theme.space['1']};
  `,
)

const OutlinkIcon = styled.div(
  ({ theme }) => css`
    width: ${theme.space['3.5']};
    height: ${theme.space['3.5']};
    opacity: 0.5;
  `,
)

export const OutlinkTypography = styled(Typography)(
  () => css`
    display: inline-block;
  `,
)

export const Outlink = ({
  href,
  children,
  fontVariant = 'smallBold',
  icon = OutlinkSVG,
  iconPosition = 'before',
  ...props
}: Omit<ComponentProps<'a'>, 'href' | 'target' | 'rel'> &
  ComponentProps<typeof StyledAnchor> & {
    href: string | UrlObject
    fontVariant?: FontVariant
    icon?: AsProp
    iconPosition?: 'before' | 'after'
  }) => {
  const InnerContent = (
    <StyledAnchor rel="noreferrer noopener" target="_blank" role="link" {...props}>
      {iconPosition === 'before' ? <OutlinkIcon as={icon} /> : null}
      <OutlinkTypography fontVariant={fontVariant} color="blue">
        {children}
      </OutlinkTypography>
      {iconPosition === 'after' ? <OutlinkIcon as={icon} /> : null}
    </StyledAnchor>
  )

  if (typeof href === 'string' && href.startsWith('http')) {
    return (
      <Link href={href} passHref legacyBehavior>
        {InnerContent}
      </Link>
    )
  }

  return (
    <BaseLink href={href} passHref legacyBehavior>
      {InnerContent}
    </BaseLink>
  )
}
