import type { UrlObject } from 'url'

import Link from 'next/link'
import { ComponentProps } from 'react'

import { Box, BoxProps, Typography } from '@ensdomains/thorin'

import OutlinkSVG from '@app/assets/Outlink.svg'

import BaseLink from './@atoms/BaseLink'

export const StyledAnchor = (props: BoxProps) => (
  <Box {...props} as="a" paddingRight="$4" position="relative" color="$accent" cursor="pointer" />
)

export const Outlink = ({
  href,
  children,
  ...props
}: Omit<ComponentProps<'a'>, 'href' | 'target' | 'rel'> &
  ComponentProps<typeof StyledAnchor> & {
    href: string | UrlObject
  }) => {
  const InnerContent = (
    <StyledAnchor {...props} rel="noreferrer noopener" target="_blank" role="link">
      <Typography fontVariant="smallBold" color="blue" display="inline-block">
        {children}
      </Typography>
      <Box as={OutlinkSVG} position="absolute" top="$0" right="$0" wh="$3.5" opacity="0.5" />
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
