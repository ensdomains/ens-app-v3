import { Box, BoxProps, cssVars } from '@ensdomains/thorin'

import CircleTick from '@app/assets/CircleTick.svg'

const Container = (props: BoxProps) => (
  <Box {...props} as="button" cursor="pointer" flex={`0 0 ${cssVars.space['9']}`} wh="$9" />
)

type Props = {
  active?: boolean
  onChange?: (value: boolean) => void
}

export const CheckButton = ({ active = false, onChange }: Props) => {
  return (
    <Container type="button" onClick={() => onChange?.(!active)} data-testid="check-button">
      <Box
        as={<CircleTick />}
        fill="none"
        strokeWidth={{ base: '1px', hover: '1.5px' }}
        color={{ base: active ? '$accent' : '$grey', hover: '$accent' }}
        transition="all 0.15s ease-in-out"
      />
    </Container>
  )
}
