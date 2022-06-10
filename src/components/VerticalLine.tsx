import styled, { css } from 'styled-components'

export const VerticalLine = styled.div(
  ({ theme }) => css`
    width: 1px;
    background-color: ${theme.colors.borderSecondary};
  `,
)
