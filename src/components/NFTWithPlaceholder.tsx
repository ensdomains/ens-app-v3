import { ComponentProps } from 'react'
import styled, { css } from 'styled-components'
import { useEnsAvatar } from 'wagmi'

import { ensAvatarConfig } from '@app/utils/query/ipfsGateway'

import NFTTemplate from './@molecules/NFTTemplate/NFTTemplate'

const StyledNftBox = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    border-radius: ${theme.radii.large};
    overflow: hidden;
  `,
)

export const NFTWithPlaceholder = ({
  name,
  ...props
}: {
  name: string
} & Omit<ComponentProps<'div'>, 'ref'>) => {
  const { data: avatar } = useEnsAvatar({ ...ensAvatarConfig, name })

  const isCompatible = !!(name && name.split('.').length === 2 && name.endsWith('.eth'))

  if (!isCompatible) return null

  return (
    <StyledNftBox {...props}>
      <NFTTemplate name={name} backgroundImage={avatar} isNormalised />
    </StyledNftBox>
  )
}
