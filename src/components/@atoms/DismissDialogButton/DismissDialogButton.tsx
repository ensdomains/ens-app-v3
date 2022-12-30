import { ButtonHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

import { CrossCircleSVG } from '@ensdomains/thorin'

const Container = styled.button(
  ({ theme }) => css`
    padding: ${theme.space['3']};
  `,
)

const IconWrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space['8']};
    height: ${theme.space['8']};
    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: ${theme.space['6']};
      height: ${theme.space['6']};
      color: ${theme.colors.greyPrimary};
    }
  `,
)

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>
const DismissDialogButton = (props: Props) => {
  return (
    <Container type="button" {...props}>
      <IconWrapper>
        <CrossCircleSVG />
      </IconWrapper>
    </Container>
  )
}

export default DismissDialogButton
