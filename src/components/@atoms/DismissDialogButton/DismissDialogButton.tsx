import { ButtonHTMLAttributes } from 'react'

import { Box, BoxProps, CrossSVG } from '@ensdomains/thorin'

const IconWrapper = (props: BoxProps) => (
  <Box
    {...props}
    wh="$9"
    borderRadius="$full"
    display="flex"
    alignItems="center"
    justifyContent="center"
    backgroundColor={{ base: 'transparent', hover: '$greySurface' }}
    transition="background-color 300ms ease-in-out"
  />
)

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>
const DismissDialogButton = (props: Props) => {
  return (
    <button type="button" {...props}>
      <IconWrapper>
        <Box as={<CrossSVG />} wh="$6" color="$grey" />
      </IconWrapper>
    </button>
  )
}

export default DismissDialogButton
