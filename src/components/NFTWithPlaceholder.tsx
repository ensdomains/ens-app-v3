import { ComponentProps } from 'react'
import styled, { css } from 'styled-components'

import { useAvatar } from '@app/hooks/useAvatar'

import NFTTemplate from './@molecules/NFTTemplate/NFTTemplate'

const StyledNftBox = styled.div(
  ({ theme }) => css`
    width: 100%;
    border-radius: ${theme.radii['2xLarge']};
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.02);
    overflow: hidden;
  `,
)

const Container = styled.div(
  () => css`
    display: flex;
    align-items: center;
    justify-content: center;
  `,
)

export const NFTWithPlaceholder = ({
  name,
  network,
  ...props
}: {
  name: string
  network: number
} & Omit<ComponentProps<'div'>, 'ref'>) => {
  const { avatar } = useAvatar(name, network)

  const isCompatible = !!(name && name.split('.').length === 2 && name.endsWith('.eth'))

  if (!isCompatible) return null

  return (
    <Container>
      <StyledNftBox {...props}>
        <NFTTemplate name={name} backgroundImage={avatar} isNormalised />
      </StyledNftBox>
    </Container>
  )
}
