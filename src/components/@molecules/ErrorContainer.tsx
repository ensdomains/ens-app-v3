import { ExclamationSVG, Typography } from '@ensdomains/thorin'
import { ReactNode } from 'react'
import styled, { css } from 'styled-components'

const ErrorIcon = styled.div(
  ({ theme }) => css`
    background: rgba(255, 255, 255, 0.5);
    color: ${theme.colors.yellow};
    stroke-width: ${theme.space['0.5']};
    width: max-content;
    height: max-content;
    min-height: ${theme.space['12']};
    min-width: ${theme.space['12']};
    padding: ${theme.space['1']};
    border-radius: ${theme.radii.almostExtraLarge};
  `,
)

const StyledErrorContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['4']};
    flex-gap: ${theme.space['4']};
    grid-area: error;
    background: rgba(${theme.accentsRaw.yellow}, 0.25);
    border-radius: ${theme.radii['2xLarge']};
    padding: ${theme.space['2']};
    padding-right: ${theme.space['8']};
    color: ${theme.colors.textSecondary};
    & > div {
      line-height: ${theme.lineHeights.normal};
      & > a {
        color: ${theme.colors.blue};
      }
    }
  `,
)
export const ErrorContainer = ({
  message,
}: {
  // eslint-disable-next-line react/no-unused-prop-types
  type: 'warning' | 'error' | 'info'
  message: string | ReactNode
}) => {
  return (
    <StyledErrorContainer>
      <ErrorIcon as={ExclamationSVG} />
      <Typography variant="large" weight="bold">
        {message}
      </Typography>
    </StyledErrorContainer>
  )
}
