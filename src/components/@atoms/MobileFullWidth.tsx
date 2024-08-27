import styled, { css } from 'styled-components'

const MobileFullWidth = styled.div(
  ({ theme }) => css`
    & > div,
    & {
      width: ${theme.space.full};
      max-width: ${theme.space.full};
      @media (min-width: 640px) {
        min-width: ${theme.space['40']};
        width: fit-content;
        max-width: max-content;
      }
    }
  `,
)

export default MobileFullWidth
