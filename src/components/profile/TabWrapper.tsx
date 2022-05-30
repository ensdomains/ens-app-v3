import styled from 'styled-components'

export const TabWrapper = styled.div`
  ${({ theme }) => `
    background-color: ${theme.colors.background};
    border-radius: ${theme.radii['2xLarge']};
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.02);
  `}
`
