import { ButtonHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

import { CrossSVG } from '@ensdomains/thorin'

type Props = {
  size?: 'medium' | 'large'
} & ButtonHTMLAttributes<HTMLButtonElement>

const Button = styled.button<{ $size: 'small' | 'medium' | 'large' }>(
  ({ theme, $size }) => css`
    display: flex;
    justify-content: center;
    align-items: center;

    ${$size === 'medium' &&
    css`
      padding: ${theme.space['3.5']};
    `}

    ${$size === 'large' &&
    css`
      padding: ${theme.space['4']};
    `}

    svg {
      display: block;
      color: ${theme.colors.textTertiary};

      ${$size === 'medium' &&
      css`
        width: ${theme.space[4]};
        height: ${theme.space[4]};
      `}

      ${$size === 'large' &&
      css`
        width: ${theme.space[6]};
        height: ${theme.space[6]};
      `}
    }
  `,
)

export const DeleteButton = ({ size = 'medium', type = 'button', ...props }: Props) => {
  return (
    <Button $size={size} type={type} {...props}>
      <CrossSVG />
    </Button>
  )
}
