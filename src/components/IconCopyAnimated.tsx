import { memo } from 'react'

import { Box, BoxProps, CheckSVG, CopySVG } from '@ensdomains/thorin'

const IconBox = ({ size, color, ...props }: Omit<BoxProps, 'size'> & SVGProps) => (
  <Box {...props} display="block" transition="all 0.15s ease-in-out" wh={size} color={color} />
)

type SVGProps = {
  size?: BoxProps['wh']
  color?: BoxProps['color']
}

export const IconCopyAnimated = memo(
  ({
    copied = false,
    size = '$6',
    color,
  }: {
    copied?: boolean
  } & SVGProps &
    Omit<BoxProps, 'size'>) => {
    return (
      <Box position="relative" color={color}>
        <IconBox
          as={<CheckSVG />}
          color={color}
          position="absolute"
          size={size}
          opacity={copied ? 1 : 0}
          visibility={copied ? 'visible' : 'hidden'}
        />
        <IconBox
          as={<CopySVG />}
          color={color}
          position="relative"
          size={size}
          opacity={copied ? 0 : 1}
          visibility={copied ? 'hidden' : 'visible'}
        />
      </Box>
    )
  },
)
