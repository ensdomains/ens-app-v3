import { ButtonHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

import { CrossSVG } from '@ensdomains/thorin'

const IconWrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space['9']};
    height: ${theme.space['9']};
    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    transition: background-color 300ms ease-in-out;

    svg {
      width: ${theme.space['6']};
      height: ${theme.space['6']};
      color: ${theme.colors.greyPrimary};
    }

    :hover {
      background-color: ${theme.colors.greySurface};
    }
  `,
)

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>
const DismissDialogButton = (props: Props) => {
  return (
    <button type="button" {...props}>
      <IconWrapper>
        <CrossSVG />
      </IconWrapper>
    </button>
  )
}

export default DismissDialogButton
