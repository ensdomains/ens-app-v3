import type { UrlObject } from 'url'

import Link from 'next/link'
import { ComponentProps } from 'react'
import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'
import { FontVariant } from '@ensdomains/thorin/dist/types/types'

import OutlinkSVG from '@app/assets/Outlink.svg'

import BaseLink from './@atoms/BaseLink'

export const StyledAnchor = styled.a(
  ({ theme }) => css`
    padding-right: ${theme.space['4']};
    position: relative;
    color: ${theme.colors.accent};
    cursor: pointer;
  `,
)

const OutlinkIcon = styled.div(
  ({ theme }) => css`
    position: absolute;
    top: ${theme.space['0']};
    right: ${theme.space['0']};
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
  ...props
}: Omit<ComponentProps<'a'>, 'href' | 'target' | 'rel'> &
  ComponentProps<typeof StyledAnchor> & {
    href: string | UrlObject
    fontVariant?: FontVariant
  }) => {
  const InnerContent = (
    <StyledAnchor {...props} rel="noreferrer noopener" target="_blank" role="link">
      <OutlinkTypography fontVariant={fontVariant} color="blue">
        {children}
      </OutlinkTypography>
      <OutlinkIcon as={OutlinkSVG} />
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
