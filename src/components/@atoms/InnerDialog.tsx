import styled, { css } from 'styled-components'

export const InnerDialog = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: ${theme.space.full};
    gap: ${theme.space['4']};
    max-height: 60vh;
    max-width: 100vw;
    @media (min-width: ${theme.breakpoints.sm}px) {
      width: calc(80vw - 2 * ${theme.space['6']});
      max-width: ${theme.space['128']};
    }
  `,
)
