import { ComponentProps } from 'react'
import { useEnsAvatar } from 'wagmi'

import { Box, BoxProps } from '@ensdomains/thorin'

import NFTTemplate from './@molecules/NFTTemplate/NFTTemplate'

const StyledNftBox = (props: BoxProps) => (
  <Box {...props} width="$full" borderRadius="$large" overflow="hidden" />
)

export const NFTWithPlaceholder = ({
  name,
  ...props
}: {
  name: string
} & Omit<ComponentProps<'div'>, 'ref'>) => {
  const { data: avatar } = useEnsAvatar({ name })

  const isCompatible = !!(name && name.split('.').length === 2 && name.endsWith('.eth'))

  if (!isCompatible) return null
  return (
    <StyledNftBox {...props}>
      <NFTTemplate name={name} backgroundImage={avatar} isNormalised />
    </StyledNftBox>
  )
}
