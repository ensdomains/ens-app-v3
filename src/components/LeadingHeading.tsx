import { Box, BoxProps, cssVars } from '@ensdomains/thorin'

export const LeadingHeading = (props: BoxProps) => (
  <Box
    width={{
      base: `calc(100% - calc(${cssVars.radii.large} * 2))`,
      sm: `calc(100% - calc(${cssVars.radii['2.5xLarge']} * 2))`,
    }}
    marginLeft={{ base: cssVars.radii.large, sm: cssVars.radii['2.5xLarge'] }}
    display="flex"
    flexDirection="row"
    alignItems="center"
    justifyContent="space-between"
    {...props}
  />
)
