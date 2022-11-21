import styled, { css } from 'styled-components'

export const ContentGrid = styled.div(
  ({ theme }) => css`
    flex-grow: 1;
    width: 100%;
    max-width: ${theme.space['192']};
    overflow: hidden;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['5']};
  `,
)
