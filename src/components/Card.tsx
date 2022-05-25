import styled from 'styled-components'

export const Card = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => `
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.02);
    border-radius: ${theme.radii['2xLarge']};
    background-color: ${theme.colors.background};
  `}
`
