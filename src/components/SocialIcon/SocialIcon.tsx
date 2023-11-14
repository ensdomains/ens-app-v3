import { ElementType } from 'react'

import { Box, BoxProps, cssVars } from '@ensdomains/thorin'

import { coloredIcon, iconWrapper } from './style.css'

const SocialIconWrapper = (props: BoxProps) => (
  <Box
    {...props}
    as="a"
    className={iconWrapper}
    position="relative"
    cursor="pointer"
    display="flex"
    alignItems="center"
    justifyContent="center"
    width="$6"
    minHeight="$6"
  />
)

export const SocialIcon = ({
  Icon,
  ColoredIcon,
  color,
  href,
}: {
  Icon: ElementType
  ColoredIcon?: ElementType
  color?: string
  href: string
}) => {
  return (
    <SocialIconWrapper href={href} target="_blank">
      <Box
        key={href}
        as={Icon}
        fill={{ base: cssVars.color.grey, hover: color }}
        wh="$full"
        position="absolute"
        transition="all 0.15s ease-in-out"
      />
      {ColoredIcon && (
        <Box as={ColoredIcon} className={coloredIcon} wh="$full" position="absolute" />
      )}
    </SocialIconWrapper>
  )
}
