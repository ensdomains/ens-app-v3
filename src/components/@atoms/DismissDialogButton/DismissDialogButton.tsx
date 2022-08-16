import styled, { css } from 'styled-components'
import { CloseSVG } from '@ensdomains/thorin'
import { ButtonHTMLAttributes } from 'react'

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
    background: ${theme.colors.foregroundSecondary};
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: ${theme.space['3.5']};
      height: ${theme.space['3.5']};
      path {
        fill: ${theme.colors.textSecondary};
      }
    }
  `,
)

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>
const DismissDialogButton = (props: Props) => {
  return (
    <Container type="button" {...props}>
      <IconWrapper>
        <CloseSVG />
      </IconWrapper>
    </Container>
  )
}

export default DismissDialogButton
