import { useState } from 'react'
import styled from 'styled-components'
import { NFTImage } from './NFTImage'

const StyledNftBox = styled.div<{ $loading: boolean }>`
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
}: {
  name: string
  network: string
}) => {
  const [nftLoading, setNftLoading] = useState(true)

  return (
    <StyledNftBox $loading={nftLoading}>
      <NFTImage name={name} network={network} callback={setNftLoading} />
    </StyledNftBox>
  )
}
