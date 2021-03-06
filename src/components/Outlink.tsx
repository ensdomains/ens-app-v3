import OutlinkSVG from '@app/assets/Outlink.svg'
import { Typography } from '@ensdomains/thorin'
import Link from 'next/link'
import { ComponentProps } from 'react'
import styled, { css } from 'styled-components'
import type { UrlObject } from 'url'

const StyledAnchor = styled.a(
  ({ theme }) => css`
    padding-right: ${theme.space['4']};
    position: relative;
    color: ${theme.colors.accent};
  `,
)

const OutlinkIcon = styled.div(
  ({ theme }) => css`
    position: absolute;
    top: ${theme.space['0']};
    right: ${theme.space['0']};
    width: ${theme.space['3.5']};
    height: ${theme.space['3.5']};
    opacity: ${theme.opacity[50]};
  `,
)

export const Outlink = ({
  href,
  children,
  ...props
}: Omit<ComponentProps<'a'>, 'href'> &
  ComponentProps<typeof StyledAnchor> & {
    href: string | UrlObject
  }) => {
  return (
    <Link href={href} passHref>
      <StyledAnchor {...props}>
        <Typography variant="small" weight="bold">
          {children}
        </Typography>
        <OutlinkIcon as={OutlinkSVG} />
      </StyledAnchor>
    </Link>
  )
}
