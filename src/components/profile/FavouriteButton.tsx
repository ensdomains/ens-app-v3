import HeartSVG from '@app/assets/Heart.svg'
import type { ComponentProps } from 'react'
import styled from 'styled-components'

const FavouriteButtonContainer = styled.button`
  ${({ theme }) => `
    outline: none;
    background: none;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${theme.space['8']};
    height: ${theme.space['8']};
  `}
`

const HeartIcon = styled.svg`
  ${({ theme }) => `
    display: block;
    color: transparent;
    stroke: ${theme.colors.borderSecondary};
    width: ${theme.space['6']};
    height: ${theme.space['6']};
  `}
`

export const FavouriteButton = (
  props: ComponentProps<'button'> &
    ComponentProps<typeof FavouriteButtonContainer>,
) => {
  return (
    <FavouriteButtonContainer {...props}>
      <HeartIcon as={HeartSVG} />
    </FavouriteButtonContainer>
  )
}
