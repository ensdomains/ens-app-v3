import { Typography } from '@ensdomains/thorin'
import styled, { css } from 'styled-components'

export const SectionContainer = styled.div<{ $name?: string }>`
  ${({ theme, $name }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: ${theme.space['1.5']};
    flex-gap: ${theme.space['1.5']};
    ${$name &&
    css`
      grid-area: ${$name};
    `}
  `}
`

export const SectionHeading = styled(Typography)`
  ${({ theme }) => css`
    font-size: ${theme.fontSizes.extraLarge};
  `}
`
