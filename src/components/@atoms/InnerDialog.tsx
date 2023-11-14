import { Box, BoxProps, cssVars } from '@ensdomains/thorin'

export const InnerDialog = (props: BoxProps) => (
  <Box
    {...props}
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="flex-start"
    width={{ base: '$full', sm: `calc(80vw - 2 * ${cssVars.space['6']})` }}
    gap="$4"
    maxHeight="60vh"
    maxWidth={{ base: '100vw', sm: cssVars.space['128'] }}
  />
)
