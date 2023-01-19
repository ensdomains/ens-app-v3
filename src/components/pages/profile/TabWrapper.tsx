import styled, { css } from 'styled-components'

export const TabWrapper = styled.div(
  ({ theme }) => css`
    background-color: ${theme.colors.backgroundPrimary};
    border-radius: ${theme.radii['2xLarge']};
    border: ${theme.space.px} solid ${theme.colors.border};
  `,
)
