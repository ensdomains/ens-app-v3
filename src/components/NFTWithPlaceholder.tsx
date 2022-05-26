import { useNFTImage } from '@app/hooks/useAvatar'
import { ComponentProps } from 'react'
import styled from 'styled-components'

const StyledNftBox = styled.img<{ $loading: boolean }>`
  ${({ theme, $loading }) => `
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${$loading ? theme.colors.accentGradient : 'none'};
  border-radius: ${theme.radii['2xLarge']};
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.02);
  & > span {
    border-radius: ${theme.radii['2xLarge']};
  }
  `}
`

export const NFTWithPlaceholder = ({
  name,
  network,
  ...props
}: {
  name: string
  network: string
} & ComponentProps<'img'> &
  ComponentProps<typeof StyledNftBox>) => {
  const { image, isLoading } = useNFTImage(name, network)

  return <StyledNftBox {...{ ...props, $loading: isLoading, src: image }} />
}
