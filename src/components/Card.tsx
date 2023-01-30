import styled, { css } from 'styled-components'

export const Card = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radii['2xLarge']};
    background-color: ${theme.colors.background};
  `,
)
