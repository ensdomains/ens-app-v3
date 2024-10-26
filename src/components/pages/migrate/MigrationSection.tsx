import styled, { css } from 'styled-components'

export const MigrationSection = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['6']};
    h3 {
      text-align: center;
    }
    & > div {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: ${theme.space['4']};
    }
    & > div > div {
      width: 100%;
      display: flex;
      align-items: center;
    }
    @media (min-width: 480px) {
      & > div {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `,
)
