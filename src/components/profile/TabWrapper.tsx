import styled from 'styled-components'

export const TabWrapper = styled.div`
  ${({ theme }) => `
  background-color: ${theme.colors.background};
  border-radius: ${theme.radii['2xLarge']};
  `}
`
